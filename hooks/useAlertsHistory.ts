import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/src/config/firebase";

export interface AlertItem {
    id: string;
    message: string;
    type: string;
    createdAt: Date | null;
}

export function useAlertHistory() {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = collection(db, "alerts_history", user.uid, "items");
        const q = query(ref, orderBy("createdAt", "desc"));

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => {
                const raw = doc.data();
                return {
                    id: doc.id,
                    message: raw.message,
                    type: raw.type,
                    createdAt: raw.createdAt?.toDate?.() ?? null,
                } as AlertItem;
            });

            setAlerts(data);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return { alerts, loading };
}
