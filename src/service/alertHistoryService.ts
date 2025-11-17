import { collection, addDoc, serverTimestamp, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "@/src/config/firebase";

export async function saveAlertHistory(userId: string, message: string, type: string) {
    const ref = collection(db, "alerts_history", userId, "items");
    await addDoc(ref, {
        message,
        type,
        createdAt: serverTimestamp(),
    });
}

export async function clearAlertHistory(userId: string) {
    const ref = collection(db, "alerts_history", userId, "items");
    const snapshot = await getDocs(ref);
    const batchDeletes = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(batchDeletes); // ⚡ apaga tudo
}
