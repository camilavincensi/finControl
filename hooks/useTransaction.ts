import { useEffect, useState } from "react";
import { db, auth } from "@/src/config/firebase";
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import * as Notifications from "expo-notifications";
import { Transaction } from "@/app/Interface/transaction";
import {parseCustomDateAny} from "@/src/utils/convertDate";
import {saveAlertHistory} from "@/src/service/alertHistoryService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid),
            orderBy("date", "desc")


        );
        const unsub = onSnapshot(q, async (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as unknown as Transaction[];

            setTransactions(data);
            setLoading(false);

            await checkGoalsAndNotify(user.uid, data);

        });


        return () => unsub();

    }, []);

    return { transactions, loading };
}

async function checkGoalsAndNotify(userId: string, transactions: Transaction[]) {
    if (!transactions.length) return;

    const goalsSnap = await getDoc(doc(db, "goals", userId));
    const alertsSnap = await getDoc(doc(db, "alerts", userId));

    if (!goalsSnap.exists() || !alertsSnap.exists()) return;

    const goals = goalsSnap.data();
    const alerts = alertsSnap.data();
    const now = new Date();

    const total = {
        month: 0,
        day: 0,
        year: 0,
        savings: 0,
    };

    transactions.forEach((t) => {
        const d = parseCustomDateAny(t.date);
        const amount = Number(t.amount);

        if (isNaN(d.getTime())) return;

        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
            if (t.type === "expense") total.month += amount;
            if (t.type === "income") total.savings += amount;
        }

        if (d.toDateString() === now.toDateString()) {
            if (t.type === "expense") total.day += amount;
        }

        // ano corrente
        if (d.getFullYear() === now.getFullYear()) {
            if (t.type === "expense") total.year += amount;
        }
    });

    const balanceMonth = total.savings - total.month; // economia real mensal


    const notify = async (title: string, body: string) =>
        Notifications.scheduleNotificationAsync({ content: { title, body }, trigger: null });

    // ---------------- Notificações ----------------
    if (alerts.monthlyAlert && goals.monthlyLimit && total.month > goals.monthlyLimit) {

        if (await canNotify("monthlyAlert", 10)) {
            const message = `Você já gastou R$ ${total.month.toFixed(2)} este mês.`;

            await notify("⚠ Limite mensal ultrapassado!", message);

            await saveAlertHistory(
                userId,
                message,
                "monthlyAlert"
            );
        }
    }


    if (alerts.dailyLimitAlert && goals.dailyLimit && total.day > goals.dailyLimit) {

        if (await canNotify("dailyLimitAlert", 10)) {
            const message = `Você já gastou R$ ${total.day.toFixed(2)} hoje.`;

            await notify("⚠ Limite diário ultrapassado!", message);

            await saveAlertHistory(
                userId,
                message,
                "dailyLimitAlert"
            );
        }
    }


    if (alerts.annualGoalAlert && goals.annualGoal && total.year > goals.annualGoal) {
        if (await canNotify("annualGoalAlert", 10)) {
            const message = `Você alcançou sua meta anual!`;

            await notify("🎯 Meta anual concluída!", message);

            await saveAlertHistory(
                userId,
                message,
                "annualGoalAlert"
            );
        }
    }

    if (alerts.savingGoalAlert && goals.savingGoal && balanceMonth >= goals.savingGoal) {
        if (await canNotify("savingGoalAlert", 10)) {
            const message = `Você economizou R$ ${balanceMonth.toFixed(2)} este mês!`;

            await notify("🎯 Meta de economia atingida!", message);

            await saveAlertHistory(
                userId,
                message,
                "savingGoalAlert"
            );
        }
    }

    if (alerts.bigPurchaseAlert && goals.bigPurchaseGoal && total.year >= goals.bigPurchaseGoal) {
        if (await canNotify("bigPurchaseAlert", 10)) {
            const message = `Sua meta de grande compra foi alcançada!`;

            await notify("🚀 Objetivo de grande compra conquistado!", message);

            await saveAlertHistory(
                userId,
                message,
                "bigPurchaseAlert"
            );
        }
    }
}

export async function canNotify(alertType: string, cooldownMinutes: number) {
    const key = `lastNotify_${alertType}`;
    const last = await AsyncStorage.getItem(key);
    const now = Date.now();

    if (last) {
        const lastTime = Number(last);
        if (now - lastTime < cooldownMinutes * 60 * 1000) {
            return false;
        }
    }

    await AsyncStorage.setItem(key, now.toString());
    return true;
}