import { useRouter } from 'expo-router';
import Register from "@/components/register";


export default function RegisterScreen() {
    const router = useRouter();

    return (
        <Register
            onRegister={() => router.replace('/(tabs)/home')}
            onBackToLogin={() => router.replace('/login')}
        />
    );
}
