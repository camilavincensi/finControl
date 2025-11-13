import {Redirect, Tabs} from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {useAuth} from "@/hooks/useAuth";

export default function TabLayout() {
  const colorScheme = useColorScheme();
    const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
        <Tabs.Screen
            name="transaction"
            options={{
                title: 'Transações',
                tabBarIcon: ({ color }) => <IconSymbol size={24} name="dollarsign.circle.fill" color={color} />,
            }}
        />
        <Tabs.Screen
            name="report"
            options={{
                title: 'Relatórios',
                tabBarIcon: ({ color }) => <IconSymbol size={24} name="chart.bar.fill" color={color} />,
            }}
        />
      <Tabs.Screen
        name="config"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
