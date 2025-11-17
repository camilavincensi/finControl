import React, { useState } from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AddButton from "@/components/addButton";
import PieChartComponent from "@/components/pieChart";
import TransactionsPreview from "@/components/previewTransactions";
import {useRouter} from "expo-router";
import {useTransactions} from "@/hooks/useTransaction";

// ------------------ COMPONENTE ------------------
export default function Home() {

    const insets = useSafeAreaInsets();

    const [open, setOpen] = useState(false);

    const { transactions, loading } = useTransactions();

    const router = useRouter();

    // ------------------ CÁLCULOS ------------------
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);


    // ------------------ LAYOUT ------------------
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={{ paddingTop: insets.top }}>
                    <View style={styles.headerTop}>
                        <Text style={styles.headerTitle}>Dashboard</Text>
                        <TouchableOpacity onPress={() => router.navigate("/historyScreen")}>
                            <MaterialIcons name="notifications" size={26} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceLabel}>Saldo Total</Text>
                        <Text
                            style={[
                                styles.balanceValue,
                                balance < 0 && { color: '#F87171' }
                            ]}
                        >
                            R$ {balance.toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                </View>
            </View>

            {/* CARDS SOBREPOSTOS */}
            <View style={styles.overlapCards}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: '#D1FAE5' }]}>
                            <MaterialIcons name="arrow-upward" size={22} color="#00B37E" />
                        </View>
                        <Text style={styles.cardLabel}>Receitas</Text>
                    </View>
                    <Text style={[styles.cardValue, { color: '#00B37E' }]}>
                        R$ {totalIncome.toFixed(2).replace('.', ',')}
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                            <MaterialIcons name="arrow-downward" size={22} color="#EF4444" />
                        </View>
                        <Text style={styles.cardLabel}>Despesas</Text>
                    </View>
                    <Text style={[styles.cardValue, { color: '#EF4444' }]}>
                        R$ {totalExpense.toFixed(2).replace('.', ',')}
                    </Text>
                </View>
            </View>

            {/* CONTEÚDO PRINCIPAL */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Gráfico */}
                <PieChartComponent expensesByCategory={expensesByCategory}/>

                <TransactionsPreview
                    transactions={transactions}
                    onPressSeeAll={() => router.replace('/transaction')} // ajuste o nome da rota
                />

            </ScrollView>

            <AddButton openExternally={open} />

        </View>
    );
}

// ------------------ ESTILOS ------------------
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        backgroundColor: '#00B37E',
        paddingBottom: 60,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
    balanceContainer: { alignItems: 'center', marginTop: 16 },
    balanceLabel: { color: 'white', opacity: 0.8 },
    balanceValue: { color: 'white', fontSize: 28, fontWeight: '700', marginTop: 4 },
    overlapCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -40,
        paddingHorizontal: 20,
        zIndex: 10,
        gap: 20,
    },
    scrollContent: { paddingTop: 10, paddingHorizontal: 20, paddingBottom: 100 },
    card: { flex: 1, backgroundColor: 'white', borderRadius: 16, padding: 20, gap: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    cardLabel: { color: '#6B7280', fontSize: 14 },
    cardValue: { fontSize: 18, fontWeight: '600', marginTop: 10 },
    chartContainer: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginTop: 16 },
    chartTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16, color: '#111827' },
    legendContainer: { marginTop: 16 },
    legendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendLabel: { color: '#374151', fontSize: 14 },
    legendValue: { color: '#111827', fontSize: 14 },
    noDataText: { textAlign: 'center', color: '#9CA3AF', paddingVertical: 20 },
    transactionsSection: { marginTop: 16 },
    transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    transactionsTitle: { color: '#111827', fontSize: 16, fontWeight: '600' },
    link: { color: '#00B37E', fontSize: 14 },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        alignItems: 'center',
        gap: 20,
    },
    transactionLeft: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    transactionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    transactionCategory: { color: '#111827', fontSize: 15 },
    transactionDate: { color: '#9CA3AF', fontSize: 13, marginTop: 6 },
    transactionAmount: { fontWeight: '600', fontSize: 15 },

});
