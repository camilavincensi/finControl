import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

interface RegisterProps {
    onRegister: () => void;
    onBackToLogin: () => void;
}

export default function Register({ onRegister, onBackToLogin }: RegisterProps) {
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
        if (!password) newErrors.password = 'Senha é obrigatória';
        else if (password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
        if (!acceptTerms) newErrors.terms = 'Você deve aceitar os termos';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onRegister();
        } else {
            Alert.alert('Verifique os campos', 'Preencha todos os campos corretamente.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
                    <Svg width={20} height={20} fill="none" stroke="#333" viewBox="0 0 24 24">
                        <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </Svg>
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.logo}>FinControl</Text>
                <Text style={styles.title}>Crie sua conta</Text>
                <Text style={styles.subtitle}>Comece a organizar suas finanças agora</Text>
            </View>

            {/* Form */}
            <ScrollView
                style={styles.formContainer}
                contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Nome */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome completo</Text>
                    <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        placeholder="Digite seu nome completo"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>

                {/* E-mail */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder="seu@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                {/* Senha */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={[styles.input, errors.password && styles.inputError]}
                        placeholder="Mínimo 6 caracteres"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (errors.password) setErrors({ ...errors, password: '' });
                        }}
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                {/* Confirmar senha */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirmar senha</Text>
                    <TextInput
                        style={[styles.input, errors.confirmPassword && styles.inputError]}
                        placeholder="Digite a senha novamente"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                        }}
                    />
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                </View>

                {/* Termos e condições */}
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setAcceptTerms(!acceptTerms)}
                    activeOpacity={0.8}
                >
                    <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]} />
                    <Text style={styles.checkboxLabel}>
                        Eu aceito os{' '}
                        <Text style={styles.link}>Termos de Uso</Text> e a{' '}
                        <Text style={styles.link}>Política de Privacidade</Text>
                    </Text>
                </TouchableOpacity>
                {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

                {/* Botão Criar conta */}
                <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                    <Text style={styles.primaryButtonText}>Criar conta</Text>
                </TouchableOpacity>

                {/* Voltar para Login */}
                <View style={styles.loginLink}>
                    <Text style={styles.loginText}>Já tem uma conta? </Text>
                    <TouchableOpacity onPress={onBackToLogin}>
                        <Text style={styles.link}>Fazer login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 8,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backText: {
        color: '#333',
        marginLeft: 6,
        fontSize: 15,
    },
    logo: {
        color: '#00B37E',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        color: '#111',
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        marginTop: 4,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 24,
        marginTop: 12,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        color: '#333',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#ff5a5f',
    },
    errorText: {
        color: '#ff5a5f',
        fontSize: 13,
        marginTop: 4,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginTop: 8,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: '#aaa',
    },
    checkboxChecked: {
        backgroundColor: '#00B37E',
        borderColor: '#00B37E',
    },
    checkboxLabel: {
        flex: 1,
        color: '#555',
        fontSize: 14,
    },
    link: {
        color: '#00B37E',
        fontWeight: '600',
    },
    primaryButton: {
        backgroundColor: '#00B37E',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 24,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    loginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
});
