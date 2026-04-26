import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { AuthService } from '../api/auth';
import { supabase } from '../api/supabase';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('El email no es válido').required('El email es requerido'),
  username: Yup.string().required('El nombre de usuario es requerido'),
  password: Yup.string()
    .matches(/^[0-9]{6}$/, 'La contraseña debe ser un PIN numérico de exactamente 6 dígitos.')
    .required('La contraseña es requerida'),
});

interface AuthSectionProps {
  onPinRequestedForLogin?: (email: string) => void;
  onSignupSuccess?: () => void;
}

export default function AuthSection({ onPinRequestedForLogin, onSignupSuccess }: AuthSectionProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleAuth = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email.');
      return;
    }
    if (!isLogin && !password && !showForgotPassword) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña (PIN).');
      return;
    }

    setLoading(true);
    try {
      if (showForgotPassword) {
        await AuthService.resetPassword(email);
        Alert.alert('Éxito', 'Se ha enviado un correo para restablecer tu contraseña.');
        setShowForgotPassword(false);
      } else if (isLogin) {
        const { data: exists, error } = await supabase.rpc('check_user_exists', { 
          email_input: email.trim().toLowerCase() 
        });

        if (error || !exists) {
          setLoading(false);
          Alert.alert('Cuenta no encontrada', 'El correo ingresado no está registrado. Verifica que esté escrito correctamente o crea una cuenta nueva.');
          return;
        }

        if (onPinRequestedForLogin) {
          onPinRequestedForLogin(email);
        }
      } else {
        try {
          const formData = { email, username: username.trim(), password };
          // 1. Validación local con Yup/Regex
          await validationSchema.validate(formData, { abortEarly: false });
          
          // 2. Llamada a Supabase (AuthService ya pasa el username en metadata)
          await AuthService.signUp(email, password, username.trim());
          Alert.alert(
            'Registro exitoso',
            'Por favor revisa tu correo para confirmar tu cuenta antes de iniciar sesión.'
          );
          if (onSignupSuccess) {
            onSignupSuccess();
          } else {
            setIsLogin(true);
          }
        } catch (validationError: any) {
          if (validationError.inner) {
            const formattedErrors = validationError.inner.map((err: any) => err.message);
            console.error("Errores de validación:", formattedErrors);
            Alert.alert('Error de validación', formattedErrors.join('\n'));
            return;
          }
          throw validationError;
        }
      }
    } catch (error: any) {
      console.error('Auth Error:', error);
      let msg = error.message || 'Ha ocurrido un error en la autenticación.';
      
      if (msg.toLowerCase().includes('rate limit') || error.status === 429) {
        Alert.alert(
          'Demasiados intentos', 
          'Por razones de seguridad, hemos pausado temporalmente los registros desde tu red. Por favor, intenta de nuevo en unos minutos.'
        );
        return; // Detenemos aquí para no mostrar el mensaje general
      }

      if (msg.includes('Email not confirmed')) {
        msg = '¡Casi listo! Debes confirmar tu correo electrónico antes de entrar. Revisa tu bandeja de entrada (y la carpeta de spam).';
      } else if (msg.includes('Invalid login credentials')) {
        msg = 'Email o contraseña incorrectos. Por favor, inténtalo de nuevo.';
      }
      
      Alert.alert('Aviso', msg);
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#575fcf', '#3c40c6']} style={styles.gradient}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setShowForgotPassword(false)}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>Introduce tu email y te enviaremos instrucciones.</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={handleAuth} disabled={loading}>
              {loading ? <ActivityIndicator color="#575fcf" /> : <Text style={styles.primaryButtonText}>Enviar Correo</Text>}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <LinearGradient colors={['#575fcf', '#3c40c6']} style={styles.gradient}>
        <View style={styles.header}>
          <LottieView
            source={require('../../assets/animation/pulpin.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
          <Text style={styles.title}>MyApp03</Text>
          <Text style={styles.subtitle}>Tu Coach de Idiomas con IA</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              onPress={() => setIsLogin(true)} 
              style={[styles.tab, isLogin && styles.activeTab]}
            >
              <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setIsLogin(false)} 
              style={[styles.tab, !isLogin && styles.activeTab]}
            >
              <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Registrarse</Text>
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Nombre de Usuario</Text>
              <View style={styles.inputBox}>
                <Ionicons name="person-outline" size={18} color="#A4B0BE" style={styles.icon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="ej. amigo99"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color="#A4B0BE" style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder="ejemplo@correo.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>
          </View>

          {!isLogin && (
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Contraseña (PIN)</Text>
              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={18} color="#A4B0BE" style={styles.icon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••"
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={6}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>
          )}

          {isLogin && (
            <TouchableOpacity onPress={() => setShowForgotPassword(true)} style={styles.forgotPass}>
              <Text style={styles.forgotPassText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.authButton} onPress={handleAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.authButtonText}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <Text 
            style={styles.footerLink} 
            onPress={() => setIsLogin(!isLogin)}
          >
            {' '}{isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </Text>
        </Text>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, justifyContent: 'center', padding: 24 },
  backButton: { position: 'absolute', top: 60, left: 24, zIndex: 10 },
  header: { alignItems: 'center', marginBottom: 40 },
  lottieAnimation: { width: 250, height: 250, alignSelf: 'center', marginBottom: -10, backgroundColor: 'transparent' },
  title: { fontSize: 32, fontWeight: '900', color: '#FFF' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginTop: 4 },
  
  formCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 32, 
    padding: 24, 
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 10 },
      web: { boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }
    })
  },
  tabContainer: { flexDirection: 'row', marginBottom: 24, backgroundColor: '#F1F2F6', borderRadius: 16, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { 
    backgroundColor: '#FFF', 
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.05)' }
    })
  },
  tabText: { fontSize: 14, fontWeight: '700', color: '#747D8C' },
  activeTabText: { color: '#3c40c6' },
  
  inputWrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '800', color: '#2F3542', marginBottom: 8, marginLeft: 4 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: 16, paddingHorizontal: 16, height: 56 },
  icon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 16, color: '#2F3542', fontWeight: '500' },
  
  forgotPass: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPassText: { fontSize: 13, fontWeight: '700', color: '#575fcf' },
  
  authButton: { 
    backgroundColor: '#3c40c6', 
    height: 56, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    ...Platform.select({
      ios: { shadowColor: '#3c40c6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 5 },
      web: { boxShadow: '0px 8px 12px rgba(60, 64, 198, 0.3)' }
    })
  },
  authButtonText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  
  footerText: { textAlign: 'center', marginTop: 32, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  footerLink: { color: '#FFF', fontWeight: '900', textDecorationLine: 'underline' },

  // Estilos Recuperación
  form: { width: '100%' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, paddingHorizontal: 16, height: 56, marginBottom: 20 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  primaryButton: { backgroundColor: '#FFF', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#3c40c6', fontSize: 16, fontWeight: '900' },
});
