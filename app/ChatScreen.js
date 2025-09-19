import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { chatWithOpenAI, storeApiKey, getApiKey } from './openaiService';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Load API key on startup
        const loadApiKey = async () => {
            const storedKey = await getApiKey();
            if (storedKey) {
                setApiKey(storedKey);
            }
        };
        loadApiKey();
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
        } catch (error) {
            console.error('Error:', error);
            setMessages([...updatedMessages, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please check your API key and try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApiKeySubmit = async () => {
        await storeApiKey(apiKey);
        alert('API key saved securely!');
    };

    return (
        <View style={styles.container}>
            {!apiKey ? (
                <View style={styles.apiKeyContainer}>
                    <Text>Enter your OpenAI API key:</Text>
                    <TextInput
                        style={styles.input}
                        value={apiKey}
                        onChangeText={setApiKey}
                        placeholder="sk-...your API key"
                        secureTextEntry
                    />
                    <Button title="Save API Key" onPress={handleApiKeySubmit} />
                </View>
            ) : (
                <>
                    <FlatList
                        data={messages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={[
                                styles.message,
                                item.role === 'user' ? styles.userMessage : styles.aiMessage
                            ]}>
                                <Text>{item.content}</Text>
                            </View>
                        )}
                        style={styles.chatContainer}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type your message..."
                            editable={!isLoading}
                        />
                        <Button
                            title="Send"
                            onPress={handleSend}
                            disabled={isLoading || !inputText.trim()}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    apiKeyContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    chatContainer: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginRight: 8,
    },
    message: {
        padding: 12,
        borderRadius: 8,
        marginVertical: 4,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
    },
});

export default ChatScreen;