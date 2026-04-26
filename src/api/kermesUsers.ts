export interface KermesUser {
  id: number;
  name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  [key: string]: any;
}

const BASE_URL = 'http://kermes.acredita360.com/api/users';

export const KermesUsersService = {
  getUsers: async (page: number = 1) => {
    try {
      const response = await fetch(`${BASE_URL}?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error fetching users');
      return await response.json();
    } catch (error) {
      console.error('getUsers error:', error);
      throw error;
    }
  },

  createUser: async (userData: Partial<KermesUser>) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Error creating user');
      return await response.json();
    } catch (error) {
      console.error('createUser error:', error);
      throw error;
    }
  },

  updateUser: async (id: number, userData: Partial<KermesUser>) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Error updating user');
      return await response.json();
    } catch (error) {
      console.error('updateUser error:', error);
      throw error;
    }
  },

  deleteUser: async (id: number) => {
    try {
      // Intentionally using https for delete as per the user's curl command (though others are http, best to keep exactly as requested)
      const response = await fetch(`https://kermes.acredita360.com/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error deleting user');
      // Some APIs return empty responses for DELETE
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (error) {
      console.error('deleteUser error:', error);
      throw error;
    }
  }
};
