import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

/**
 * AI Language Coach - Navigation Hub (Premium Gamified)
 * 
 * Estructura de navegación por secciones (Bottom Tabs) implementada 
 * mediante estado interno para una experiencia fluida y controlada.
 */

// --- Componentes de Logotipos Geométricos ---
const GeometricIcon = ({ name, active }: { name: string; active: boolean }) => {
  const color = active ? '#575fcf' : '#808e9b';
  
  if (name === 'home') return (
    <View style={styles.iconContainer}>
      <View style={[styles.iconBase, { backgroundColor: color, width: 14, height: 14, borderRadius: 2 }]} />
      <View style={[styles.iconBase, { backgroundColor: color, width: 8, height: 8, position: 'absolute', top: -4, transform: [{ rotate: '45deg' }] }]} />
    </View>
  );
  if (name === 'activities') return (
    <View style={styles.iconContainer}>
      <View style={[styles.iconBase, { borderColor: color, borderWidth: 2, width: 18, height: 18, borderRadius: 9, backgroundColor: 'transparent' }]} />
      <View style={[styles.iconBase, { backgroundColor: color, width: 2, height: 12, transform: [{ rotate: '45deg' }] }]} />
    </View>
  );
  if (name === 'vault') return (
    <View style={styles.iconContainer}>
      <View style={[styles.iconBase, { backgroundColor: color, width: 16, height: 10, borderRadius: 2 }]} />
      <View style={[styles.iconBase, { backgroundColor: color, width: 16, height: 3, marginTop: 2, borderRadius: 1 }]} />
    </View>
  );
  if (name === 'settings') return (
    <View style={styles.iconContainer}>
      <View style={[styles.iconBase, { borderColor: color, borderWidth: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: 'transparent' }]} />
    </View>
  );
  return null;
};

// --- Pantallas Individuales (Secciones) ---

const InicioSection = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionPadding}>
    <Text style={styles.greeting}>¡Hola, Robert! 👋</Text>
    <Text style={styles.motivation}>Hoy es un gran día para dominar el pasado simple.</Text>

    {/* Tarjeta de Racha Heroica */}
    <LinearGradient colors={['#ff3f34', '#ff7f50']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.heroCard}>
      <View style={styles.heroTop}>
        <View style={styles.heroLogo}>
          {/* Rayo geométrico */}
          <View style={[styles.geoLightning, { borderBottomColor: '#FFFFFF', borderBottomWidth: 15, borderLeftWidth: 10, borderLeftColor: 'transparent', transform: [{ skewY: '-20deg' }] }]} />
          <View style={[styles.geoLightning, { borderTopColor: '#FFFFFF', borderTopWidth: 15, borderRightWidth: 10, borderRightColor: 'transparent', marginTop: -5, transform: [{ skewY: '-20deg' }] }]} />
        </View>
        <View>
          <Text style={styles.heroCount}>7 Días</Text>
          <Text style={styles.heroStatus}>Racha invicta</Text>
        </View>
      </View>
      {/* Barra de Progreso */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: '70%' }]} />
      </View>
      <Text style={styles.progressText}>70% de la meta diaria completada</Text>
    </LinearGradient>

    {/* Burbuja del Coach */}
    <View style={styles.coachContainer}>
      <View style={styles.raccoonMini}>
        <Text style={{ fontSize: 24 }}>🦝</Text>
      </View>
      <View style={styles.chatBubble}>
        <Text style={styles.coachQuote}>"Did you know? 'Queue' is the only word in English that is still pronounced the same way when the last four letters are removed."</Text>
      </View>
    </View>
  </ScrollView>
);

