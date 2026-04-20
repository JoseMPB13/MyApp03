import { supabase } from './supabase';

export interface VaultWord {
  id?: string;
  user_id: string;
  word_es: string;
  word_en: string;
  category?: string;
  status?: 'learning' | 'mastered';
  created_at?: string;
}

export const VaultService = {
  /**
   * Obtiene todas las palabras en el baúl del usuario.
   */
  async getWords(userId: string): Promise<VaultWord[]> {
    const { data, error } = await supabase
      .from('user_vault')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vault:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Agrega una nueva palabra al baúl.
   */
  async addWord(word: VaultWord) {
    const { data, error } = await supabase
      .from('user_vault')
      .insert([word])
      .select();

    if (error) {
      console.error('Error adding word to vault:', error.message, error.code, error.details);
      return { success: false, error };
    }
    return { success: true, data };
  },

  /**
   * Actualiza el estado de una palabra (ej: de learning a mastered).
   */
  async updateWordStatus(wordId: string, status: 'learning' | 'mastered') {
    const { error } = await supabase
      .from('user_vault')
      .update({ status })
      .eq('id', wordId);

    if (error) {
      console.error('Error updating status:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  /**
   * Elimina una palabra del baúl.
   */
  async deleteWord(wordId: string) {
    const { error } = await supabase
      .from('user_vault')
      .delete()
      .eq('id', wordId);

    if (error) {
      console.error('Error deleting word:', error);
      return { success: false, error };
    }
    return { success: true };
  }
};
