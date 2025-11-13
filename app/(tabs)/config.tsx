import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {useRouter} from "expo-router";

interface SettingsProps {
    onLogout: () => void;
}

export default function Config({ onLogout }: SettingsProps) {
    const router = useRouter();
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
                            <Text style={styles.profileName}>Usuário</Text>
                            <Text style={styles.profileEmail}>usuario@email.com</Text>
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
                    />

                    <SettingItem
                        iconBg="#DBEAFE"
                        iconColor="#2563EB"
                        title="Metas e Limites"
                        subtitle="Defina objetivos financeiros"
                    />

                    <SettingItem
                        iconBg="#EDE9FE"
                        iconColor="#7C3AED"
                        title="Categorias"
                        subtitle="Personalizar categorias"
                    />

                    <SettingItem
                        iconBg="#D1FAE5"
                        iconColor="#00B37E"
                        title="Exportar Dados"
                        subtitle="Baixar relatórios em PDF"
                    />

                    {/* Divider */}
                    <View style={styles.divider} />

                    <SettingItem
                        iconBg="#F3F4F6"
                        iconColor="#4B5563"
                        title="Sobre o App"
                        subtitle="Versão 1.0.0"
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

                {/* NOTIFICATIONS EXAMPLES */}
                <View style={styles.examplesContainer}>
                    <Text style={styles.sectionTitle}>Exemplos de Notificações</Text>

                    <NotificationCard
                        bg="#FEF3C7"
                        border="#F59E0B"
                        iconColor="#D97706"
                        title="Limite de gastos quase atingido"
                        subtitle="Você gastou 85% do seu orçamento mensal"
                    />

                    <NotificationCard
                        bg="#FEE2E2"
                        border="#EF4444"
                        iconColor="#DC2626"
                        title="Saldo negativo este mês"
                        subtitle="Suas despesas superaram suas receitas"
                    />

                    <NotificationCard
                        bg="#ECFDF5"
                        border="#00B37E"
                        iconColor="#00B37E"
                        title="Meta de economia alcançada!"
                        subtitle="Você economizou R$ 500,00 este mês"
                    />
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
                     }: {
    iconBg: string;
    iconColor: string;
    title: string;
    subtitle: string;
}) {
    return (
        <TouchableOpacity style={styles.settingBtn}>
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

/* ------------------------- NOTIFICATION CARD ------------------------ */

function NotificationCard({
                              bg,
                              border,
                              iconColor,
                              title,
                              subtitle,
                          }: {
    bg: string;
    border: string;
    iconColor: string;
    title: string;
    subtitle: string;
}) {
    return (
        <View style={[styles.notificationCard, { backgroundColor: bg, borderLeftColor: border }]}>
            <Svg width={24} height={24} stroke={iconColor} strokeWidth={2} fill="none" viewBox="0 0 24 24">
                <Path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0L3.3 16a2 2 0 001.7 3z" />
            </Svg>

            <View style={{ flex: 1 }}>
                <Text style={styles.notificationTitle}>{title}</Text>
                <Text style={styles.notificationSubtitle}>{subtitle}</Text>
            </View>
        </View>
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

    examplesContainer: {
        marginTop: 30,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 10,
    },

    notificationCard: {
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    notificationTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    notificationSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
});
