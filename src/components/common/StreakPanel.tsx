import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * StreakPanel - Panel de Racha Diaria
 * 
 * Muestra el contador de días y un mini-calendario semanal.
 * Utiliza un degradado vibrante para resaltar el progreso del usuario.
 */

const { width } = Dimensions.get('window');

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const ACTIVE_DAYS = [0, 1, 2, 3, 4, 5, 6]; // Representa racha de 7 días activa

export const StreakPanel = () => {
  return (
    <LinearGradient
      colors={['#FF8C00', '#FFD700']} // Naranja a Amarillo vibrante
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <View style={styles.countContainer}>
          <Text style={styles.fireIcon}>🔥</Text>
          <View>
            <Text style={styles.streakCount}>7 Días</Text>
            <Text style={styles.streakLabel}>¡Racha actual!</Text>
          </View>
        </View>
        <View style={styles.raccoonCoachHeader}>
          <Text style={{ fontSize: 24 }}>🦝</Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        {DAYS.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <View style={[
              styles.checkpoint, 
              ACTIVE_DAYS.includes(index) ? styles.activeCheckpoint : styles.inactiveCheckpoint
            ]}>
              {ACTIVE_DAYS.includes(index) ? (
                <Text style={styles.checkpointIcon}>🔥</Text>
              ) : null}
            </View>
            <Text style={styles.dayLabel}>{day}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireIcon: {
    fontSize: 44,
    marginRight: 12,
  },
  streakCount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  streakLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  raccoonCoachHeader: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dayColumn: {
    alignItems: 'center',
  },
  checkpoint: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  activeCheckpoint: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  inactiveCheckpoint: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  checkpointIcon: {
    fontSize: 16,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
