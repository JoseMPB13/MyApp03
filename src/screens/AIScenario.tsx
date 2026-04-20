import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AITutorService, LessonResponse } from '../api/ai_tutor';

interface Message {
  id: string;
  text: string;
  translation: string;
  sender: 'user' | 'ai';
  feedbackType?: 'success' | 'correction' | 'neutral';
  isTranslationVisible?: boolean;
}

interface AIScenarioProps {
  onComplete: () => void;
}

const AIScenario = ({ onComplete }: AIScenarioProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Hello! I'm your AI Tutor. Today we are at a London coffee shop. Try to order a latte.", 
      translation: "¡Hola! Soy tu Tutor IA. Hoy estamos en una cafetería de Londres. Intenta pedir un latte.",
      sender: 'ai',
      isTranslationVisible: false
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentGoal, setCurrentGoal] = useState('Order a latte');
  
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleTranslation = (id: string) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, isTranslationVisible: !m.isTranslationVisible } : m
    ));
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMsgText = inputText.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMsgText,
      translation: '', // No translation needed for user msg
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Llamada al servicio de IA
      const response: LessonResponse = await AITutorService.getLessonResponse(
        [...messages, userMessage],
        `Scenario: Coffee Shop. Current Goal: ${currentGoal}`
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        translation: response.translation,
        sender: 'ai',
        feedbackType: response.feedbackType,
        isTranslationVisible: false
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (response.nextGoal) {
        setCurrentGoal(response.nextGoal);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.goalBadge}>
          <Text style={styles.goalLabel}>OBJETIVO</Text>
          <Text style={styles.goalText}>{currentGoal}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.sender === 'user' ? styles.userRow : styles.aiRow,
              ]}
            >
              {msg.sender === 'ai' && (
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>🦝</Text>
                </View>
              )}
              <TouchableOpacity
                activeOpacity={msg.sender === 'ai' ? 0.8 : 1}
                onPress={() => msg.sender === 'ai' && toggleTranslation(msg.id)}
                style={[
                  styles.bubble,
                  msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
                  msg.sender === 'ai' && styles.cardShadow,
                  msg.feedbackType === 'success' && styles.successBorder,
                  msg.feedbackType === 'correction' && styles.correctionBorder,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userText : styles.aiText,
                  ]}
                >
                  {msg.isTranslationVisible ? msg.translation : msg.text}
                </Text>
                {msg.sender === 'ai' && (
                  <View style={styles.translationHint}>
                    <Ionicons 
                      name={msg.isTranslationVisible ? "eye-off-outline" : "language-outline"} 
                      size={12} 
                      color="#a4b0be" 
                    />
                    <Text style={styles.hintText}>
                      {msg.isTranslationVisible ? " Ver original" : " Ver traducción"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
          {isLoading && (
            <View style={styles.aiRow}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>🦝</Text>
              </View>
              <View style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}>
                <Text style={styles.loadingText}>Escribiendo...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Responde en inglés..."
            placeholderTextColor="#a4b0be"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={200}
            disabled={isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === '' || isLoading ? styles.sendButtonDisabled : styles.sendButtonActive,
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === '' || isLoading}
          >
            <Ionicons
              name="send"
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AIScenario;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  goalBadge: {
    backgroundColor: '#EEF1FF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D9FF',
  },
  goalLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#575fcf',
    marginBottom: 2,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
  },
  container: {
    flex: 1,
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  aiRow: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  avatarText: {
    fontSize: 20,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  userBubble: {
    backgroundColor: '#575fcf',
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 2,
  },
  successBorder: {
    borderColor: '#05c46b',
  },
  correctionBorder: {
    borderColor: '#ff4757',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFF',
    fontWeight: '600',
  },
  aiText: {
    color: '#2d3436',
    fontWeight: '500',
  },
  translationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    opacity: 0.6,
  },
  hintText: {
    fontSize: 10,
    color: '#a4b0be',
    fontWeight: '700',
  },
  loadingBubble: {
    opacity: 0.7,
  },
  loadingText: {
    color: '#a4b0be',
    fontStyle: 'italic',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F2F6',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 120,
    color: '#2d3436',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonActive: {
    backgroundColor: '#575fcf',
  },
  sendButtonDisabled: {
    backgroundColor: '#a4b0be',
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
});
