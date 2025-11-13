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
import {auth, db} from "@/src/config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface RegisterProps {
    onRegister: () => void;
    onBackToLogin: () => void;
}

export default function Register({ onRegister, onBackToLogin }: RegisterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!name.trim()) newErrors.name = 'Digite seu nome completo';
        if (!email.trim()) newErrors.email = 'Digite seu e-mail';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
        if (!password.trim()) newErrors.password = 'Digite sua senha';
        else if (password.length < 6) newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            await setDoc(doc(db, "users", userCredential.user.uid), {
                name,
                email,
                createdAt: new Date(),
            });
            Alert.alert('Sucesso', 'Conta criada com sucesso!');
            onRegister(); // vai para home
        } catch (error: any) {
            console.log(error);
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Erro', 'Este e-mail já está cadastrado.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Erro', 'E-mail inválido.');
            } else if (error.code === 'auth/weak-password') {
                Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            } else {
                Alert.alert('Erro', 'Não foi possível criar a conta.');
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>FinControl</Text>
            <Text style={styles.subtitle}>Crie sua conta gratuita</Text>

            <View style={styles.form}>
                <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Nome completo"
                    value={name}
                    onChangeText={setName}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

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

                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Criando conta...' : 'Criar conta'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onBackToLogin} style={{ marginTop: 16 }}>
                    <Text style={styles.link}>Já tem uma conta? Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
    errorText: {
        color: '#ff4d4d',
        fontSize: 13,
        marginTop: -10,
        marginBottom: 10,
    },
    link: {
        color: '#00B37E',
        textAlign: 'center',
        fontWeight: '600',
    },
});
