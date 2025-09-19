import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
  Button,
  FlatList,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Search,
  Filter,
  Play,
  Star,
  Clock,
  Eye,
  Heart,
  Share,
  Bookmark,
  ArrowLeft
} from 'lucide-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { chatWithOpenAI, getApiKey, storeApiKey } from '../openaiService';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [freeContent, setFreeContent] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const router = useNavigation();

  const platforms = [
    { name: 'Netflix', color: '#E50914', icon: 'netflix', lib: 'MaterialCommunityIcons' },
    { name: 'YouTube', color: '#FF0000', icon: 'youtube', lib: 'FontAwesome' },
    { name: 'JioHotstar', color: '#1E40AF', icon: 'movie-play', lib: 'MaterialCommunityIcons' },
    { name: 'SonyLIV', color: '#FF6B35', icon: 'television-classic', lib: 'MaterialCommunityIcons' },
    { name: 'Amazon', color: '#FF9900', icon: 'amazon', lib: 'FontAwesome' },
    { name: 'Spotify', color: '#1DB954', icon: 'spotify', lib: 'FontAwesome' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://api-s2onatgxwq-uc.a.run.app/api/free-streams`);
        setFreeContent(res.data);
      } catch (error) {
        console.error("Error fetching free streams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (freeContent.length > 0) {
      const uniqueGenres = [...new Set(
        freeContent.map(item => item.genre?.charAt(0).toUpperCase() + item.genre?.slice(1))
      )];
      setCategories(['All', ...uniqueGenres]);
    }
  }, [freeContent]);

  const filteredContent = freeContent.filter(item => {
    const matchesCategory = selectedCategory === 'All' ||
      item.genre?.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, -1));

    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const loadKey = async () => {
      const storedKey = await getApiKey();
      if (storedKey) setApiKey(storedKey);
    };
    loadKey();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || !apiKey) return;

    const userMessage = { role: 'user', content: inputText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await chatWithOpenAI(updatedMessages, apiKey);
      setMessages([...updatedMessages, aiResponse]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: 'Error fetching AI response.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPress = (text) => {
    setInputText(text);
    setShowChatModal(true);
    handleSend(); // immediately send to AI
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
        </View>
        {/* Search Bar */}
        {/* <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies, shows, platforms..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View> */}

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Free Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Free to Watch</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#8B5CF6" />
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {filteredContent.slice(0, 4).map((item) => (
                <TouchableOpacity
                  onPress={() => {
                    router.navigate('MovieDetails', { item });
                  }}
                  key={item.id}
                  style={styles.contentCard}
                >
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.contentImage}
                  />
                  <View style={styles.contentInfo}>
                    <Text style={styles.contentTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.metaText}>{item.genre}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity onPress={() => router.navigate('FreeOttStream')} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Platform Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Recommendations</Text>
          <View style={styles.platformsGrid}>
            {platforms.map((platform, index) => (
              <TouchableOpacity key={index} style={styles.platformCard}>
                <LinearGradient
                  colors={[platform.color + '20', platform.color + '10']}
                  style={styles.platformGradient}
                >
                  {platform.lib === 'FontAwesome' ? (
                    <FontAwesome
                      name={platform.icon}
                      size={28}
                      color={platform.color}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={platform.icon}
                      size={28}
                      color={platform.color}
                    />
                  )}
                  <Text style={styles.platformName}>{platform.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.suggestButtonsContainer}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          {/* First row */}
          <View style={styles.firstRow}>
            <TouchableOpacity
              style={[styles.suggestButton, styles.buttonMarginHorizontal]}
              onPress={() => handleSuggestionPress("🎬 Suggest Me Movies")}
            >
              <Text style={styles.suggestButtonText}>🎬 Suggest Me Movies</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.suggestButton, styles.buttonMarginHorizontal]}
              onPress={() => handleSuggestionPress("🎬 New Releases")}
            >
              <Text style={styles.suggestButtonText}>🎬 New Releases</Text>
            </TouchableOpacity>
          </View>

          {/* Second row */}
          <TouchableOpacity
            style={[styles.suggestButton, styles.secondRow]}
            onPress={() => handleSuggestionPress("🎬 New Series")}
          >
            <Text style={styles.suggestButtonText}>🎬 New Series</Text>
          </TouchableOpacity>
        </View>


      </ScrollView>

      <Modal visible={showChatModal} animationType="slide">
        <SafeAreaView style={styles.chatSafeArea}>
          {/* Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity
              onPress={() => setShowChatModal(false)}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.chatHeaderTitle}>Movie & Series Suggestions</Text>
          </View>

          {/* KeyboardAvoidingView ensures input stays visible */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80} // adjust for SafeArea & header height
          >
            {/* Scrollable chat */}
            <ScrollView
              contentContainerStyle={styles.messagesList}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.map((item, i) => (
                <View
                  key={i}
                  style={[
                    styles.message,
                    item.role === "user"
                      ? styles.userMessage
                      : styles.aiMessage
                  ]}
                >
                  <Text style={styles.messageText}>{item.content}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.chatInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask for a movie suggestion..."
                placeholderTextColor="#9CA3AF"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSend}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.sendButtonText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  viewAllButton: {
    alignSelf: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  viewAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  trendingCard: {
    width: 160,
    height: 240,
    borderRadius: 12,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  trendingInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  trendingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingRating: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  trendingPlatform: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    marginLeft: 8,
  },
  playButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentInfo: {
    padding: 8,
  },
  contentTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  platformCard: {
    width: '48%',
    marginBottom: 12,
  },
  platformGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  platformName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  platformContent: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  suggestButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  suggestButtonsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: -5, // to balance inner margin
  },
  buttonMarginHorizontal: {
    marginHorizontal: 5,
  },
  secondRow: {
    marginTop: 10,
  },
  chatSafeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff", // white header
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  message: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#8B5CF6",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
  messageText: {
    color: "#000",
    fontSize: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});