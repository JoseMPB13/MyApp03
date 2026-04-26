import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import { KermesUsersService, KermesUser } from '../api/kermesUsers';

export default function KermesUsersSection() {
  const { currentTheme, activeColors, toggleTheme, updateUsername, setTheme } = useContext(ThemeContext);
  const isDarkMode = currentTheme === 'dark';
  const colors = {
    ...activeColors,
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    border: isDarkMode ? '#374151' : '#E5E7EB'
  };
  const [users, setUsers] = useState<KermesUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<KermesUser | null>(null);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async (pageNum: number, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await KermesUsersService.getUsers(pageNum);
      
      // Handle potential `{ data: [...] }` wrapper (like Reqres API)
      const userList: KermesUser[] = response.data || (Array.isArray(response) ? response : []);

      if (isRefresh || pageNum === 1) {
        setUsers(userList);
      } else {
        setUsers(prev => [...prev, ...userList]);
      }

      if (userList.length === 0 || (response.total_pages && pageNum >= response.total_pages)) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios de la comunidad.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const onRefresh = () => {
    setPage(1);
    fetchUsers(1, true);
  };

  const loadMore = () => {
    if (!loading && !refreshing && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  const handleSave = async () => {
    if (!formData.first_name || !formData.email) {
      Alert.alert('Incompleto', 'Por favor ingresa al menos nombre y correo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      };

      if (editingUser) {
        // Update
        await KermesUsersService.updateUser(editingUser.id, payload);
        // Optimistic UI update
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...payload } : u));
        Alert.alert('Éxito', 'Usuario actualizado correctamente.');
      } else {
        // Create
        const newUser = await KermesUsersService.createUser(payload);
        // Assuming API returns the created user. We append it to the top.
        const createdUser = { id: newUser.id || Date.now(), ...payload, avatar: newUser.avatar };
        setUsers([createdUser, ...users]);
        Alert.alert('Éxito', 'Usuario creado correctamente.');
      }
      closeModal();
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al guardar el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (user: KermesUser) => {
    Alert.alert(
      'Eliminar Usuario',
      `¿Estás seguro de que quieres eliminar a ${user.first_name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await KermesUsersService.deleteUser(user.id);
              setUsers(users.filter(u => u.id !== user.id));
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el usuario.');
            }
          }
        }
      ]
    );
  };

  const openModal = (user?: KermesUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        first_name: user.first_name || user.name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    } else {
      setEditingUser(null);
      setFormData({ first_name: '', last_name: '', email: '' });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingUser(null);
    setFormData({ first_name: '', last_name: '', email: '' });
  };

  const renderItem = ({ item }: { item: KermesUser }) => {
    const displayName = item.first_name ? `${item.first_name} ${item.last_name || ''}`.trim() : (item.name || 'Sin Nombre');
    
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.accent + '20' }]}>
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 20 }}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{displayName}</Text>
            <Text style={[styles.userEmail, { color: colors.text + '80' }]}>{item.email || 'Sin correo'}</Text>
          </View>
        </View>
        
        <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => openModal(item)}>
            <Ionicons name="create-outline" size={20} color={colors.accent} />
            <Text style={[styles.actionText, { color: colors.accent }]}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Directorio Kermés</Text>
        <Text style={[styles.subtitle, { color: colors.text + '80' }]}>Conoce a la comunidad</Text>
      </View>

      {loading && page === 1 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="people-outline" size={64} color={colors.text + '40'} />
              <Text style={{ color: colors.text + '80', marginTop: 16 }}>No hay usuarios todavía</Text>
            </View>
          }
          ListFooterComponent={
            hasMore && users.length > 0 ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.accent} />
              </View>
            ) : null
          }
        />
      )}

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.accent, ...Platform.select({ ios: styles.shadowIos, android: styles.shadowAndroid }) }]}
        onPress={() => openModal()}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' }]} />
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Ej. Juan"
                placeholderTextColor={colors.text + '50'}
                value={formData.first_name}
                onChangeText={(t) => setFormData({ ...formData, first_name: t })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Apellido</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Ej. Pérez"
                placeholderTextColor={colors.text + '50'}
                value={formData.last_name}
                onChangeText={(t) => setFormData({ ...formData, last_name: t })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Correo Electrónico</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="juan@ejemplo.com"
                placeholderTextColor={colors.text + '50'}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(t) => setFormData({ ...formData, email: t })}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, { backgroundColor: colors.accent, opacity: isSubmitting ? 0.7 : 1 }]}
              onPress={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitBtnText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 160, // Padding for FAB and Nav Bar
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 140, // Above Nav Bar
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  shadowIos: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  shadowAndroid: {
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
