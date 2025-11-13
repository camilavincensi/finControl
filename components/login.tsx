import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/config/firebase';
import { useRouter } from 'expo-router';

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const router = useRouter();

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!email.trim()) {
            newErrors.email = 'Digite seu e-mail';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (!password.trim()) {
            newErrors.password = 'Digite sua senha';
        } else if (password.length < 6) {
            newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            onLogin(); // vai para home
        } catch (error: any) {
            console.log(error);
            if (error.code === 'auth/invalid-credential') {
                Alert.alert('Erro', 'E-mail ou senha inválido.');
            } else {
                Alert.alert('Erro', 'Não foi possível fazer login.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        if (!email) {
            Alert.alert('Recuperar senha', 'Digite seu e-mail para redefinir a senha.');
            return;
        }
        // 👉 Aqui futuramente você pode integrar com sendPasswordResetEmail(auth, email)
        Alert.alert('Recuperar senha', `Um link de redefinição foi enviado para ${email}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FinControl</Text>
            <Text style={styles.subtitle}>Entre na sua conta</Text>

            <View style={styles.form}>
                <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="E-mail"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Senha"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                {/* 🔹 Botão de "Esqueceu sua senha?" */}
                <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end' }}>
                    <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
                </TouchableOpacity>

                {/* 🔹 Frase para criar conta */}
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Ainda não tem conta?</Text>
                    <TouchableOpacity onPress={() => router.replace('/register')}>
                        <Text style={styles.registerLink}> Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// 💅 estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        color: '#00B37E',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: '#555',
        marginTop: 8,
        marginBottom: 24,
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: '#f9f9f9',
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    inputError: {
        borderColor: '#ff4d4d',
    },
    button: {
        backgroundColor: '#00B37E',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPassword: {
        color: '#00B37E',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 12,
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 13,
        marginTop: -10,
        marginBottom: 10,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    registerText: {
        color: '#555',
        fontSize: 14,
    },
    registerLink: {
        color: '#00B37E',
        fontWeight: '600',
        fontSize: 14,
    },
});
