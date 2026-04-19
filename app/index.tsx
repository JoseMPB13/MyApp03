import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import WordMatcher from '../src/components/games/WordMatcher';
import { MissionsService, StreakData } from '../src/api/missions';
import { VaultService, VaultWord } from '../src/api/vault';

// Mock User ID (En una fase real, esto vendría de Supabase Auth)
const USER_ID = 'test-user-robert-123';

// --- Utilidades ---
const DAYS_NAMES = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MONTHS_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return '¡Buenos días';
  if (hours < 18) return '¡Buenas tardes';
  return '¡Buenas noches';
};

// --- Componentes compartidos ---
const TabIcon = ({ name, active }: { name: string; active: boolean }) => {
  let iconName: any = 'home';
  if (name === 'inicio') iconName = active ? 'home' : 'home-outline';
  if (name === 'activities') iconName = active ? 'compass' : 'compass-outline';
  if (name === 'vault') iconName = active ? 'archive' : 'archive-outline';
  if (name === 'settings') iconName = active ? 'settings' : 'settings-outline';

  return (
    <View style={styles.iconContainer}>
      <Ionicons name={iconName} size={26} color={active ? '#575fcf' : '#d2dae2'} />
    </View>
  );
};

// --- SECCIÓN 1: INICIO ---
const InicioSection = ({ streak }: { streak: StreakData | null }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewDate] = useState(new Date());
  const expandAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.spring(expandAnim, {
      toValue: isExpanded ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
    }).start();
    setIsExpanded(!isExpanded);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionPadding}>
      <Text style={styles.greetingText}>{getGreeting()}, Robert! 👋</Text>
      
      <View style={styles.cardShadow}>
        <TouchableOpacity activeOpacity={0.9} onPress={toggleExpand} style={styles.streakPanel}>
          <LinearGradient colors={['#575fcf', '#3c40c6']} style={styles.streakGradient}>
            <View style={styles.streakInfo}>
              <View style={styles.streakIconMain}>
                <Ionicons name="flame" size={30} color="#FFF" />
              </View>
              <View>
                <Text style={styles.streakCount}>{streak?.current_streak || 0} Días</Text>
                <Text style={styles.streakSub}>¡Racha imparable!</Text>
              </View>
            </View>

            <View style={styles.weeklyRow}>
              {DAYS_NAMES.map((d, i) => (
                <View key={i} style={styles.weekDay}>
                  <Text style={styles.weekDayLabel}>{d}</Text>
                  <View style={[styles.weekDayCircle, i < 5 ? styles.doneDay : styles.pendingDay]}>
                    {i < 5 ? <Ionicons name="checkmark" size={16} color="#FFF" /> : <View style={styles.emptyDot} />}
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.expandHint}>
              <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.tapToExpand}>{isExpanded ? 'Ver menos' : 'Ver historial completo'}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.expandedContainer, { height: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 360] }), opacity: expandAnim }]}>
        <View style={styles.calendarFull}>
           <Text style={styles.monthTitle}>{MONTHS_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}</Text>
           {/* Simplificado para el ejemplo, aquí iría el grid del calendario real */}
           <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
             <Text style={{ color: '#A4B0BE' }}>Visualización de racha sincronizada</Text>
           </View>
        </View>
      </Animated.View>

      <View style={styles.coachContext}>
        <View style={[styles.raccoonAvatar, styles.cardShadow]}>
          <Text style={{ fontSize: 32 }}>🦝</Text>
        </View>
        <View style={[styles.chatBubble, styles.cardShadow]}>
          <Text style={styles.coachName}>Coach Raccoon</Text>
          <Text style={styles.coachMsg}>
            &quot;Tu progreso se está sincronizando con la nube. ¡Cada palabra cuenta!&quot;
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// --- SECCIÓN 2: ACTIVIDADES ---
const ActividadesSection = ({ onComplete }: { onComplete: () => void }) => {
  const [currentMission, setCurrentMission] = useState<string | null>(null);

  if (currentMission === 'word-matcher') {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => setCurrentMission(null)} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color="#575fcf" />
           <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <WordMatcher onComplete={onComplete} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.sectionPadding}>
      <Text style={styles.sectionTitle}>Misiones Diarias</Text>
      <TouchableOpacity 
        style={[styles.missionCard, styles.cardShadow]} 
        onPress={() => setCurrentMission('word-matcher')}
      >
        <View style={[styles.missionIcon, { backgroundColor: '#eef1ff' }]}>
          <Ionicons name="extension-puzzle" size={32} color="#575fcf" />
        </View>
        <View style={styles.missionInfo}>
          <Text style={styles.missionTitle}>Word Matcher</Text>
          <Text style={styles.missionDesc}>Empareja el vocabulario de la semana.</Text>
        </View>
        <Ionicons name="play-circle" size={32} color="#575fcf" />
      </TouchableOpacity>

      <View style={[styles.missionCard, styles.cardShadow, { opacity: 0.5 }]}>
        <View style={[styles.missionIcon, { backgroundColor: '#fff2f2' }]}>
          <Ionicons name="chatbubbles" size={32} color="#ff4757" />
        </View>
        <View style={styles.missionInfo}>
          <Text style={styles.missionTitle}>AI Scenario</Text>
          <Text style={styles.missionDesc}>Próximamente...</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// --- SECCIÓN 3: EL BAÚL ---
