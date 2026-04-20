import { supabase } from './supabase';

/**
 * Servicio para manejar la autenticación con Supabase.
 */
export const AuthService = {
  /**
   * Registro de un nuevo usuario.
   */
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Inicio de sesión.
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // Asegurar que el perfil existe después de login
    if (data.user) {
      await AuthService.ensureProfile(data.user.id, data.user.email || '');
    }
    return data;
  },

  /**
   * Cierre de sesión.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Recuperación de contraseña.
   */
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  /**
   * Obtener el usuario actual.
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Listener para cambios en el estado de autenticación.
   */
  onAuthStateChange(callback: (session: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },

  /**
   * Asegura que el usuario tenga un registro en la tabla 'profiles'.
   * Necesario porque user_vault tiene una foreign key a profiles.
   */
  async ensureProfile(userId: string, email: string) {
    try {
      // Verificar si ya existe
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!existing) {
        // Crear el perfil
        const { error } = await supabase
          .from('profiles')
          .insert([{ id: userId, email }]);

        if (error) {
          console.error('Error creating profile:', error.message);
        } else {
          console.log('Profile created for user:', userId);
        }
      }
    } catch (err) {
      console.error('ensureProfile error:', err);
    }
  }
};
