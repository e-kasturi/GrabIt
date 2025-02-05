import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { baseUrl } from "../configs/baseUrl";

const GeminiScreen = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const newMessage = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, newMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil respon dari server");
      }

      const data = await response.json();
      const botMessage = { sender: "gemini", text: data.text || "Maaf, saya tidak mengerti." };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "gemini", text: "Terjadi kesalahan, coba lagi." }]);
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gemini Chat</Text>
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.messageBubble, msg.sender === "user" ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      {isLoading && <ActivityIndicator size="large" color="#FF69B4" style={{ marginBottom: 10 }} />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Ketik pesan..."
          placeholderTextColor="#B39DDB"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GeminiScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF0F5" }, // Latar belakang putih-pink
  title: { fontSize: 22, fontWeight: "bold", color: "#BA68C8", textAlign: "center", marginBottom: 10 }, // Ungu
  chatContainer: { flex: 1, marginBottom: 10 },
  messageBubble: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: "80%" },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#FF69B4", padding: 10, borderRadius: 10 }, // Pink cerah
  botMessage: { alignSelf: "flex-start", backgroundColor: "#D1C4E9", padding: 10, borderRadius: 10 }, // Ungu pastel
  messageText: { fontSize: 16, color: "black" },
  inputContainer: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: "#B39DDB", paddingVertical: 5 }, // Ungu pastel
  input: { flex: 1, padding: 10, fontSize: 16, borderWidth: 1, borderColor: "#BA68C8", borderRadius: 10, marginRight: 10, color: "#4A148C" }, // Ungu gelap
  sendButton: { backgroundColor: "#FF69B4", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 }, // Pink cerah
  sendButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