const BaulSection = () => {
  const [words, setWords] = useState<VaultWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVault();
  }, []);

  const loadVault = async () => {
    const data = await VaultService.getWords(USER_ID);
    setWords(data);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.sectionTitle}>Tu Baúl</Text>
      <Text style={styles.sectionSubtitle}>Palabras que estás aprendiendo</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#575fcf" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={{ marginTop: 20 }}>
          {words.length === 0 ? (
             <View style={styles.emptyContainer}>
                <Ionicons name="book-outline" size={60} color="#d1d8e0" />
                <Text style={styles.emptyText}>Tu baúl está vacío. ¡Empieza a aprender!</Text>
             </View>
          ) : (
            words.map(w => (
              <View key={w.id} style={[styles.wordCard, styles.cardShadow]}>
                <View>
                  <Text style={styles.wordEs}>{w.word_es}</Text>
                  <Text style={styles.wordEn}>{w.word_en}</Text>
                </View>
                <View style={styles.tag}>
                   <Text style={styles.tagText}>{w.status?.toUpperCase()}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

// --- APP PRINCIPAL ---
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    loadGlobalData();
  }, []);

  const loadGlobalData = async () => {
    const data = await MissionsService.getStreak(USER_ID);
    setStreak(data);
  };

  const handleMissionComplete = async () => {
    const result = await MissionsService.completeMission(USER_ID, 'word-matcher');
    if (result.success) {
      loadGlobalData();
      setActiveTab('inicio');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.mainContent}>
        {activeTab === 'inicio' && <InicioSection streak={streak} />}
        {activeTab === 'activities' && <ActividadesSection onComplete={handleMissionComplete} />}
        {activeTab === 'vault' && <BaulSection />}
        {activeTab === 'settings' && <SimplePlaceholder title="AJUSTES" />}
      </View>

      <View style={styles.navContainer}>
        <View style={[styles.navBar, styles.cardShadow]}>
          {['inicio', 'activities', 'vault', 'settings'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.navItem} activeOpacity={0.6}>
              <TabIcon name={tab} active={activeTab === tab} />
              <Text style={[styles.navText, activeTab === tab ? styles.navTextActive : null]}>
                {tab === 'inicio' ? 'Inicio' : tab === 'activities' ? 'Misiones' : tab === 'vault' ? 'Baúl' : 'Ajustes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const SimplePlaceholder = ({ title }: any) => (
  <View style={styles.centered}><Text style={styles.sectionPlaceholderTitle}>{title}</Text></View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  mainContent: { flex: 1 },
  sectionPadding: { padding: 20, paddingBottom: 130 },
  greetingText: { fontSize: 28, fontWeight: '900', color: '#1e272e', marginBottom: 24, letterSpacing: -0.5 },
  sectionTitle: { fontSize: 24, fontWeight: '900', color: '#1e272e', marginBottom: 8 },
  sectionSubtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 20 },
  cardShadow: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 6 }
    })
  },
  
  // Streak Inicio
  streakPanel: { borderRadius: 28, overflow: 'hidden' },
  streakGradient: { padding: 24 },
  streakInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  streakIconMain: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  streakCount: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  streakSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },
  weeklyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  weekDay: { alignItems: 'center' },
  weekDayLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  weekDayCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  doneDay: { backgroundColor: '#05c46b' },
  pendingDay: { backgroundColor: 'rgba(255,255,255,0.15)' },
  emptyDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  expandHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  tapToExpand: { color: '#FFF', fontSize: 12, fontWeight: '800', opacity: 0.9 },

  // Mission Cards
  missionCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 20, borderRadius: 24, alignItems: 'center', marginBottom: 16 },
  missionIcon: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  missionInfo: { flex: 1 },
  missionTitle: { fontSize: 18, fontWeight: '900', color: '#2d3436' },
  missionDesc: { fontSize: 14, color: '#636e72', marginTop: 2 },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backText: { marginLeft: 8, fontSize: 16, fontWeight: '700', color: '#575fcf' },

  // Baul Styles
  wordCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  wordEs: { fontSize: 18, fontWeight: '900', color: '#2d3436' },
  wordEn: { fontSize: 15, color: '#575fcf', fontWeight: '700', marginTop: 2 },
  tag: { backgroundColor: '#f1f2f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 10, fontWeight: '900', color: '#95a5a6' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#95a5a6', marginTop: 16, textAlign: 'center', width: 200 },

  // Coach
  coachContext: { flexDirection: 'row', marginTop: 32, alignItems: 'flex-start' },
  raccoonAvatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#575fcf' },
  chatBubble: { flex: 1, marginLeft: 16, backgroundColor: '#FFF', padding: 18, borderRadius: 22, borderTopLeftRadius: 4, minHeight: 80 },
  coachName: { fontWeight: '900', color: '#575fcf', marginBottom: 6, fontSize: 15 },
  coachMsg: { color: '#485460', fontSize: 14, lineHeight: 22, fontWeight: '500' },

  // Nav
  navContainer: { position: 'absolute', bottom: 30, width: '100%', alignItems: 'center', paddingHorizontal: 24 },
  navBar: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.95)', height: 80, borderRadius: 40, width: '100%', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1, borderColor: '#FFF' },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { fontSize: 10, fontWeight: '900', color: '#CBD5E0', marginTop: 6, letterSpacing: 0.2 },
  navTextActive: { color: '#575fcf' },
  iconContainer: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionPlaceholderTitle: { fontSize: 24, fontWeight: '900', color: '#2f3542' },
  expandedContainer: { backgroundColor: '#FFF', borderRadius: 28, marginTop: 12, overflow: 'hidden' },
  calendarFull: { padding: 20 },
  monthTitle: { fontSize: 18, fontWeight: '900', color: '#2f3542', textAlign: 'center' },
});
