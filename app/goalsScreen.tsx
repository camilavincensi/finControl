import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/src/config/firebase';
import { useRouter } from "expo-router";

export default function GoalsScreen() {
    const user = auth.currentUser;
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    // -------------------------------
    // CAMPOS DE METAS E LIMITES
    // -------------------------------
    const [savingGoal, setSavingGoal] = useState("");
    const [monthlyLimit, setMonthlyLimit] = useState("");
    const [dailyLimit, setDailyLimit] = useState("");
    const [annualGoal, setAnnualGoal] = useState("");
    const [bigPurchaseGoal, setBigPurchaseGoal] = useState("");

    useEffect(() => {
        if (!user) return;

        async function loadGoals() {
            const ref = doc(collection(db, 'goals'), user!.uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                const data = snap.data();

                setSavingGoal(data.savingGoal?.toString() || "");
                setMonthlyLimit(data.monthlyLimit?.toString() || "");
                setDailyLimit(data.dailyLimit?.toString() || "");
                setAnnualGoal(data.annualGoal?.toString() || "");
                setBigPurchaseGoal(data.bigPurchaseGoal?.toString() || "");
            }

            setLoading(false);
        }

        loadGoals();
    }, [user]);

    async function saveGoals() {
        if (!user) return;

        const ref = doc(collection(db, 'goals'), user.uid);

        await setDoc(ref, {
            userId: user.uid,
            savingGoal: Number(savingGoal),
            monthlyLimit: Number(monthlyLimit),
            dailyLimit: Number(dailyLimit),
            annualGoal: Number(annualGoal),
            bigPurchaseGoal: Number(bigPurchaseGoal),
        }, { merge: true });

        Alert.alert("Sucesso", "Metas e limites foram atualizados!");
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>Carregando...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7fb" }}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace("/config")}
                >
                    <Ionicons name="arrow-back" size={22} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Metas e Limites</Text>
                <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={styles.container}>

                    {renderInputCard("Meta de economia mensal (R$)", savingGoal, setSavingGoal)}
                    {renderInputCard("Limite mensal de gastos (R$)", monthlyLimit, setMonthlyLimit)}
                    {renderInputCard("Limite diário de gastos (R$)", dailyLimit, setDailyLimit)}
                    {renderInputCard("Meta de economia anual (R$)", annualGoal, setAnnualGoal)}
                    {renderInputCard("Meta para grande compra (R$)", bigPurchaseGoal, setBigPurchaseGoal)}

                    <TouchableOpacity style={styles.primaryButton} onPress={saveGoals}>
                        <Text style={styles.primaryButtonText}>Salvar metas</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// -----------------------------------------------------
// COMPONENTE DE INPUT
// -----------------------------------------------------
function renderInputCard(label: string, value: string, setter: (t: string) => void) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{label}</Text>

            <TextInput
                keyboardType="numeric"
                value={value}
                onChangeText={(t) => setter(t.replace(/[^\d.,]/g, ""))}
                placeholder="Digite um valor"
                style={styles.input}
            />
        </View>
    );
}

// -----------------------------------
// STYLES
// -----------------------------------
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 6,
        backgroundColor: "#f7f7fb",
    },
    backButton: { padding: 8 },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        elevation: 2,
    },
    cardTitle: {
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        width: "100%",
    },
    primaryButton: {
        backgroundColor: "#00b37e",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        width: "100%",
    },
    primaryButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
