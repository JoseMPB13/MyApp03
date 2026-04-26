import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Animated,
  Easing,
  Pressable
} from 'react-native';
import { StreakData } from '../api/missions';
import { AITutorService } from '../api/ai_tutor';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import LottieView from 'lottie-react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av';

export default function InicioSection({ streak, user }: { streak: StreakData | null, user: any }) {
  const { currentTheme, activeColors, setTheme, username, setIsTabBarHidden } = useContext(ThemeContext);
  const [dailyTip, setDailyTip] = useState<{english: string, spanish: string} | null>(null);
  const [loadingTip, setLoadingTip] = useState(true);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [pulpoOverride, setPulpoOverride] = useState(currentTheme);

  const playCardSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/sonido_de_los_botones_JUGAR_ ESTADISTICAS_RACHA.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing card sound', error);
    }
  };

  const playMenuSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/sonido_botones_del_menu_(inicio,misiones,baul,directorio,ajustes).mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing menu sound', error);
    }
  };

  useEffect(() => {
    setPulpoOverride(currentTheme);
  }, [currentTheme]);

  const lastOctopusPressRef = useRef(0);
  const handleOctopusPress = () => {
    const time = new Date().getTime();
    if (time - lastOctopusPressRef.current < 300) {
      if (setIsTabBarHidden) setIsTabBarHidden(false);
      playMenuSound();
      setPulpoOverride(prev => prev === 'light' ? 'dark' : 'light');
    }
    lastOctopusPressRef.current = time;
  };
  
  const [racha, setRacha] = useState(0);
  const [estaActiva, setEstaActiva] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (estaActiva) {
      timeout = setTimeout(() => {
        setRacha(0);
        setEstaActiva(false);
      }, 15000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [estaActiva]);

  const rachaOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rachaOpacityAnim, {
      toValue: estaActiva ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [estaActiva]);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const selectorTranslateY = useRef(new Animated.Value(-100)).current;

  const handleToggleThemeSelector = () => {
    if (isThemeMenuOpen) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(selectorTranslateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(() => setIsThemeMenuOpen(false));
    } else {
      setIsThemeMenuOpen(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(selectorTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        })
      ]).start();
    }
  };

  const selectTheme = (theme: 'light'|'dark') => {
    setTheme(theme);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(selectorTranslateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => setIsThemeMenuOpen(false));
  };

  useEffect(() => {
    AITutorService.getDailyTip().then(tip => {
      setDailyTip(tip);
      setLoadingTip(false);
    });
  }, []);

  const displayName = username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Amigo';

  const dynamicTextColor = currentTheme === 'light' ? activeColors.text : '#F5F5F5';

  return (
    <View style={{ flex: 1, backgroundColor: activeColors.background }}>
      
      {/* 1. Capa Base (El Dashboard) */}
      <View style={{ flex: 1, backgroundColor: activeColors.background, paddingTop: 100 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Pressable onPress={handleOctopusPress}>
            <LottieView
              source={
                pulpoOverride === 'dark' 
                  ? require('../../assets/animation/modo_oscuro.json') 
                  : require('../../assets/animation/modo_claro.json')
              }
              autoPlay
              loop
              style={{ width: 400, maxWidth: '90%', aspectRatio: 1 }} 
            />
          </Pressable>
        </View>

        {/* Cluster de 3 Tarjetas (Empujado Abajo) */}
        <View style={{ width: '100%', alignSelf: 'center', position: 'relative', paddingBottom: 110, paddingHorizontal: 20 }}>
          
          {/* Tarjeta Superior (Verde) */}
          <TouchableOpacity activeOpacity={0.8} onPress={playCardSound} style={{ backgroundColor: '#10B981', borderRadius: 16, padding: 30, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <Ionicons name="game-controller" size={48} color="white" />
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 12 }}>JUGAR</Text>
          </TouchableOpacity>

          {/* Fila Inferior */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, zIndex: 1 }}>
            
            {/* Tarjeta Inferior Izquierda (Azul) */}
            <TouchableOpacity activeOpacity={0.8} onPress={playCardSound} style={{ flex: 1, backgroundColor: activeColors.primary, borderRadius: 16, padding: 15, marginRight: 6 }}>
              <Ionicons name="stats-chart" size={24} color="white" />
              <View style={{ marginTop: 24 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Estadísticas</Text>
              </View>
            </TouchableOpacity>

            {/* Tarjeta Inferior Derecha (Racha) */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => {
                playCardSound();
                setRacha(prev => prev + 1);
                setEstaActiva(true);
              }}
              style={{ flex: 1, backgroundColor: estaActiva ? '#EF4444' : '#374151', borderRadius: 16, padding: 15, marginLeft: 6, position: 'relative' }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {/* Capa 1: Estática */}
                  <Animated.View style={{ 
                    position: 'absolute', 
                    opacity: rachaOpacityAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%'
                  }}>
                    <Ionicons name="flame" size={80} color="rgba(255,255,255,0.5)" />
                  </Animated.View>
                  
                  {/* Capa 2: Animada */}
                  <Animated.View style={{ 
                    position: 'absolute', 
                    opacity: rachaOpacityAnim,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%'
                  }}>
                    <LottieView
                      source={require('../../assets/animation/racha.json')}
                      autoPlay={estaActiva}
                      loop={true}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </Animated.View>
                </View>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{racha}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' }}>
                {(() => {
                  const diasSemana = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
                  const rachaEnCiclo = racha === 0 ? 0 : ((racha - 1) % 7) + 1;
                  const diasVisibles = Math.max(4, rachaEnCiclo);
                  const diasAMostrar = diasSemana.slice(0, diasVisibles);
                  
                  return diasAMostrar.map((day, idx) => {
                    const isActive = idx < rachaEnCiclo;
                    return (
                      <View key={idx} style={{ alignItems: 'center' }}>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>{day}</Text>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isActive ? '#FFD700' : 'rgba(255,255,255,0.2)' }} />
                      </View>
                    );
                  });
                })()}
              </View>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>

      {/* 2. Capa de Difuminado (El BlurView Inteligente) */}
      <Animated.View 
        pointerEvents={isThemeMenuOpen ? 'auto' : 'none'}
        style={{ position: 'absolute', top: 100, bottom: 0, left: 0, right: 0, zIndex: 40, elevation: 40, opacity: overlayOpacity }}
      >
        <BlurView intensity={70} tint="dark" style={{ flex: 1 }} />
      </Animated.View>

      {/* 3. Capa del Encabezado (La Pared Intocable) */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        paddingTop: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 100,
        elevation: 100,
        backgroundColor: activeColors.background
      }}>
        {/* Módulo 1 (Paleta de Colores) */}
        <TouchableOpacity 
          style={{ alignItems: 'flex-start', minWidth: 60 }} 
          onPress={handleToggleThemeSelector}
        >
          <MaterialCommunityIcons name="palette-outline" size={28} color={activeColors.accent || "#E0E0E0"} />
        </TouchableOpacity>

        {/* Módulo 2 (PULPIN) */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ 
            color: dynamicTextColor, 
            fontSize: 22, 
            fontWeight: '900', 
            letterSpacing: 4,
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' 
          }}>
            PULPIN
          </Text>
        </View>

        {/* Módulo 3 (Selector de Idioma) */}
        <View style={{ width: 40, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 24 }}>🇺🇸</Text>
        </View>
      </View>

      {/* 4. Capa del Menú de Temas (Los cuadros de colores) */}
      <View style={{
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        height: 100,
        overflow: 'hidden',
        zIndex: 50,
        elevation: 50
      }} pointerEvents={isThemeMenuOpen ? 'auto' : 'none'}>
        <Animated.View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 25,
          paddingTop: 15,
          transform: [{ translateY: selectorTranslateY }]
        }}>
          {/* Cuadro 1: Claro */}
          <TouchableOpacity 
            style={{ 
              width: 55, 
              height: 55, 
              borderRadius: 14, 
              overflow: 'hidden', 
              flexDirection: 'row',
              borderWidth: currentTheme === 'light' ? 3 : 1, 
              borderColor: currentTheme === 'light' ? activeColors.primary : 'rgba(150,150,150,0.3)',
              elevation: 3,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 }
            }}
            onPress={() => selectTheme('light')}
          >
            <View style={{ flex: 1, backgroundColor: '#d9e0e6' }} />
            <View style={{ flex: 1, backgroundColor: '#b0e8fd' }} />
          </TouchableOpacity>
          {/* Cuadro 2: Oscuro */}
          <TouchableOpacity 
            style={{ 
              width: 55, 
              height: 55, 
              borderRadius: 14, 
              overflow: 'hidden', 
              flexDirection: 'row',
              borderWidth: currentTheme === 'dark' ? 3 : 1, 
              borderColor: currentTheme === 'dark' ? activeColors.accent : 'rgba(150,150,150,0.3)',
              elevation: 3,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 }
            }}
            onPress={() => selectTheme('dark')}
          >
            <View style={{ flex: 1, backgroundColor: '#92a7fe' }} />
            <View style={{ flex: 1, backgroundColor: '#fafafa' }} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionPadding: { padding: 20, paddingBottom: 130 },
  greetingText: { fontSize: 28, fontWeight: '900', color: '#1e272e', marginBottom: 24, letterSpacing: -0.5 },
  cardShadow: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 6 },
      web: { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }
    })
  },
  coachContext: { flexDirection: 'row', marginTop: 32, alignItems: 'flex-start' },
  raccoonAvatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#575fcf' },
  chatBubble: { flex: 1, marginLeft: 16, backgroundColor: '#FFF', padding: 18, borderRadius: 22, borderTopLeftRadius: 4, minHeight: 80 },
  coachName: { fontWeight: '900', color: '#575fcf', marginBottom: 6, fontSize: 15 },
  coachMsg: { color: '#485460', fontSize: 14, lineHeight: 22, fontWeight: '500' },
});
