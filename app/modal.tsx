import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { ThemeContext } from '../src/context/ThemeContext';
import { useContext } from 'react';

export default function ModalScreen() {
  const { currentTheme, activeColors, toggleTheme, updateUsername, setTheme } = useContext(ThemeContext);
  const isDarkMode = currentTheme === 'dark';
  const colors = {
    ...activeColors,
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    border: isDarkMode ? '#374151' : '#E5E7EB'
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Información del Coach</Text>
      <Text style={[styles.desc, { color: colors.text, opacity: 0.7 }]}>
        Raccoon es tu guía inteligente diseñado para ayudarte a aprender idiomas de forma natural.
      </Text>
      
      <Link href="/" dismissTo asChild>
        <TouchableOpacity style={[styles.link, { backgroundColor: colors.accent }]}>
          <Text style={styles.linkText}>Volver al inicio</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
  },
  desc: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  link: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  linkText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
});
