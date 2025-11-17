import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";

interface CategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
    editing?: { id: string; name: string } | null;
}

export default function CategoryModal({
                                          visible,
                                          onClose,
                                          onConfirm,
                                          editing,
                                      }: CategoryModalProps) {

    const [name, setName] = useState(editing?.name || "");

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>
                        {editing ? "Editar categoria" : "Nova categoria"}
                    </Text>

                    <TextInput
                        placeholder="Nome da categoria"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />

                    <View style={styles.row}>
                        <Pressable onPress={onClose} style={[styles.btn, styles.cancel]}>
                            <Text style={styles.btnText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                onConfirm(name);
                                setName("");
                            }}
                            style={[styles.btn, styles.save]}
                        >
                            <Text style={styles.btnText}>Salvar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)" },
    box: { width: "85%", padding: 20, backgroundColor: "#FFF", borderRadius: 12 },
    title: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
    input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 8, padding: 10, marginBottom: 20 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    btn: { padding: 12, borderRadius: 8, width: "48%", alignItems: "center" },
    cancel: { backgroundColor: "#9CA3AF" },
    save: { backgroundColor: "#00B37E" },
    btnText: { fontWeight: "600", color: "#FFF" }
});
