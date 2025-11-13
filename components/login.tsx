import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useRouter} from "expo-router";

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const insets = useSafeAreaInsets();

    const router = useRouter();


    const handleSubmit = () => {
        // Simulação de login
        onLogin();
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>FinControl</Text>
                    <Text style={styles.subtitle}>
                        {isLogin ? 'Entre na sua conta' : 'Crie sua conta gratuita'}
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {!isLogin && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nome completo</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Digite seu nome"
                                style={styles.input}
                                placeholderTextColor="#999"
                            />
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="seu@email.com"
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            style={styles.input}
                            secureTextEntry
                            placeholderTextColor="#999"
                        />
                    </View>

                    {isLogin && (
                        <TouchableOpacity style={styles.forgotButton}>
                            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                        <Text style={styles.primaryButtonText}>
                            {isLogin ? 'Entrar' : 'Criar conta'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleText}>
                            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                        </Text>
                        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                            <Text style={styles.toggleLink}>
                                {isLogin ? 'Criar conta' : 'Entrar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Ao continuar, você concorda com nossos{'\n'}
                        <Text style={styles.link}>Termos de Uso</Text> e{' '}
                        <Text style={styles.link}>Política de Privacidade</Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 16,
    },
    logo: {
        color: '#00B37E',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },
    form: {
        paddingHorizontal: 24,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: '#444',
        fontSize: 14,
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F7F7F7',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111',
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginTop: -8,
    },
    forgotText: {
        color: '#00B37E',
        fontSize: 14,
    },
    primaryButton: {
        backgroundColor: '#00B37E',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    toggleText: {
        color: '#666',
        fontSize: 14,
    },
    toggleLink: {
        color: '#00B37E',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    footerText: {
        textAlign: 'center',
        color: '#aaa',
        fontSize: 13,
    },
    link: {
        color: '#00B37E',
        textDecorationLine: 'underline',
    },
});
