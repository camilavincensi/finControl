import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formatDateForDisplay } from "@/src/utils/convertDate";
import { Transaction } from "@/app/Interface/transaction";

interface TransactionsPreviewProps {
    transactions: Transaction[];
    onPressSeeAll: () => void;
}

export default function TransactionsPreview({
                                                transactions,
                                                onPressSeeAll,
                                            }: TransactionsPreviewProps) {
    const recent = transactions.slice(0, 4);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Transações Recentes</Text>
                <TouchableOpacity onPress={onPressSeeAll}>
                    <Text style={styles.link}>Ver todas</Text>
                </TouchableOpacity>
            </View>

            {/* Lista */}
            {recent.length === 0 ? (
                <Text style={styles.empty}>Nenhuma transação</Text>
            ) : (
                recent.map((t) => (
                    <View key={t.id} style={styles.item}>
                        <View style={styles.left}>
                            <View
                                style={[
                                    styles.iconCircle,
                                    t.type === "income"
                                        ? styles.incomeCircle
                                        : styles.expenseCircle,
                                ]}
                            >
                                {t.type === "income" ? (
                                    <Feather name="arrow-up" size={20} color="#00B37E" />
                                ) : (
                                    <Feather name="arrow-down" size={20} color="#EF4444" />
                                )}
                            </View>

                            <View>
                                <Text style={styles.category}>{t.category}</Text>
                                <Text style={styles.date}>
                                    {formatDateForDisplay(t.date)}
                                </Text>
                            </View>
                        </View>

                        <Text
                            style={[
                                styles.amount,
                                t.type === "income" ? styles.green : styles.red,
                            ]}
                        >
                            {t.type === "income" ? "+" : "-"} R$
                            {t.amount.toFixed(2).replace(".", ",")}
                        </Text>
                    </View>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    link: {
        color: "#00B37E",
        fontWeight: "500",
    },
    empty: {
        color: "#9CA3AF",
        textAlign: "center",
        paddingVertical: 20,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    left: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    incomeCircle: { backgroundColor: "#D1FAE5" },
    expenseCircle: { backgroundColor: "#FEE2E2" },

    category: {
        fontSize: 15,
        fontWeight: "500",
        color: "#111827",
    },
    date: {
        fontSize: 12,
        color: "#6B7280",
    },

    amount: {
        fontSize: 15,
        fontWeight: "600",
    },
    green: { color: "#00B37E" },
    red: { color: "#EF4444" },
});
