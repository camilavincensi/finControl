import React from 'react';
import { useRouter } from 'expo-router';
import Login from "@/components/login";

export default function LoginScreen() {
    const router = useRouter();

    return (
        <Login onLogin={() => router.replace('/(tabs)/home')} />
    );
}
