import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import PieChart from "react-native-pie-chart";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import NewTransaction from "@/components/new-transaction";

export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: string;
}

interface DashboardProps {
    transactions: Transaction[];
    onAddTransaction: () => void;
}

export default function Home({ transactions = [], onAddTransaction }: DashboardProps) {
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

    const [modalVisible, setModalVisible] = React.useState(false);

    const COLORS = ['#00B37E', '#FF6B6B', '#4ECDC4', '#FFD93D', '#A78BFA', '#F472B6'];

    const insets = useSafeAreaInsets();

    const chartData = Object.entries(expensesByCategory).map(([name, value], index) => ({
        value: value,
        text: name,
        color: COLORS[index % COLORS.length],
    }));

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <View style={{ paddingTop: insets.top }}>

                    <View style={styles.headerTop}>
                        <Text style={styles.headerTitle}>Dashboard</Text>
                        <MaterialIcons name="notifications" size={26} color="white" />
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

            {/* ✅ Cards sobrepostos */}
            <View style={styles.overlapCards}>
                {/* Receitas */}
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

                {/* Despesas */}
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

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Chart */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Gastos por Categoria</Text>
                    {chartData.length > 0 ? (
                        <>
                            <PieChart
                                data={chartData}
                                donut
                                showText
                                radius={90}
                                innerRadius={60}
                                textColor="white"
                                focusOnPress
                            />
                            <View style={styles.legendContainer}>
                                {chartData.map((item, index) => (
                                    <View key={index} style={styles.legendItem}>
                                        <View
                                            style={[styles.legendDot, { backgroundColor: item.color }]}
                                        />
                                        <Text style={styles.legendLabel}>{item.text}</Text>
                                        <Text style={styles.legendValue}>
                                            R$ {item.value.toFixed(2).replace('.', ',')}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : (
                        <Text style={styles.noDataText}>Nenhuma despesa registrada</Text>
                    )}
                </View>

                {/* Recent Transactions */}
                <View style={styles.transactionsSection}>
                    <View style={styles.transactionsHeader}>
                        <Text style={styles.transactionsTitle}>Transações Recentes</Text>
                        <Text style={styles.link}>Ver todas</Text>
                    </View>

                    {transactions.slice(0, 4).map(transaction => (
                        <View key={transaction.id} style={styles.transactionItem}>
                            <View style={styles.transactionLeft}>
                                <View
                                    style={[
                                        styles.transactionIcon,
                                        {
                                            backgroundColor:
                                                transaction.type === 'income' ? '#D1FAE5' : '#FEE2E2',
                                        },
                                    ]}
                                >
                                    <MaterialIcons
                                        name={transaction.type === 'income' ? 'arrow-upward' : 'arrow-downward'}
                                        size={22}
                                        color={transaction.type === 'income' ? '#00B37E' : '#EF4444'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.transactionCategory}>
                                        {transaction.category}
                                    </Text>
                                    <Text style={styles.transactionDate}>
                                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                    </Text>
                                </View>
                            </View>
                            <Text
                                style={[
                                    styles.transactionAmount,
                                    {
                                        color:
                                            transaction.type === 'income' ? '#00B37E' : '#EF4444',
                                    },
                                ]}
                            >
                                {transaction.type === 'income' ? '+' : '-'} R${' '}
                                {transaction.amount.toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* ✅ BOTÃO ABRE O MODAL */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <MaterialIcons name="add" size={28} color="#FFF" />
            </TouchableOpacity>

            {/* ✅ MODAL NEW TRANSACTION */}
            <NewTransaction
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(transaction) => {
                    console.log("Nova transação", transaction);
                    setModalVisible(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        backgroundColor: '#00B37E',
        paddingBottom: 60, // ✅ maior para acomodar os cards dentro
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
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
        gap: 20, // ✅ espaçamento entre os dois cards
    },

    scrollContent: {
        paddingTop: 10, // ✅ espaço abaixo dos cards sobrepostos
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    cardsRow: { flexDirection: 'row', gap: 30 },
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        gap: 2
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLabel: { color: '#6B7280', fontSize: 14 },
    cardValue: { fontSize: 18, fontWeight: '600', marginTop: 10},

    chartContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
    },
    chartTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16, color: '#111827' },
    legendContainer: { marginTop: 16 },
    legendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendLabel: { color: '#374151', fontSize: 14 },
    legendValue: { color: '#111827', fontSize: 14 },
    noDataText: { textAlign: 'center', color: '#9CA3AF', paddingVertical: 20 },

    transactionsSection: { marginTop: 16 },
    transactionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
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
    },
    transactionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    transactionIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionCategory: { color: '#111827', fontSize: 15 },
    transactionDate: { color: '#9CA3AF', fontSize: 13 },
    transactionAmount: { fontWeight: '600', fontSize: 15 },

    fab: {
        position: 'absolute',
        bottom: 30,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#00B37E',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
});
