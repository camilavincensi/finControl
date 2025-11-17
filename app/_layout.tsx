import { Stack } from 'expo-router';
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/src/config/firebase';
import { initPush } from "@/src/service/pushNotificationService";
import {Alert} from "react-native";

// 🟢 Handler deve ficar FORA do componente
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true
    }),
});

export default function RootLayout() {
    // Inicializa push quando logar
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) await initPush(user.uid);
        });
        return unsubscribe;
    }, []);


    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="(tabs)"/>
        </Stack>
    );
}
