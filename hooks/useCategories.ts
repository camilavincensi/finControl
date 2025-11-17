import { useEffect, useState } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/src/config/firebase";

export interface Category {
    id: string;
    name: string;
    type: "income" | "expense";
    createdAt?: any;
}

export function useCategories() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const defaultCategories = [
        { name: "Alimentação", type: "expense" },
        { name: "Transporte", type: "expense" },
        { name: "Moradia", type: "expense" },
        { name: "Saúde", type: "expense" },
        { name: "Lazer", type: "expense" },
        { name: "Compras", type: "expense" },

        { name: "Salário", type: "income" },
        { name: "Freelance", type: "income" },
        { name: "Investimentos", type: "income" },
        { name: "Presente", type: "income" },
    ];


    useEffect(() => {
        if (!user?.uid) return;

        const ref = collection(db, "users", user.uid, "categories");
        const q = query(ref, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, async snap => {
            const list: Category[] = snap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<Category, "id">)
            }));

            if (list.length === 0) {
                const ref = collection(db, "users", user!.uid, "categories");
                for (const item of defaultCategories) {
                    await addDoc(ref, {
                        ...item,
                        createdAt: serverTimestamp()
                    });
                }
                return;
            }

            setCategories(list);
            setLoading(false);
        });


        return unsubscribe;
    }, [user?.uid]);

    async function addCategory(name: string, type: "income" | "expense") {
        const ref = collection(db, "users", user!.uid, "categories");
        await addDoc(ref, { name, type, createdAt: serverTimestamp() });
    }

    async function updateCategory(id: string, name: string) {
        const ref = doc(db, "users", user!.uid, "categories", id);
        await updateDoc(ref, { name });
    }

    async function removeCategory(id: string) {
        const ref = doc(db, "users", user!.uid, "categories", id);
        await deleteDoc(ref);
    }

    return { categories, addCategory, updateCategory, removeCategory, loading };
}