const ActividadesSection = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionPadding}>
    <Text style={styles.sectionTitle}>Centro de Juego</Text>
    
    <TouchableOpacity activeOpacity={0.9} style={styles.activityCard}>
      <LinearGradient colors={['#1e272e', '#485460']} style={styles.cardGradient}>
        <Text style={styles.activityIcon}>🎙️</Text>
        <Text style={styles.activityTitle}>AI Roleplay</Text>
        <Text style={styles.activitySub}>Inmersión total en escenarios reales.</Text>
      </LinearGradient>
    </TouchableOpacity>

    <TouchableOpacity activeOpacity={0.9} style={styles.activityCard}>
      <LinearGradient colors={['#ef5777', '#f53b57']} style={styles.cardGradient}>
        <Text style={styles.activityIcon}>🧩</Text>
        <Text style={styles.activityTitle}>Word Matcher</Text>
        <Text style={styles.activitySub}>Entrenamiento de agilidad mental.</Text>
      </LinearGradient>
    </TouchableOpacity>
  </ScrollView>
);

const VaultSection = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionPadding}>
    <Text style={styles.sectionTitle}>Tesoros del Conocimiento</Text>
    {[1, 2, 3, 4, 5].map((i) => (
      <View key={i} style={styles.vaultCard}>
        <View style={styles.vaultInfo}>
          <Text style={styles.wordTitle}>Resilient</Text>
          <Text style={styles.wordDef}>Capaz de recuperarse rápido.</Text>
        </View>
        <View style={styles.masteryIndicator}>
          <View style={[styles.dot, { backgroundColor: '#05c46b' }]} />
          <Text style={styles.masteryText}>Dominado</Text>
        </View>
      </View>
    ))}
  </ScrollView>
);

const AjustesSection = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionPadding}>
    <Text style={styles.sectionTitle}>Configuración</Text>
    <View style={styles.settingsList}>
      {['Mi Perfil', 'Meta Diaria', 'Notificaciones', 'Idioma de la App'].map((item, index) => (
        <TouchableOpacity key={index} style={styles.settingsItem}>
          <Text style={styles.settingsText}>{item}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
);

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('inicio');

  const renderSection = () => {
    switch (activeTab) {
      case 'inicio': return <InicioSection />;
      case 'actividades': return <ActividadesSection />;
      case 'vault': return <VaultSection />;
      case 'settings': return <AjustesSection />;
      default: return <InicioSection />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Contenedor de Pantalla */}
      <View style={styles.content}>
        {renderSection()}
      </View>

      {/* Barra de Navegación Custom */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('inicio')}>
          <GeometricIcon name="home" active={activeTab === 'inicio'} />
          <Text style={[styles.tabLabel, activeTab === 'inicio' && styles.activeLabel]}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('actividades')}>
          <GeometricIcon name="activities" active={activeTab === 'actividades'} />
          <Text style={[styles.tabLabel, activeTab === 'actividades' && styles.activeLabel]}>Actividades</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('vault')}>
          <GeometricIcon name="vault" active={activeTab === 'vault'} />
          <Text style={[styles.tabLabel, activeTab === 'vault' && styles.activeLabel]}>El Baúl</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('settings')}>
          <GeometricIcon name="settings" active={activeTab === 'settings'} />
          <Text style={[styles.tabLabel, activeTab === 'settings' && styles.activeLabel]}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  content: {
    flex: 1,
  },
  sectionPadding: {
    padding: 24,
    paddingBottom: 100,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e272e',
  },
  motivation: {
    fontSize: 16,
    color: '#808e9b',
    marginTop: 8,
    marginBottom: 24,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#ff3f34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroLogo: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  geoLightning: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  heroCount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
  },
  heroStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  coachContainer: {
    flexDirection: 'row',
    marginTop: 32,
    alignItems: 'flex-start',
  },
  raccoonMini: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  chatBubble: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderTopLeftRadius: 2,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  coachQuote: {
    fontSize: 14,
    color: '#485460',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e272e',
    marginBottom: 20,
  },
  activityCard: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    height: 160,
  },
  cardGradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  activityIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  activitySub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  vaultCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  wordTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e272e',
  },
  wordDef: {
    fontSize: 13,
    color: '#808e9b',
    marginTop: 2,
  },
  masteryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  masteryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#485460',
  },
  settingsList: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  settingsItem: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e272e',
  },
  arrow: {
    fontSize: 20,
    color: '#cbd5e0',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    height: 90,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBase: {
    // Shared for geometric logos
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
    color: '#808e9b',
  },
  activeLabel: {
    color: '#575fcf',
  },
});
