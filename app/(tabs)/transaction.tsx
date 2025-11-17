import { useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import {Ionicons, Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import { db } from "@/src/config/firebase";
import { deleteDoc, doc} from "firebase/firestore";
import {formatDateForDisplay} from "@/src/utils/convertDate";
import AddButton from "@/components/addButton";
import {useTransactions} from "@/hooks/useTransaction";
import {Transaction} from "@/app/Interface/transaction";

export default function Transactions() {
    const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

    const { transactions, loading } = useTransactions();
    const [editModalVisible, setEditModalVisible] = useState(false);

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "transactions", id));
            console.log("Deletado com sucesso");
        } catch (error) {
            console.log("Erro ao deletar", error);
        }
    };

    const filteredTransactions = transactions.filter((t) => {
        if (filter === "all") return true;
        return t.type === filter;
    });

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Transações</Text>

                {/* Balance Summary */}
                <View style={styles.balanceBox}>
                    <Text style={styles.balanceLabel}>Saldo Atual</Text>
                    <Text
                        style={[
                            styles.balanceValue,
                            balance < 0 ? styles.textRed : styles.textGreen,
                        ]}
                    >
                        R$ {balance.toFixed(2).replace(".", ",")}
                    </Text>
                </View>

                {/* Filters */}
                <View style={styles.filterContainer}>
                    <FilterButton
                        label="Todas"
                        active={filter === "all"}
                        onPress={() => setFilter("all")}
                    />
                    <FilterButton
                        label="Receitas"
                        active={filter === "income"}
                        onPress={() => setFilter("income")}
                    />
                    <FilterButton
                        label="Despesas"
                        active={filter === "expense"}
                        onPress={() => setFilter("expense")}
                    />
                </View>
            </View>

            {/* Transaction List */}
            <ScrollView contentContainerStyle={styles.list}>
                {filteredTransactions.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={64}
                            color="#D1D5DB"
                            style={{ marginBottom: 16 }}
                        />
                        <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>

                    </View>
                ) : (
                    filteredTransactions.map((t) => (

                        <TouchableOpacity
                            key={t.id}
                            onPress={() => {
                                setSelectedTransaction(null);
                                setTimeout(() => {
                                    setSelectedTransaction(t);
                                    setEditModalVisible(true);
                                }, 0);
                            }}
                        >
                            <View  style={styles.item}>
                                <View style={styles.itemLeft}>
                                    <View
                                        style={[
                                            styles.iconCircle,
                                            t.type === "income"
                                                ? styles.iconCircleGreen
                                                : styles.iconCircleRed,
                                        ]}
                                    >
                                        {t.type === "income" ? (
                                            <Feather name="arrow-up" size={22} color="#00B37E" />
                                        ) : (
                                            <Feather name="arrow-down" size={22} color="#EF4444" />
                                        )}
                                    </View>

                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemCategory}>{t.category}</Text>
                                        {t.description ? (
                                            <Text style={styles.itemDescription}>{t.description}</Text>
                                        ) : null}

                                        <Text style={styles.itemDate}>
                                            {formatDateForDisplay(t.date)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.itemRight}>
                                    <Text
                                        style={[
                                            styles.amount,
                                            t.type === "income" ? styles.textGreen : styles.textRed,
                                        ]}
                                    >
                                        {t.type === "income" ? "+" : "-"} R${" "}
                                        {t.amount.toFixed(2).replace(".", ",")}
                                    </Text>

                                    <TouchableOpacity onPress={() => handleDelete(t.id)}>
                                        <Ionicons
                                            name="trash-outline"
                                            size={20}
                                            color="#9CA3AF"
                                            style={{ marginLeft: 8, marginTop: 15 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>

                    ))
                )}
            </ScrollView>

            <AddButton
                onPressAdd={() => {
                    setSelectedTransaction(null);
                    setEditModalVisible(false);
                }}
                editModalVisible={editModalVisible}
                selectedTransaction={selectedTransaction}
            />
        </View>
    );
}

function FilterButton({
                          label,
                          active,
                          onPress,
                      }: {
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.filterButton, active && styles.filterButtonActive]}
        >
            <Text
                style={[styles.filterText, active && styles.filterTextActive]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

/* -----------------------------
 *            STYLES
 * ----------------------------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    header: {
        backgroundColor: "#FFF",
        marginTop: 40,
        padding: 20,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 16,
    },
    balanceBox: {
        backgroundColor: "#F9FAFB",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    balanceLabel: {
        color: "#6B7280",
        fontSize: 13,
        marginBottom: 4,
    },
    balanceValue: {
        fontSize: 22,
        fontWeight: "bold",
    },
    textGreen: { color: "#00B37E" },
    textRed: { color: "#EF4444" },

    filterContainer: {
        flexDirection: "row",
        gap: 8,
    },
    filterButton: {
        backgroundColor: "#E5E7EB",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    filterButtonActive: {
        backgroundColor: "#00B37E",
    },
    filterText: {
        color: "#4B5563",
        fontSize: 14,
    },
    filterTextActive: {
        color: "#FFF",
    },

    list: {
        padding: 20,
        paddingBottom: 120,
        gap: 12,
    },
    emptyBox: {
        alignItems: "center",
        marginTop: 60,
    },
    emptyText: {
        color: "#9CA3AF",
        marginBottom: 8,
    },
    addText: {
        color: "#00B37E",
        fontSize: 15,
    },

    item: {
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        shadowColor: "#000",
        elevation: 2,
    },
    itemLeft: {
        flexDirection: "row",
        gap: 12,
        flex: 1,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    iconCircleGreen: { backgroundColor: "#D1FAE5" },
    iconCircleRed: { backgroundColor: "#FEE2E2" },

    itemInfo: { flex: 1 },
    itemCategory: {
        fontSize: 16,
        color: "#111827",
    },
    itemDescription: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },
    itemDate: {
        fontSize: 11,
        color: "#9CA3AF",
        marginTop: 4,
    },

    itemRight: {
        alignItems: "flex-end",
    },
    amount: {
        fontSize: 15,
        fontWeight: "600",
    },

    fab: {
        position: "absolute",
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        backgroundColor: "#00B37E",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
    },
});

export { styles };
