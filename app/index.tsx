import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useRouter} from "expo-router";
import { registerForPushToken} from "@/src/service/pushNotificationService";
import * as Notifications from "expo-notifications";
import {db} from "@/src/config/firebase";
import {doc, updateDoc} from "firebase/firestore";

interface OnboardingProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

export default function Index({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const insets = useSafeAreaInsets();


  const router = useRouter();

  const slides = [
    {
      icon: (
          <Svg width={120} height={120} stroke="#00B37E" fill="none" viewBox="0 0 24 24">
            <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </Svg>
      ),
      title: 'Organize suas finanças com facilidade',
      description: 'Registre e acompanhe todas as suas transações em um só lugar',
    },
    {
      icon: (
          <Svg width={120} height={120} stroke="#00B37E" fill="none" viewBox="0 0 24 24">
            <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </Svg>
      ),
      title: 'Acompanhe seus gastos e economias',
      description: 'Visualize relatórios detalhados sobre suas finanças',
    },
    {
      icon: (
          <Svg width={120} height={120} stroke="#00B37E" fill="none" viewBox="0 0 24 24">
            <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </Svg>
      ),
      title: 'Receba alertas e mantenha o controle',
      description: 'Defina metas e limites para manter suas finanças em dia',
    },
  ];

  return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Logo */}
        <Text style={[styles.logo, { marginTop: insets.top + 10 }]}>FinControl</Text>

        {/* Slide Content */}
        <View style={styles.slideContainer}>
          {slides[currentSlide].icon}
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.description}>{slides[currentSlide].description}</Text>
        </View>

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
              <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentSlide(index)}
                  style={[
                    styles.dot,
                    index === currentSlide && styles.activeDot,
                  ]}
              />
          ))}
        </View>

        {/* Buttons */}
        {currentSlide === slides.length - 1 ? (
            <View style={[styles.buttonsContainer, { marginBottom: insets.bottom + 16 }]}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/register')}>
                <Text style={styles.primaryButtonText}>Criar Conta</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/login')}>
                <Text style={styles.secondaryButtonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
        ) : (
            <TouchableOpacity onPress={() => setCurrentSlide(currentSlide + 1)}>
              <Text style={styles.nextText}>Próximo</Text>
            </TouchableOpacity>
        )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00B37E',
    alignSelf: 'center',
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: '#111',
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  activeDot: {
    backgroundColor: '#00B37E',
    width: 20,
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#00B37E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    borderColor: '#00B37E',
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#00B37E',
    fontWeight: '600',
    fontSize: 16,
  },
  nextText: {
    color: '#00B37E',
    fontSize: 16,
    paddingVertical: 16,
  },
});
