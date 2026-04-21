import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StreakData } from '../api/missions';
import { AITutorService } from '../api/ai_tutor';
import { useAppTheme } from '../context/ThemeContext';
import { StreakPanel } from '../components/common/StreakPanel';

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return '¡Buenos días';
  if (hours < 18) return '¡Buenas tardes';
  return '¡Buenas noches';
};

export default function InicioSection({ streak, user }: { streak: StreakData | null, user: any }) {
  const { colors, username } = useAppTheme();
  const [dailyTip, setDailyTip] = useState<{english: string, spanish: string} | null>(null);
  const [loadingTip, setLoadingTip] = useState(true);

  useEffect(() => {
    AITutorService.getDailyTip().then(tip => {
      setDailyTip(tip);
      setLoadingTip(false);
    });
  }, []);

  const displayName = username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Amigo';

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionPadding}>
      <Text style={[styles.greetingText, { color: colors.text }]}>
        {getGreeting()}, <Text style={{ color: colors.accent }}>{displayName}</Text>! 👋
      </Text>
      
      <StreakPanel streak={streak} />

      <View style={styles.coachContext}>
        <View style={[styles.raccoonAvatar, styles.cardShadow, { backgroundColor: colors.card, borderColor: colors.accent }]}>
          <Text style={{ fontSize: 32 }}>🦝</Text>
        </View>
        <View style={[styles.chatBubble, styles.cardShadow, { backgroundColor: colors.card }]}>
          <Text style={[styles.coachName, { color: colors.accent }]}>Coach Raccoon</Text>
          {loadingTip ? (
            <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 10, alignSelf: 'flex-start' }} />
          ) : (
            <>
              <Text style={[styles.coachMsg, { fontWeight: 'bold', color: colors.text }]}>
                &quot;{dailyTip?.english}&quot;
              </Text>
              <Text style={[styles.coachMsg, { marginTop: 4, fontSize: 13, color: colors.text, opacity: 0.8 }]}>
                {dailyTip?.spanish}
              </Text>
            </>
          )}
        </View>
      </View>
    </ScrollView>
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
