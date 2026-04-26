import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

const { width } = Dimensions.get('window');

interface PinEntryScreenProps {
  username?: string;
  onPinComplete: (pin: string) => void;
  onForgotPin?: () => void;
  error?: string | null;
  onBiometricSuccess?: () => void;
  mode?: 'login' | 'unlock' | 'setup';
}

export default function PinEntryScreen({ 
  username = 'Usuario', 
  onPinComplete, 
  onForgotPin,
  error,
  onBiometricSuccess,
  mode = 'unlock'
}: PinEntryScreenProps) {
  const { currentTheme, activeColors, toggleTheme, updateUsername, setTheme } = useContext(ThemeContext);
  const isDarkMode = currentTheme === 'dark';
  const colors = {
    ...activeColors,
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    border: isDarkMode ? '#374151' : '#E5E7EB'
  };
  const [pin, setPin] = useState<string>('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricIcon, setBiometricIcon] = useState<any>('finger-print-outline');

  const initial = username && username.length > 0 ? username.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    setPin(''); // Limpiar al montar
    (async () => {
      // Si el modo es login o setup, NO habilitamos biometría (se requiere PIN manual)
      if (mode === 'login' || mode === 'setup') {
        setIsBiometricSupported(false);
        return;
      }

      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const supported = compatible && enrolled;
      setIsBiometricSupported(supported);

      if (supported) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricIcon('scan-outline');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricIcon('finger-print-outline');
        }
      }

      if (supported && mode === 'unlock' && onBiometricSuccess) {
        handleBiometricAuth();
      }
    })();
  }, [mode]);

  useEffect(() => {
    if (error) {
      setPin(''); // Limpiar si hay error
    }
  }, [error]);

  useEffect(() => {
    if (pin.length === 6) {
      onPinComplete(pin);
    }
  }, [pin, onPinComplete]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
      // Opcional: Pequeña vibración para feedback táctil
      // Vibration.vibrate(10);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleBiometricAuth = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Verifica tu identidad para continuar',
      fallbackLabel: 'Usar PIN',
      cancelLabel: 'Cancelar'
    });
    
    if (result.success && onBiometricSuccess) {
      onBiometricSuccess();
    }
  };

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < 6; i++) {
      const isActive = i < pin.length;
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: isActive ? '#575fcf' : '#E2E8F0' }
          ]}
        />
      );
    }
    return dots;
  };

  const renderKey = (val: string | React.ReactNode, onPress: () => void, isIcon = false) => (
    <TouchableOpacity 
      style={styles.key} 
      onPress={onPress}
      activeOpacity={0.6}
    >
      {isIcon ? (
        val
      ) : (
        <Text style={styles.keyText}>{val}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header / Avatar */}
      <View style={styles.headerContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.title}>Ingresa tu PIN</Text>
        
        <View style={styles.dotsContainer}>
          {renderDots()}
        </View>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <TouchableOpacity onPress={onForgotPin} style={styles.forgotButton}>
          <Text style={styles.forgotText}>Olvidé mi PIN</Text>
          <View style={styles.forgotLine} />
        </TouchableOpacity>
      </View>

      {/* Keypad */}
      <View style={styles.keypadContainer}>
        <View style={styles.keyRow}>
          {renderKey('1', () => handleKeyPress('1'))}
          {renderKey('2', () => handleKeyPress('2'))}
          {renderKey('3', () => handleKeyPress('3'))}
        </View>
        <View style={styles.keyRow}>
          {renderKey('4', () => handleKeyPress('4'))}
          {renderKey('5', () => handleKeyPress('5'))}
          {renderKey('6', () => handleKeyPress('6'))}
        </View>
        <View style={styles.keyRow}>
          {renderKey('7', () => handleKeyPress('7'))}
          {renderKey('8', () => handleKeyPress('8'))}
          {renderKey('9', () => handleKeyPress('9'))}
        </View>
        <View style={styles.keyRow}>
          {isBiometricSupported ? renderKey(
            <Ionicons name={biometricIcon} size={32} color="#2F3542" />, 
            handleBiometricAuth, 
            true
          ) : <View style={styles.key} />}
          {renderKey('0', () => handleKeyPress('0'))}
          {renderKey(
            <Ionicons name="backspace-outline" size={28} color="#2F3542" />, 
            handleDelete, 
            true
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#575fcf',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2F3542',
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 16,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  errorText: {
    color: '#ff4757',
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  forgotButton: {
    alignItems: 'center',
  },
  forgotText: {
    color: '#575fcf',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  forgotLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#575fcf',
  },
  keypadContainer: {
    width: width * 0.85,
    marginBottom: 40,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  key: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 28,
    color: '#2F3542',
    fontWeight: '500',
  }
});
