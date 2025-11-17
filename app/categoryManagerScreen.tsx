import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useCategories } from "@/hooks/useCategories";

import { Feather } from "@expo/vector-icons";
import CategoryModal from "@/components/categoryModal";
import {useRouter} from "expo-router";

export default function CategoryManagerScreen() {
    const { top } = useSafeAreaInsets();
    const nav = useNavigation();
    const { categories, addCategory, updateCategory, removeCategory, loading } = useCategories();

    const [tab, setTab] = useState<"expense" | "income">("expense");
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const router = useRouter();

    const list = categories.filter(c => c.type === tab);

    return (
        <View style={[styles.container, { paddingTop: top + 10 }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/config')}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.title}>Categorias</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setTab("expense")} style={[styles.tab, tab === "expense" && styles.tabActive]}>
                    <Text style={[styles.tabText, tab === "expense" && styles.tabTextActive]}>Despesas</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setTab("income")} style={[styles.tab, tab === "income" && styles.tabActive]}>
                    <Text style={[styles.tabText, tab === "income" && styles.tabTextActive]}>Receitas</Text>
                </TouchableOpacity>
            </View>

            {/* Lista */}
            {loading && <Text style={styles.loading}>Carregando...</Text>}

            <FlatList
                data={list}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardText}>{item.name}</Text>

                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <TouchableOpacity onPress={() => { setEditing(item); setModalVisible(true); }}>
                                <Feather name="edit" size={20} color="#3B82F6" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeCategory(item.id)}>
                                <Feather name="trash" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Botão adicionar */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => { setEditing(null); setModalVisible(true); }}
            >
                <Feather name="plus" size={28} color="#FFF" />
            </TouchableOpacity>

            {/* Modal */}
            <CategoryModal
                visible={modalVisible}
                editing={editing}
                onClose={() => setModalVisible(false)}
                onConfirm={(name) => {
                    if (editing) updateCategory(editing.id, name);
                    else addCategory(name, tab);
                    setModalVisible(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 12 },
    title: { fontSize: 20, fontWeight: "600", color: "#111" },

    tabs: { flexDirection: "row", backgroundColor: "#F3F4F6", borderRadius: 10, marginHorizontal: 16, marginBottom: 18 },
    tab: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" },
    tabActive: { backgroundColor: "#111827" },
    tabText: { fontSize: 15, fontWeight: "500", color: "#6B7280" },
    tabTextActive: { color: "#FFF" },

    loading: { textAlign: "center", marginTop: 20 },

    card: { backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    cardText: { fontSize: 16, fontWeight: "500" },

    fab: { position: "absolute", bottom: 25, right: 25, width: 55, height: 55, borderRadius: 30, backgroundColor: "#00B37E", justifyContent: "center", alignItems: "center" }
});
