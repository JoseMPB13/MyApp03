import { supabase } from './supabase';

export interface StreakData {
  current_streak: number;
  max_streak: number;
  last_completion_date: string | null;
}

export const MissionsService = {
  /**
   * Registra una misión completada y actualiza la racha.
   */
  async completeMission(userId: string, missionType: string) {
    try {
      // 1. Insertar log de misión
      const { error: logError } = await supabase
        .from('mission_logs')
        .insert([{ user_id: userId, mission_type: missionType }]);

      if (logError) throw logError;

      // 2. Obtener racha actual
      const { data: streak, error: streakFetchError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (streakFetchError && streakFetchError.code !== 'PGRST116') throw streakFetchError;

      const today = new Date().toISOString().split('T')[0];
      let newStreak = 1;
      let newMax = 1;

      if (streak) {
        const lastDate = streak.last_completion_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastDate === today) {
          // Ya completó una hoy, la racha se mantiene igual
          newStreak = streak.current_streak;
          newMax = streak.max_streak;
        } else if (lastDate === yesterdayStr) {
          // Continuidad de racha
          newStreak = streak.current_streak + 1;
          newMax = Math.max(newStreak, streak.max_streak);
        } else {
          // Racha perdida, empieza en 1
          newStreak = 1;
          newMax = streak.max_streak;
        }

        const { error: updateError } = await supabase
          .from('user_streaks')
          .update({ 
            current_streak: newStreak, 
            max_streak: newMax, 
            last_completion_date: today,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (updateError) throw updateError;
      } else {
        // Primera vez
        const { error: insertError } = await supabase
          .from('user_streaks')
          .insert([{ 
            user_id: userId, 
            current_streak: 1, 
            max_streak: 1, 
            last_completion_date: today 
          }]);
        if (insertError) throw insertError;
      }

      return { success: true, streak: newStreak };
    } catch (error) {
      console.error('Error in completeMission:', error);
      return { success: false, error };
    }
  },

  /**
   * Obtiene la racha actual del usuario.
   */
  async getStreak(userId: string): Promise<StreakData | null> {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('current_streak, max_streak, last_completion_date')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) return null;
    return data;
  }
};
