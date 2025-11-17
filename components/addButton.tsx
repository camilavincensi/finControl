import {StyleSheet, TouchableOpacity} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import NewTransaction from "@/components/new-transaction";
import React, {useEffect, useState} from "react";
import {Transaction} from "@/app/Interface/transaction";

interface AddButtonProps {
    openExternally?: boolean;
    selectedTransaction?: Transaction | null | undefined;
    editModalVisible?: boolean;
    onPressAdd?: () => void;
}


export default function AddButton({
                                      openExternally,
                                      editModalVisible,
                                      selectedTransaction,
                                      onPressAdd
                                  }: AddButtonProps) {
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (openExternally) setModalVisible(true);
    }, [openExternally]);

    useEffect(() => {
        if (editModalVisible) {
            setModalVisible(true);
        }
    }, [editModalVisible]);

    return (
        <>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    onPressAdd?.();
                    setModalVisible(true);
                }}
            >
                <MaterialIcons name="add" size={28} color="#FFF" />
            </TouchableOpacity>

            <NewTransaction
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={() => setModalVisible(false)}
                isEditing={editModalVisible}
                transactionToEdit={selectedTransaction}
            />
        </>
    );
}

const styles = StyleSheet.create({
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
})


