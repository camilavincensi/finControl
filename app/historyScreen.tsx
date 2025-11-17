import React from "react";
import {View, Text, ScrollView, StyleSheet, SafeAreaView, Alert, TouchableOpacity} from "react-native";
import { useAlertHistory } from "@/hooks/useAlertsHistory";
import Svg, { Path } from "react-native-svg";
import {clearAlertHistory} from "@/src/service/alertHistoryService";
import { auth } from '@/src/config/firebase';
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "expo-router";

export default function HistoryScreen() {
    const { alerts, loading } = useAlertHistory();

    const navigation = useNavigation();

    const handleClear = () => {
        Alert.alert(
            "Limpar histórico",
            "Tem certeza que deseja apagar todas as notificações?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar",
                    style: "destructive",
                    onPress: async () => {
                        const user = auth.currentUser;
                        if (!user) return;
                        await clearAlertHistory(user.uid);
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerRow}>
                    {/* BOTÃO DE VOLTAR */}
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#111827" />
                    </TouchableOpacity>

                    {/* TÍTULO */}
                    <Text style={styles.sectionTitle}>Histórico de Notificações</Text>

                    {/* BOTÃO LIMPAR HISTÓRICO */}
                    <TouchableOpacity onPress={() => handleClear()} style={styles.trashBtn}>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                {loading && <Text style={styles.loadingText}>Carregando...</Text>}

                {alerts.map((alert) => (
                    <NotificationCard
                        key={alert.id}
                        bg={getTheme(alert.type).bg}
                        border={getTheme(alert.type).border}
                        iconColor={getTheme(alert.type).icon}
                        title={alert.message}
                        subtitle={alert.createdAt ? alert.createdAt.toLocaleString("pt-BR") : ""}
                    />
                ))}

                {!loading && alerts.length === 0 && (
                    <Text style={styles.emptyText}>Nenhuma notificação encontrada.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

function getTheme(type: string) {
    switch (type) {
        case "warning":
            return { bg: "#FEF3C7", border: "#F59E0B", icon: "#D97706" };
        case "danger":
            return { bg: "#FEE2E2", border: "#EF4444", icon: "#DC2626" };
        case "success":
            return { bg: "#ECFDF5", border: "#00B37E", icon: "#00B37E" };
        default:
            return { bg: "#E5E7EB", border: "#9CA3AF", icon: "#6B7280" };
    }
}

function NotificationCard({
                              bg,
                              border,
                              iconColor,
                              title,
                              subtitle,
                          }: {
    bg: string;
    border: string;
    iconColor: string;
    title: string;
    subtitle: string;
}) {
    return (
        <View style={[styles.notificationCard, { backgroundColor: bg, borderLeftColor: border }]}>
            <Svg width={24} height={24} stroke={iconColor} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                <Path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0L3.3 16a2 2 0 001.7 3z" />
            </Svg>

            <View style={{ flex: 1 }}>
                <Text style={styles.notificationTitle}>{title}</Text>
                <Text style={styles.notificationSubtitle}>{subtitle}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
        gap: 12,
    },
    clearBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#EF4444",
        borderRadius: 8
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 10,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    backBtn: {
        padding: 4,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    trashBtn: {
        padding: 4,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    clearBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
    loadingText: {
        fontSize: 14,
        color: "#6B7280",
    },
    emptyText: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 5,
    },
    notificationCard: {
        padding: 16,
        borderRadius: 14,
        borderLeftWidth: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    notificationTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
    notificationSubtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },
});
