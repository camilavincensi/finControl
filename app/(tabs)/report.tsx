import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import type { Transaction } from '@/app/Interface/transaction';
import {db} from "@/src/config/firebase";
import PieChartComponent from "@/components/pieChart";
import {useTransactions} from "@/hooks/useTransaction";

export default function Reports() {

    const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');

    const insets = useSafeAreaInsets();

    // --- FIRESTORE LOADING ---
    const { transactions, loading } = useTransactions();

    const tx = transactions;

    // --- EXPENSES BY CATEGORY ---
    const expensesByCategory = useMemo(() => {
        return tx
            .filter((t) => t.type === 'expense')
            .reduce((acc, t) => {
                const key = t.category ?? 'Outros';
                acc[key] = (acc[key] || 0) + (t.amount || 0);
                return acc;
            }, {} as Record<string, number>);
    }, [tx]);


    // --- TOTALS ---
    const { totalIncome, totalExpense, balance } = useMemo(() => {
        const ti = tx.filter((t) => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
        const te = tx.filter((t) => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
        return { totalIncome: ti, totalExpense: te, balance: ti - te };
    }, [tx]);

    const highestExpense = useMemo(() => {
        const entries = Object.entries(expensesByCategory);
        if (entries.length === 0) return null;

        const [name, value] = entries.reduce((max, curr) =>
            curr[1] > max[1] ? curr : max
        );

        return { name, value };
    }, [expensesByCategory]);


    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Relatórios</Text>

                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        onPress={() => setPeriod('monthly')}
                        style={[styles.toggleBtn, period === 'monthly' ? styles.toggleBtnActive : styles.toggleBtnInactive]}
                    >
                        <Text style={period === 'monthly' ? styles.toggleTextActive : styles.toggleTextInactive}>Mensal</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollInner}>
                {/* Summary Cards */}
                <View style={styles.cardsRow}>
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Receitas</Text>
                        <Text style={[styles.cardValue, { color: '#00B37E' }]}>R$ {totalIncome.toFixed(0)}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Despesas</Text>
                        <Text style={[styles.cardValue, { color: '#EF4444' }]}>R$ {totalExpense.toFixed(0)}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Saldo</Text>
                        <Text style={[styles.cardValue, { color: balance >= 0 ? '#00B37E' : '#EF4444' }]}>
                            R$ {balance.toFixed(0)}
                        </Text>
                    </View>
                </View>

                {/* Pie Chart */}
                <View style={styles.block}>
                    <PieChartComponent expensesByCategory={expensesByCategory}/>
                </View>

                {/* Insights */}
                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Destaques do Período</Text>

                    {highestExpense && (
                        <View style={[styles.insight, { backgroundColor: '#FEF2F2' }]}>
                            <Text style={styles.insightTitle}>Maior gasto: {highestExpense.name}</Text>
                            <Text style={styles.insightSub}>
                                R$ {highestExpense.value.toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    )}

                    <View
                        style={[
                            styles.insight,
                            { backgroundColor: balance >= 0 ? '#ECFDF5' : '#FEF2F2' },
                        ]}
                    >
                        <Text style={[styles.insightTitle, { color: balance >= 0 ? '#00B37E' : '#EF4444' }]}>
                            {balance >= 0 ? 'Saldo positivo!' : 'Saldo negativo'}
                        </Text>
                        <Text style={[styles.insightSub, { color: balance >= 0 ? '#00B37E' : '#EF4444' }]}>
                            {balance >= 0 ? '+' : ''} R$ {balance.toFixed(2).replace('.', ',')}
                        </Text>
                    </View>

                    <View style={[styles.insight, { backgroundColor: '#EFF6FF' }]}>
                        <Text style={styles.insightTitle}>Total de transações</Text>
                        <Text style={styles.insightSub}>{tx.length} registradas</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', paddingBottom: 24 },
    header: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { color: '#111827', fontSize: 20, fontWeight: '600', marginBottom: 12 },
    toggleRow: { flexDirection: 'row', gap: 8 },
    toggleBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    toggleBtnActive: { backgroundColor: '#00B37E' },
    toggleBtnInactive: { backgroundColor: '#F3F4F6' },
    toggleTextActive: { color: '#FFFFFF', fontWeight: '500' },
    toggleTextInactive: { color: '#4B5563', fontWeight: '500' },

    scrollInner: { padding: 16, gap: 16 },

    cardsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, width: '31%' },
    cardLabel: { color: '#6B7280', fontSize: 12, marginBottom: 4 },
    cardValue: { fontSize: 16, fontWeight: '600' },

    block: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, elevation: 2 },
    blockTitle: { color: '#111827', fontSize: 16, fontWeight: '600', marginBottom: 12 },

    seriesTitle: { fontSize: 13, color: '#111827', fontWeight: '600', marginBottom: 6 },
    axisText: { color: '#9CA3AF' },

    legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 8 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { color: '#4B5563', fontSize: 12 },

    emptyText: { color: '#9CA3AF', textAlign: 'center', paddingVertical: 24 },

    pieRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
    pieLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    pieName: { color: '#374151', fontSize: 14 },
    pieValue: { color: '#111827', fontSize: 14 },

    insight: { borderRadius: 12, padding: 12, marginBottom: 8 },
    insightTitle: { color: '#111827', fontSize: 14, fontWeight: '600' },
    insightSub: { color: '#6B7280', fontSize: 13, marginTop: 2 },
});
