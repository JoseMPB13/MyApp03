import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface WordPair {
  id: string;
  word: string;
  translation: string;
  matchId: number;
}

interface Card {
  id: string;
  content: string;
  matchId: number;
  type: 'es' | 'en';
}

const WORDS: WordPair[] = [
  { id: '1', word: 'Manzana', translation: 'Apple', matchId: 1 },
  { id: '2', word: 'Pan', translation: 'Bread', matchId: 2 },
  { id: '3', word: 'Agua', translation: 'Water', matchId: 3 },
  { id: '4', word: 'Hola', translation: 'Hello', matchId: 4 },
  { id: '5', word: 'Adiós', translation: 'Goodbye', matchId: 5 },
  { id: '6', word: 'Pasaporte', translation: 'Passport', matchId: 6 },
];

export default function WordMatcher({ onComplete }: { onComplete: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number[]>([]);

  useEffect(() => {
    // Preparar cartas mezcladas
    const list: Card[] = [];
    WORDS.forEach(p => {
      list.push({ id: `es-${p.id}`, content: p.word, matchId: p.matchId, type: 'es' });
      list.push({ id: `en-${p.id}`, content: p.translation, matchId: p.matchId, type: 'en' });
    });
    setCards(list.sort(() => Math.random() - 0.5));
  }, []);

  const handleSelect = (index: number) => {
    if (matched.includes(index) || selected.includes(index) || selected.length >= 2) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (newSelected.length === 2) {
      const first = cards[newSelected[0]];
      const second = cards[newSelected[1]];

      if (first.matchId === second.matchId) {
        // MATCH!
        setTimeout(() => {
          setMatched(prev => [...prev, ...newSelected]);
          setSelected([]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          if (matched.length + 2 === cards.length) {
            onComplete();
          }
        }, 500);
      } else {
        // ERROR
        setWrong(newSelected);
        setTimeout(() => {
          setSelected([]);
          setWrong([]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Empareja las palabras</Text>
      <View style={styles.grid}>
        {cards.map((card, index) => {
          const isSelected = selected.includes(index);
          const isMatched = matched.includes(index);
          const isWrong = wrong.includes(index);

          return (
            <TouchableOpacity
              key={card.id}
              onPress={() => handleSelect(index)}
              disabled={isMatched}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                isMatched && styles.cardMatched,
                isWrong && styles.cardWrong
              ]}
            >
              <Text style={[
                styles.cardText, 
                isSelected && styles.cardTextActive,
                isMatched && styles.cardTextMatched
              ]}>
                {card.content}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: '#2f3542', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  card: {
    width: (width - 60) / 2,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 16,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F1F2F6',
    borderBottomWidth: 4,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }
    })
  },
  cardSelected: { borderColor: '#575fcf', backgroundColor: '#f0f1ff' },
  cardMatched: { borderColor: '#05c46b', backgroundColor: '#e9fbee', borderBottomWidth: 2 },
  cardWrong: { borderColor: '#ff4757', backgroundColor: '#fff2f2' },
  cardText: { fontSize: 16, fontWeight: '800', color: '#57606f', textAlign: 'center' },
  cardTextActive: { color: '#575fcf' },
  cardTextMatched: { color: '#05c46b' },
});
