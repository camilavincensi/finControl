import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { Transaction } from '@/app/Interface/transaction';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface ReportsProps {
    transactions?: Transaction[]; // torna opcional para evitar crash se vier undefined
}

const COLORS = ['#00B37E', '#FF6B6B', '#4ECDC4', '#FFD93D', '#A78BFA', '#F472B6'];

export default function Reports({ transactions }: ReportsProps) {
    const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');
    const tx = transactions ?? []; // guarda de segurança contra undefined

    const insets = useSafeAreaInsets();

    // --- EXPENSES BY CATEGORY ---
    const expensesByCategory = useMemo(() => {
        return tx
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const key = t.category ?? 'Outros';
                acc[key] = (acc[key] || 0) + (t.amount || 0);
                return acc;
            }, {} as Record<string, number>);
    }, [tx]);

    const pieDataSorted = useMemo(
        () =>
            Object.entries(expensesByCategory)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value),
        [expensesByCategory]
    );

    // --- MONTHLY EVOLUTION ---
    const monthlyBarData = useMemo(() => {
        const map = tx.reduce((acc, t) => {
            const m = new Date(t.date).toLocaleDateString('pt-BR', { month: 'short' });
            if (!acc[m]) acc[m] = { month: m, income: 0, expense: 0 };
            if (t.type === 'income') acc[m].income += t.amount || 0;
            else acc[m].expense += t.amount || 0;
            return acc;
        }, {} as Record<string, { month: string; income: number; expense: number }>);

        // react-native-gifted-charts BarChart: data: {value,label,frontColor}[]
        const ordered = Object.values(map);
        const incomeSeries = ordered.map(it => ({
            value: Number(it.income) || 0,
            label: it.month,
            frontColor: '#00B37E',
        }));
        const expenseSeries = ordered.map(it => ({
            value: Number(it.expense) || 0,
            label: it.month,
            frontColor: '#FF6B6B',
        }));

        // Podemos mostrar uma série por vez ou empilhado. A lib não empilha por default.
        // Aqui vou mostrar a série de receita e, abaixo, uma de despesas (2 charts simples) para manter tipos 100% compatíveis.
        return { incomeSeries, expenseSeries, hasData: ordered.length > 0 };
    }, [tx]);

    // --- TOTALS ---
    const { totalIncome, totalExpense, balance } = useMemo(() => {
        const ti = tx.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
        const te = tx.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
        return { totalIncome: ti, totalExpense: te, balance: ti - te };
    }, [tx]);

    const highestExpense = pieDataSorted.length > 0 ? pieDataSorted[0] : null;

    // --- PIE DATA for gifted-charts ---
    // gifted-charts PieChart espera: data: {value:number, color:string, text?:string}[]
    const pieChartData = useMemo(
        () =>
            pieDataSorted.map((item, idx) => ({
                value: item.value,
                color: COLORS[idx % COLORS.length],
                text: item.name, // aparece no centro se quiser
            })),
        [pieDataSorted]
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Relatórios</Text>

                {/* Period Toggle */}
                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        onPress={() => setPeriod('monthly')}
                        style={[styles.toggleBtn, period === 'monthly' ? styles.toggleBtnActive : styles.toggleBtnInactive]}
                    >
                        <Text style={period === 'monthly' ? styles.toggleTextActive : styles.toggleTextInactive}>Mensal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setPeriod('annual')}
                        style={[styles.toggleBtn, period === 'annual' ? styles.toggleBtnActive : styles.toggleBtnInactive]}
                    >
                        <Text style={period === 'annual' ? styles.toggleTextActive : styles.toggleTextInactive}>Anual</Text>
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

                {/* Bar Charts - Monthly Evolution */}
                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Evolução Mensal</Text>

                    {monthlyBarData.hasData ? (
                        <>
                            <Text style={styles.seriesTitle}>Receitas</Text>
                            <BarChart
                                data={monthlyBarData.incomeSeries}
                                height={200}
                                barWidth={24}
                                noOfSections={4}
                                spacing={14}
                                xAxisThickness={0}
                                yAxisThickness={0}
                                yAxisTextStyle={styles.axisText}
                                xAxisLabelTextStyle={styles.axisText}
                                isAnimated
                            />

                            <Text style={[styles.seriesTitle, { marginTop: 16 }]}>Despesas</Text>
                            <BarChart
                                data={monthlyBarData.expenseSeries}
                                height={200}
                                barWidth={24}
                                noOfSections={4}
                                spacing={14}
                                xAxisThickness={0}
                                yAxisThickness={0}
                                yAxisTextStyle={styles.axisText}
                                xAxisLabelTextStyle={styles.axisText}
                                isAnimated
                            />

                            <View style={styles.legendRow}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#00B37E' }]} />
                                    <Text style={styles.legendText}>Receitas</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
                                    <Text style={styles.legendText}>Despesas</Text>
                                </View>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.emptyText}>Sem dados para exibir</Text>
                    )}
                </View>

                {/* Pie Chart - Expense Distribution */}
                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Distribuição de Gastos</Text>

                    {pieChartData.length > 0 ? (
                        <>
                            <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                                <PieChart
                                    data={pieChartData}
                                    donut
                                    radius={90}
                                    innerRadius={55}
                                    // centralLabel é opcional; se quiser, descomente:
                                    // centerLabelComponent={() => (
                                    //   <Text style={{ fontWeight: '600' }}>Gastos</Text>
                                    // )}
                                />
                            </View>

                            <View style={{ marginTop: 12 }}>
                                {pieDataSorted.map((item, index) => (
                                    <View key={item.name + index} style={styles.pieRow}>
                                        <View style={styles.pieLeft}>
                                            <View style={[styles.legendDot, { backgroundColor: COLORS[index % COLORS.length] }]} />
                                            <Text style={styles.pieName}>{item.name}</Text>
                                        </View>
                                        <Text style={styles.pieValue}>R$ {item.value.toFixed(2).replace('.', ',')}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : (
                        <Text style={styles.emptyText}>Nenhuma despesa registrada</Text>
                    )}
                </View>

                {/* Insights */}
                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Destaques do Período</Text>

                    {highestExpense && (
                        <View style={[styles.insight, { backgroundColor: '#FEF2F2' }]}>
                            <Text style={styles.insightTitle}>
                                Maior gasto: {highestExpense.name}
                            </Text>
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

    block: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
    blockTitle: { color: '#111827', fontSize: 16, fontWeight: '600', marginBottom: 12 },

    seriesTitle: { fontSize: 13, color: '#111827', fontWeight: '600', marginBottom: 6 },
    axisText: { color: '#9CA3AF' },

    legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 8 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E5E7EB' },
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
