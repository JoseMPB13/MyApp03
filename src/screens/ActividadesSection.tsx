import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WordMatcher from '../components/games/WordMatcher';
import AIScenario from './AIScenario';

interface ActividadesSectionProps {
  onComplete: () => void;
}

const ActividadesSection = ({ onComplete }: ActividadesSectionProps) => {
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

  if (currentMission === 'ai-scenario') {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => setCurrentMission(null)} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color="#575fcf" />
           <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <AIScenario onComplete={onComplete} />
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

      <TouchableOpacity 
        style={[styles.missionCard, styles.cardShadow]}
        onPress={() => setCurrentMission('ai-scenario')}
      >
        <View style={[styles.missionIcon, { backgroundColor: '#fff2f2' }]}>
          <Ionicons name="chatbubbles" size={32} color="#ff4757" />
        </View>
        <View style={styles.missionInfo}>
          <Text style={styles.missionTitle}>AI Scenario</Text>
          <Text style={styles.missionDesc}>Practica con tu Tutor IA</Text>
        </View>
        <Ionicons name="play-circle" size={32} color="#ff4757" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ActividadesSection;

const styles = StyleSheet.create({
  sectionPadding: { padding: 20, paddingBottom: 130 },
  sectionTitle: { fontSize: 24, fontWeight: '900', color: '#1e272e', marginBottom: 20 },
  cardShadow: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 6 },
      web: { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }
    })
  },
  missionCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 20, borderRadius: 24, alignItems: 'center', marginBottom: 16 },
  missionIcon: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  missionInfo: { flex: 1 },
  missionTitle: { fontSize: 18, fontWeight: '900', color: '#2d3436' },
  missionDesc: { fontSize: 14, color: '#636e72', marginTop: 2 },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backText: { marginLeft: 8, fontSize: 16, fontWeight: '700', color: '#575fcf' },
});
