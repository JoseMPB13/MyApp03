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
   * Se construye el payload explícitamente para evitar enviar un 'id' (aunque sea null)
   * y permitir que Supabase genere el UUID automáticamente (evita error 409).
   */
  async addVaultItem(word: VaultWord) {
    if (!word.user_id) {
      console.error('VaultService.addVaultItem: Missing user_id');
      return { success: false, error: { message: 'ID de usuario faltante' } };
    }

    const payload = {
      user_id: word.user_id,
      word_en: word.word_en,
      word_es: word.word_es,
      category: word.category || 'General',
      status: word.status || 'learning'
    };

    console.log('VaultService.addVaultItem: Intentando guardar...', payload);

    const { data, error } = await supabase
      .from('user_vault')
      .insert([payload])
      .select();

    if (error) {
      console.error('VaultService.addVaultItem ERROR:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return { success: false, error };
    }

    console.log('VaultService.addVaultItem SUCCESS:', data);
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
