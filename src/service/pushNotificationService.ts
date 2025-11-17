import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import {doc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "@/src/config/firebase";

export async function registerForPushToken() {
    try {
        if (!Device.isDevice) {
            console.log("Push notifications require a physical device");
            return null;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.log("Permission for notifications denied");
            return null;
        }

        const tokenResponse = await Notifications.getExpoPushTokenAsync({
            projectId: "f760dcc2-e0b9-4dfe-8181-fefdd5e0cc22",
        });

        const token = tokenResponse.data;
        console.log("🔔 Push Token:", token);
        return token;

    } catch (error) {
        console.error("Error getting push token", error);
        return null;
    }
}


export async function initPush(uid: string) {
    try {
        const token = await registerForPushToken();
        if (!token) return;

        await setDoc(
            doc(db, "users", uid),
            {
                expoPushToken: token,
                updatedAt: new Date(),
            },
            { merge: true }
        );

        console.log("📌 Token salvo no Firestore com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao inicializar push:", error);
    }
}