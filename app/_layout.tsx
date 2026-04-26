import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import { ThemeProvider, ThemeContext } from '../src/context/ThemeContext';
import { useContext } from 'react';
import { Audio } from 'expo-av';

function RootLayoutNav() {
  const { activeColors, currentTheme } = useContext(ThemeContext);

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: activeColors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style={currentTheme === 'dark' ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const configureAudio = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    };
    configureAudio();
  }, []);

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
