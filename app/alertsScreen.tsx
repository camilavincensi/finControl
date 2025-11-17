import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/src/config/firebase';
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

async function askPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
    }
}

export default function AlertsScreen() {
    const router = useRouter();
    const user = auth.currentUser;

    const [loading, setLoading] = useState(true);

    // Estados dos alertas
    const [monthlyAlert, setMonthlyAlert] = useState(false);
    const [dailyAlert, setDailyAlert] = useState(false);
    const [savingGoalAlert, setSavingGoalAlert] = useState(false);
    const [annualGoalAlert, setAnnualGoalAlert] = useState(false);
    const [bigPurchaseAlert, setBigPurchaseAlert] = useState(false);

    useEffect(() => {
        if (!user) return;

        async function loadAlerts() {
            const ref = doc(collection(db, "alerts"), user!.uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                const data = snap.data();

                setMonthlyAlert(data.monthlyAlert ?? false);
                setDailyAlert(data.dailyAlert ?? false);
                setSavingGoalAlert(data.savingGoalAlert ?? false);
                setAnnualGoalAlert(data.annualGoalAlert ?? false);
                setBigPurchaseAlert(data.bigPurchaseAlert ?? false);
            }

            setLoading(false);
        }

        loadAlerts();
    }, [user]);

    async function saveAlerts() {
        if (!user) return;

        const ref = doc(collection(db, "alerts"), user.uid);

        await setDoc(
            ref,
            {
                userId: user.uid,
                monthlyAlert,
                dailyAlert,
                savingGoalAlert,
                annualGoalAlert,
                bigPurchaseAlert,
            },
            { merge: true }
        );

        Alert.alert("Sucesso", "Alertas atualizados!");
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>Carregando...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.headerRow}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace("/config")}
                >
                    <Ionicons name="arrow-back" size={22} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Alertas</Text>

                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.sectionTitle}>Ativar notificações para:</Text>

                {renderSwitchCard("Atingir limite mensal de gastos", monthlyAlert, setMonthlyAlert)}
                {renderSwitchCard("Atingir limite diário de gastos", dailyAlert, setDailyAlert)}

                {renderSwitchCard(
                    "Progresso da meta de economia mensal",
                    savingGoalAlert,
                    setSavingGoalAlert
                )}
                {renderSwitchCard(
                    "Progresso da meta de economia anual",
                    annualGoalAlert,
                    setAnnualGoalAlert
                )}
                {renderSwitchCard(
                    "Progresso da meta para grande compra",
                    bigPurchaseAlert,
                    setBigPurchaseAlert
                )}

                <TouchableOpacity style={styles.primaryButton} onPress={saveAlerts}>
                    <Text style={styles.primaryButtonText}>Salvar alertas</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function renderSwitchCard(title: string, value: boolean, setter: (v: boolean) => void) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Switch
                value={value}
                onValueChange={(v) => {
                    setter(v);
                    if (v) askPermissions(); // solicita permissões ao ativar
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f7f7fb",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 6,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
    },
    container: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginVertical: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "600",
    },
    primaryButton: {
        backgroundColor: "#00b37e",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});
