import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Constants from 'expo-constants';
import { GiftedChat } from 'react-native-gifted-chat';

const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY || Constants.manifest?.extra?.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export default function App() {
  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: 'Hi, I am Gemini! Ask me anything!',
      createdAt: new Date(),
      user: { _id: 2, name: 'Gemini' }
    }
  ]);
  const [loading, setLoading] = useState(false);

  const onSend = useCallback(async (newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    const userMessage = newMessages[0].text;

    setLoading(true);
    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      });
      const data = await res.json();
      const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no answer!';
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [
          {
            _id: Math.random().toString(36).substring(7),
            text: geminiText,
            createdAt: new Date(),
            user: { _id: 2, name: 'Gemini' }
          }
        ])
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch response from Gemini.');
    }
    setLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        placeholder="Type your message..."
        renderLoading={() => loading && <ActivityIndicator size="large" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }
});
