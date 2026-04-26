import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { Audio } from 'expo-av';

// Helper para mapear el nombre de la ruta a los iconos de Ionicons
const getIconName = (routeName: string, isFocused: boolean): any => {
  switch (routeName.toLowerCase()) {
    case 'index':
    case 'inicio': return isFocused ? 'home' : 'home-outline';
    case 'activities':
    case 'misiones': return isFocused ? 'flag' : 'flag-outline';
    case 'vault':
    case 'baul': return isFocused ? 'wallet' : 'wallet-outline';
    case 'kermes_users':
    case 'directorio': return isFocused ? 'people' : 'people-outline';
    case 'settings':
    case 'ajustes': return isFocused ? 'settings' : 'settings-outline';
    default: return isFocused ? 'ellipse' : 'ellipse-outline';
  }
};

// Helper para mapear el nombre de la ruta a un texto legible
const getLabelName = (routeName: string) => {
  switch (routeName.toLowerCase()) {
    case 'index':
    case 'inicio': return 'Inicio';
    case 'activities':
    case 'misiones': return 'Misiones';
    case 'vault':
    case 'baul': return 'Baúl';
    case 'kermes_users':
    case 'directorio': return 'Directorio';
    case 'settings':
    case 'ajustes': return 'Ajustes';
    default: return routeName;
  }
};

// Sub-componente que maneja la animación individual de cada pestaña
const TabItem = ({ isFocused, onPress, routeName, activeColors, currentTheme }: any) => {
  const { setIsTabBarHidden } = useContext(ThemeContext);
  const animatedValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const lastPressRef = useRef(0);

  const playTabSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/audio/sonido_botones_del_menu_(inicio,misiones,baul,directorio,ajustes).mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log("Error de audio en tab", error);
    }
  };

  const handlePress = () => {
    playTabSound();
    const time = new Date().getTime();
    const delta = time - lastPressRef.current;
    const DOUBLE_PRESS_DELAY = 300;
    if (delta < DOUBLE_PRESS_DELAY) {
      setIsTabBarHidden(true); // Oculta la barra en doble toque
    } else {
      onPress(); // Navegación normal en toque simple
    }
    lastPressRef.current = time;
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused ? 1 : 0,
      duration: 300, // Duración suave de 300ms
      useNativeDriver: false, // Debe ser false porque estamos animando el 'width' (layout)
    }).start();
  }, [isFocused]);

  // Interpolamos el valor de 0-1 a porcentajes de ancho
  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['12%', '35%'] // Píldora inactiva pequeña, activa expandida
  });

  // Animamos la opacidad del texto para que no se sobreponga al colapsarse
  const textOpacity = animatedValue.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const iconColor = isFocused ? '#FFFFFF' : (currentTheme === 'dark' ? '#9CA3AF' : '#6B7280');

  return (
    <Animated.View style={[styles.tabContainer, { width }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.touchable}>
        {isFocused ? (
          <LinearGradient
            colors={[activeColors.primary, activeColors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activePill}
          >
            <Ionicons name={getIconName(routeName, isFocused)} size={20} color={iconColor} />
            <Animated.Text style={[styles.tabText, { opacity: textOpacity }]} numberOfLines={1}>
              {getLabelName(routeName)}
            </Animated.Text>
          </LinearGradient>
        ) : (
          <View style={styles.inactivePill}>
            <Ionicons name={getIconName(routeName, isFocused)} size={24} color={iconColor} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

interface CustomTabBarProps {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function CustomTabBar({ tabs, activeTab, onTabPress }: CustomTabBarProps) {
  const { currentTheme, activeColors, isTabBarHidden } = useContext(ThemeContext);
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateYAnim, {
      toValue: isTabBarHidden ? 150 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isTabBarHidden]);

  const containerBg = currentTheme === 'light' ? '#FFFFFF' : '#1F2937';

  return (
    <Animated.View style={[styles.mainContainer, { backgroundColor: containerBg, transform: [{ translateY: translateYAnim }] }]}>
      {tabs.map((tab) => {
        const isFocused = activeTab === tab;

        return (
          <TabItem
            key={tab}
            isFocused={isFocused}
            onPress={() => onTabPress(tab)}
            routeName={tab}
            activeColors={activeColors}
            currentTheme={currentTheme}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 25, // Separación del borde inferior
    alignSelf: 'center',
    width: '92%',
    height: 70,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    // Sombra flotante suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  tabContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    height: '100%',
    width: '100%',
    borderRadius: 30, // Forma de píldora
  },
  inactivePill: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 13,
  }
});
