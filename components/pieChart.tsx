import {StyleSheet, Text, View} from "react-native";
import React, {useMemo} from "react";
import {Transaction} from "@/app/Interface/transaction";
import {PieChart} from "react-native-gifted-charts";

interface PieChartProps {

    expensesByCategory: Record<string, number>;
}


export default function PieChartComponent({ expensesByCategory }: PieChartProps) {

    const COLORS = ['#00B37E', '#6b84ff', '#4ECDC4', '#FFD93D', '#A78BFA', '#F472B6'];

    const pieDataSorted = useMemo(
        () =>
            Object.entries(expensesByCategory)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value),
        [expensesByCategory]
    );

    const pieChartData = useMemo(
        () =>
            pieDataSorted.map((item, idx) => ({
                value: item.value,
                color: COLORS[idx % COLORS.length],
                text: item.name,
            })),
        [pieDataSorted]
    );



    return (
        <>
            {/* Pie Chart */}
            <Text style={styles.blockTitle}>Distribuição de Gastos</Text>
                {pieChartData.length > 0 ? (
                    <>
                        <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                            <PieChart
                                data={pieChartData}
                                donut
                                radius={90}
                                innerRadius={55}
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
        </>

    )
}

const styles = StyleSheet.create({
    pieRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
    pieLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    pieName: { color: '#374151', fontSize: 14 },
    pieValue: { color: '#111827', fontSize: 14 },

    legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 8 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { color: '#4B5563', fontSize: 12 },

    emptyText: { color: '#9CA3AF', textAlign: 'center', paddingVertical: 24 },
    blockTitle: { color: '#111827', fontSize: 16, fontWeight: '600', marginBottom: 12 },
});