import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {useRouter} from "expo-router";
import {useUser} from "@/hooks/useUser";

interface SettingsProps {
    onLogout: () => void;
}

export default function Config({ onLogout }: SettingsProps) {
    const router = useRouter();

    const { user, loading } = useUser();
    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Configurações</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* PROFILE */}
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.profileAvatar}>
                            <Svg width={32} height={32} stroke="#fff" strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                <Path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </Svg>
                        </View>
                        <View>
                            <Text style={styles.profileName}>{user?.name}</Text>
                            <Text style={styles.profileEmail}>{user?.email}</Text>
                        </View>
                    </View>
                </View>

                {/* SETTINGS LIST */}
                <View style={styles.listContainer}>
                    {/* Item Reutilizável */}
                    <SettingItem
                        iconBg="#FEF3C7"
                        iconColor="#CA8A04"
                        title="Notificações"
                        subtitle="Gerenciar alertas e avisos"
                        onPress={() => router.replace('/alertsScreen')}
                    />

                    <SettingItem
                        iconBg="#DBEAFE"
                        iconColor="#2563EB"
                        title="Metas e Limites"
                        subtitle="Defina objetivos financeiros"
                        onPress={() => router.replace('/goalsScreen')}
                    />

                    <SettingItem
                        iconBg="#EDE9FE"
                        iconColor="#7C3AED"
                        title="Categorias"
                        subtitle="Personalizar categorias"
                        onPress={() => router.replace('/categoryManagerScreen')}
                    />

                    {/* Divider */}
                    <View style={styles.divider} />

                    <SettingItem
                        iconBg="#F3F4F6"
                        iconColor="#4B5563"
                        title="Sobre o App"
                        subtitle="Versão 1.0.0"
                        onPress={() => null}
                    />

                    {/* LOGOUT */}
                    <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/login')}>
                        <View style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                                <Svg width={20} height={20} stroke="#DC2626" strokeWidth={2} fill="none" viewBox="0 0 24 24">
                                    <Path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </Svg>
                            </View>
                            <Text style={styles.logoutText}>Sair da conta</Text>
                        </View>

                        <Svg width={20} height={20} stroke="#DC2626" strokeWidth={2} fill="none" viewBox="0 0 24 24">
                            <Path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </Svg>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ------------------------- REUSABLE SETTINGS COMPONENT ------------------------ */

function SettingItem({
                         iconBg,
                         iconColor,
                         title,
                         subtitle,
                         onPress
                     }: {
    iconBg: string;
    iconColor: string;
    title: string;
    subtitle: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.settingBtn} onPress={() => onPress()}>
            <View style={styles.row}>
                <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
                    <Svg width={20} height={20} stroke={iconColor} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                        <Path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.1V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3A6 6 0 006 11v3.1c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
                    </Svg>
                </View>
                <View>
                    <Text style={styles.itemTitle}>{title}</Text>
                    <Text style={styles.itemSubtitle}>{subtitle}</Text>
                </View>
            </View>

            <Svg width={20} height={20} stroke="#9CA3AF" strokeWidth={2} fill="none" viewBox="0 0 24 24">
                <Path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </Svg>
        </TouchableOpacity>
    );
}

/* ------------------------- STYLES ------------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    header: {
        backgroundColor: '#FFF',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#111827',
    },

    content: {
        padding: 20,
    },

    profileCard: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    profileAvatar: {
        width: 64,
        height: 64,
        backgroundColor: '#00B37E',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileName: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '600',
    },
    profileEmail: {
        fontSize: 14,
        color: '#6B7280',
    },

    listContainer: {
        gap: 12,
    },

    settingBtn: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },

    itemTitle: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '500',
    },
    itemSubtitle: {
        color: '#6B7280',
        fontSize: 13,
    },

    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },

    logoutBtn: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoutText: {
        color: '#DC2626',
        fontSize: 16,
        fontWeight: '500',
    },


    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 10,
    },
});
