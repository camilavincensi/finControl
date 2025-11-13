import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />       {/* Onboarding */}
            <Stack.Screen name="(tabs)" />      {/* Abas principais */}
            <Stack.Screen name="login" />       {/* Caso tenha uma tela de login */}
        </Stack>
    );
}
