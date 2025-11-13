import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';
import {Transaction} from "@/app";



interface NewTransactionProps {
    onClose: () => void;
    onSave: (transaction: {
        date: string;
        amount: number;
        description: string;
        type: "income" | "expense";
        category: string
    }) => void;
    visible: boolean;
}

export default function NewTransaction({ visible, onClose, onSave }: NewTransactionProps) {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Outros'];
    const expenseCategories = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Moradia', 'Outros'];

    const categories = type === 'income' ? incomeCategories : expenseCategories;

    const handleSubmit = () => {
        if (!amount || !category) return;

        onSave({
            type,
            amount: parseFloat(amount),
            category,
            date,
            description,
        });

        setAmount('');
        setCategory('');
        setDescription('');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Nova Transação</Text>

                        <TouchableOpacity onPress={onClose}>
                            <Svg width={24} height={24} stroke="#6B7280" strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                <Path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </Svg>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

                        {/* TYPE TOGGLE */}
                        <View style={styles.block}>
                            <Text style={styles.label}>Tipo</Text>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    onPress={() => setType('income')}
                                    style={[
                                        styles.toggleButton,
                                        type === 'income' && styles.incomeActive
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.toggleText,
                                            type === 'income' && styles.incomeTextActive
                                        ]}
                                    >
                                        Receita
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setType('expense')}
                                    style={[
                                        styles.toggleButton,
                                        type === 'expense' && styles.expenseActive
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.toggleText,
                                            type === 'expense' && styles.expenseTextActive
                                        ]}
                                    >
                                        Despesa
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* AMOUNT */}
                        <View style={styles.block}>
                            <Text style={styles.label}>Valor</Text>

                            <View style={styles.inputIconWrapper}>
                                <Svg width={20} height={20} stroke="#9CA3AF" strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                    <Path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.6 0-3 .9-3 2s1.3 2 3 2 3 .9 3 2-1.3 2-3 2m0-8c1.1 0 2.1.4 2.6 1M12 8V7m0 1v8m0 0v1" />
                                </Svg>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="0,00"
                                    value={amount}
                                    onChangeText={setAmount}
                                />
                            </View>
                        </View>

                        {/* CATEGORY */}
                        <View style={styles.block}>
                            <Text style={styles.label}>Categoria</Text>

                            <View style={styles.inputIconWrapper}>
                                <Svg width={20} height={20} stroke="#9CA3AF" strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                    <Path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5l7 7a2 2 0 010 2l-7 7a2 2 0 01-3 0l-7-7V7a4 4 0 014-4z" />
                                </Svg>

                                <Picker
                                    selectedValue={category}
                                    onValueChange={(v) => setCategory(v)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Selecione uma categoria" value="" />
                                    {categories.map((cat) => (
                                        <Picker.Item key={cat} label={cat} value={cat} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* DATE */}
                        <View style={styles.block}>
                            <Text style={styles.label}>Data</Text>

                            <View style={styles.inputIconWrapper}>
                                <Svg width={20} height={20} stroke="#9CA3AF" strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                    <Path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
                                </Svg>
                                <TextInput
                                    style={styles.input}
                                    value={date}
                                    onChangeText={setDate}
                                />
                            </View>
                        </View>

                        {/* DESCRIPTION */}
                        <View style={styles.block}>
                            <Text style={styles.label}>Descrição (opcional)</Text>

                            <View style={styles.textAreaWrapper}>
                                <Svg width={20} height={20} stroke="#9CA3AF" strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                    <Path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                                </Svg>

                                <TextInput
                                    style={styles.textArea}
                                    placeholder="Adicione uma descrição"
                                    multiline
                                    numberOfLines={4}
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>
                        </View>

                        {/* BUTTONS */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                                <Text style={styles.saveText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

/* ------------------- STYLES ------------------- */

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },

    sheet: {
        backgroundColor: '#FFF',
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: '90%',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },

    block: {
        marginBottom: 16,
    },

    label: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 8,
    },

    row: {
        flexDirection: 'row',
        gap: 12,
    },

    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
    },

    toggleText: {
        color: '#6B7280',
        fontSize: 14,
    },

    incomeActive: {
        backgroundColor: '#ECFDF5',
        borderColor: '#00B37E',
    },

    incomeTextActive: {
        color: '#00B37E',
    },

    expenseActive: {
        backgroundColor: '#FEE2E2',
        borderColor: '#EF4444',
    },

    expenseTextActive: {
        color: '#EF4444',
    },

    inputIconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        paddingHorizontal: 12,
        borderRadius: 12,
    },

    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        marginLeft: 8,
    },

    picker: {
        flex: 1,
        marginLeft: 8,
    },

    textAreaWrapper: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
    },

    textArea: {
        flex: 1,
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: 'top',
    },

    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },

    cancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
    },

    cancelText: {
        color: '#6B7280',
        fontSize: 16,
    },

    saveBtn: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#00B37E',
        borderRadius: 12,
        alignItems: 'center',
    },

    saveText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
