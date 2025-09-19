import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ArrowLeft, Send, Plus, Smile, Video, Users } from "lucide-react-native";
import axios from "axios";
import auth from '@react-native-firebase/auth';
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ChatScreen() {
  const router = useNavigation();
  const route = useRoute();
  const { groupId, groupName, memberCount } = route.params;
  const scrollViewRef = useRef();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('group id: ', groupId, groupName, memberCount);

  const groupData = {
    name: "Netflix Squad",
    memberCount: 4,
    platform: "Netflix",
  };

  // 🔹 Get Firebase token
  async function getFirebaseToken() {
    if (auth().currentUser) {
      return await auth().currentUser.getIdToken();
    }
    return null;
  }

  // 🔹 Map backend → frontend
  function mapBackendMessage(msg, currentUserId) {
    return {
      id: msg.id,
      type: msg.messageType,
      content: msg.message,
      sender: msg.user?.name || msg.user?.email || "Unknown",
      senderId: msg.userId,
      timestamp: msg.createdAt,
      avatar: msg.user?.avatar || "https://via.placeholder.com/60",
    };
  }

  // 🔹 Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await getFirebaseToken();
        if (!token) return;

        const res = await axios.get(
          `https://api-s2onatgxwq-uc.a.run.app/api/tribes/${groupId}/chat`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages(
          res.data.map((m) => mapBackendMessage(m, auth.currentUser?.uid))
        );
      } catch (err) {
        console.error("❌ Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [groupId]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const token = await getFirebaseToken();
      if (!token) return;

      const res = await axios.post(
        `https://api-s2onatgxwq-uc.a.run.app/api/tribes/${groupId}/chat`,
        { message, messageType: "text" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        ...prev,
        mapBackendMessage(res.data.message, auth.currentUser?.uid),
      ]);

      setMessage("");
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error("❌ Failed to send message", err);
    }
  };

  // 🔹 Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 🔹 Render messages
  const renderMessage = (msg) => {
    if (msg.type === "system") {
      return (
        <View key={msg.id} style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{msg.content}</Text>
          <Text style={styles.systemMessageTime}>
            {formatTime(msg.timestamp)}
          </Text>
        </View>
      );
    }

    const isOwnMessage = msg.senderId === auth.currentUser?.uid;

    return (
      <View
        key={msg.id}
        style={[
          styles.messageContainer,
          isOwnMessage && styles.ownMessageContainer,
        ]}
      >
        {!isOwnMessage && (
          <Image source={{ uri: msg.avatar }} style={styles.messageAvatar} />
        )}
        <View
          style={[
            styles.messageBubble,
            isOwnMessage && styles.ownMessageBubble,
          ]}
        >
          {!isOwnMessage && (
            <Text style={styles.senderName}>{msg.sender}</Text>
          )}
          <Text
            style={[styles.messageText, isOwnMessage && styles.ownMessageText]}
          >
            {msg.content}
          </Text>
          <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
        </View>
        {isOwnMessage && (
          <Image source={{ uri: msg.avatar }} style={styles.messageAvatar} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // adjust if header/navbar
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{groupName}</Text>
            <View style={styles.headerSubtitle}>
              <Users size={14} color="#6B7280" />
              <Text style={styles.memberCount}>
                {memberCount} members
              </Text>
              {/* <Text style={styles.platform}>• {groupData.platform}</Text> */}
            </View>
          </View>
          {/* <TouchableOpacity>
            <Video size={24} color="#6B7280" />
          </TouchableOpacity> */}
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {loading ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Loading messages...
            </Text>
          ) : (
            messages.map(renderMessage)
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton}>
              <Plus size={20} color="#6B7280" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            {/* <TouchableOpacity style={styles.emojiButton}>
              <Smile size={20} color="#6B7280" />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Send
                size={18}
                color={message.trim() ? "#FFFFFF" : "#9CA3AF"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// keep your styles same as before
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerInfo: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  headerSubtitle: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  memberCount: { fontSize: 12, color: "#6B7280", marginLeft: 4 },
  platform: { fontSize: 12, color: "#6B7280", marginLeft: 4 },
  messagesContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  ownMessageContainer: { flexDirection: "row-reverse" },
  messageAvatar: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 8 },
  messageBubble: {
    maxWidth: "75%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
  },
  ownMessageBubble: { backgroundColor: "#8B5CF6" },
  senderName: { fontSize: 12, fontWeight: "600", color: "#8B5CF6" },
  messageText: { fontSize: 14, color: "#111827", lineHeight: 20 },
  ownMessageText: { color: "#FFFFFF" },
  messageTime: { fontSize: 10, color: "#9CA3AF", marginTop: 4, alignSelf: "flex-end" },
  systemMessage: {
    alignSelf: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    marginHorizontal: 40,
  },
  systemMessageText: { fontSize: 12, color: "#6B7280", textAlign: "center" },
  systemMessageTime: { fontSize: 10, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputRow: { flexDirection: "row", alignItems: "flex-end" },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: "#F3F4F6",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
    marginRight: 8,
  },
  emojiButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: { backgroundColor: "#8B5CF6" },
});
