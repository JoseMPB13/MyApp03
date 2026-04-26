import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { AuthService } from '../src/api/auth';
import AuthSection from '../src/views/AuthSection';
import { MissionsService, StreakData } from '../src/api/missions';
import ActivitiesSection from '../src/views/ActivitiesSection';
import VaultSection from '../src/views/VaultSection';
import InicioSection from '../src/views/InicioSection';
import SettingsSection from '../src/views/SettingsSection';
import KermesUsersSection from '../src/views/KermesUsersSection';
import { ThemeContext } from '../src/context/ThemeContext';
import { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import PinEntryScreen from '../src/screens/PinEntryScreen';
import CustomTabBar from '../src/components/navigation/CustomTabBar';

export default function HomeScreen() {
  const { currentTheme, activeColors, setTheme, updateUsername } = useContext(ThemeContext);
  const isDarkMode = currentTheme === 'dark';
  const colors = {
    ...activeColors,
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    border: isDarkMode ? '#374151' : '#E5E7EB'
  };
  
  const [activeTab, setActiveTab] = useState('inicio');
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isAppLoading, setIsAppLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'loading' | 'auth' | 'pin_login' | 'pin_unlock' | 'main'>('loading');
  const [authEmail, setAuthEmail] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const navAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAppLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isAppLoading, fadeAnim]);

  const toggleNav = () => {
    const toValue = isNavVisible ? 130 : 0;
    Animated.spring(navAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    setIsNavVisible(!isNavVisible);
  };

  const handleMissionStateChange = (active: boolean) => {
    const toValue = active ? 130 : 0;
    Animated.spring(navAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    setIsNavVisible(!active);
  };

  const fetchFullProfile = useCallback(async (user: any) => {
    await AuthService.ensureProfile(user.id, user.email || '');
    const profile = await AuthService.getProfile(user.id);
    if (profile?.username) {
      updateUsername(profile.username);
    }
    return { ...user, user_metadata: { ...user.user_metadata, username: profile?.username } };
  }, [updateUsername]);

  const loadGlobalData = useCallback(async () => {
    if (!session?.user?.id) return;
    const data = await MissionsService.getStreak(session.user.id);
    setStreak(data);
  }, [session?.user?.id]);

  useEffect(() => {
    const initAuth = async () => {
      const user = await AuthService.getCurrentUser();
      const hasPIN = await AsyncStorage.getItem('hasCompletedPinFlow');
      
      if (user) {
        const fullUser = await fetchFullProfile(user);
        setSession({ user: fullUser });
        if (hasPIN === 'true') {
          setAuthStep('pin_unlock');
        } else {
          setAuthStep('main');
        }
      } else {
        setSession(null);
        setAuthStep('auth');
      }
    };
    initAuth();

    const { data: authListener } = AuthService.onAuthStateChange(async (newSession) => {
      if (newSession?.user) {
        const fullUser = await fetchFullProfile(newSession.user);
        const updatedSession = {
          ...newSession,
          user: fullUser ? fullUser : newSession.user
        };
        setSession(updatedSession as any);
        // Don't auto-redirect here to avoid interrupting PIN flow
      } else {
        setSession(null);
        setAuthStep('auth');
      }
    });

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, [fetchFullProfile]);

  useEffect(() => {
    loadGlobalData();
  }, [loadGlobalData]);

  const handleMissionComplete = async (missionType: string, data?: any) => {
    if (!session?.user?.id) return;
    
    const result = await MissionsService.completeMission(session.user.id, missionType);
    
    if (result.success) {
      loadGlobalData();
      handleMissionStateChange(false);
      setActiveTab('inicio');
    }
  };

  const handlePinRequestedForLogin = (email: string) => {
    setAuthEmail(email);
    setAuthStep('pin_login');
  };

  const handleSignupSuccess = () => {
    setAuthStep('auth');
  };

  const handleBiometricSuccess = async () => {
    setIsAppLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAuthStep('main');
    setIsAppLoading(false);
  };

  const handlePinSubmit = async (pin: string) => {
    setPinError(null);
    try {
      if (authStep === 'pin_login') {
        await AuthService.signIn(authEmail, pin);
        await SecureStore.setItemAsync('userPin', pin);
        await AsyncStorage.setItem('hasCompletedPinFlow', 'true');
      } else if (authStep === 'pin_unlock') {
        const storedPin = await SecureStore.getItemAsync('userPin');
        if (storedPin !== pin) {
          throw new Error('PIN incorrecto. Inténtalo de nuevo.');
        }
      }
      
      setIsAppLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setAuthStep('main');
    } catch (error: any) {
      setPinError(error.message || 'PIN incorrecto. Inténtalo de nuevo.');
    } finally {
      setIsAppLoading(false);
    }
  };

  const handleForgotPin = async () => {
    await handleLogout();
  };

  const handleLogout = async () => {
    await AuthService.signOut();
    await AsyncStorage.removeItem('hasCompletedPinFlow');
    await AsyncStorage.removeItem('userEmail'); // just in case we store it
    await SecureStore.deleteItemAsync('userPin');
    setSession(null);
    setAuthStep('auth');
    setActiveTab('inicio');
  };

  let content;
  if (authStep === 'loading') {
    content = <View style={[styles.centered, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.accent} /></View>;
  } else if (authStep === 'auth') {
    content = (
      <AuthSection 
        onPinRequestedForLogin={handlePinRequestedForLogin}
        onSignupSuccess={handleSignupSuccess}
      />
    );
  } else if (authStep === 'pin_login' || authStep === 'pin_unlock') {
    content = (
      <PinEntryScreen 
        username={session?.user?.user_metadata?.username || authEmail.split('@')[0]}
        onPinComplete={handlePinSubmit}
        onForgotPin={handleForgotPin}
        error={pinError}
        onBiometricSuccess={handleBiometricSuccess}
        mode={authStep === 'pin_unlock' ? 'unlock' : 'login'}
      />
    );
  } else if (!session || !session.user) {
    content = <View style={[styles.centered, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.accent} /></View>;
  } else {
    content = (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        
        <View style={styles.mainContent}>
          {activeTab === 'inicio' && <InicioSection streak={streak} user={session.user} />}
          {activeTab === 'activities' && (
            <ActivitiesSection 
              userId={session.user.id} 
              onComplete={handleMissionComplete} 
              onMissionStateChange={handleMissionStateChange}
            />
          )}
          {activeTab === 'vault' && <VaultSection userId={session.user.id} />}
          {activeTab === 'kermes_users' && <KermesUsersSection />}
          {activeTab === 'settings' && (
            <SettingsSection 
              user={session.user}
              onLogout={handleLogout} 
              onProfileUpdate={(newSessionUser: any) => setSession({ ...session, user: newSessionUser })}
            />
          )}
        </View>

        <Animated.View style={[styles.navContainer, { transform: [{ translateY: navAnim }] }]}>
          <CustomTabBar 
            tabs={['inicio', 'activities', 'vault', 'kermes_users', 'settings']}
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {content}
      <Animated.View 
        pointerEvents={isAppLoading ? 'auto' : 'none'}
        style={[
          StyleSheet.absoluteFill, 
          { 
            backgroundColor: '#3F51B5', 
            zIndex: 9999, 
            elevation: 10,
            opacity: fadeAnim 
          }
        ]}
      >
        <LottieView
          source={require('../assets/animation/portada.json')}
          autoPlay
          loop
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  mainContent: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardShadow: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 6 },
      web: { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }
    })
  },
  navContainer: { position: 'absolute', bottom: 0, width: '100%', alignItems: 'center' },
  navBar: { flexDirection: 'row', height: 80, width: '100%', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 12 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { fontSize: 10, fontWeight: '900', color: '#CBD5E0', marginTop: 6, letterSpacing: 0.2 },
  iconContainer: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  navHandle: { 
    position: 'absolute', 
    alignSelf: 'center', 
    width: 60, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    zIndex: 100
  }
});
