import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OPENAI_API_KEY } from '@env';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const STORAGE_KEY = 'OPENAI_API_KEY'; // fixed key name

// Store your API key
export const storeApiKey = async (key) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, key);
    } catch (error) {
        console.error('Error storing API key:', error);
    }
};

// Get stored API key
export const getApiKey = async () => {
    try {
        const key = await AsyncStorage.getItem(STORAGE_KEY);
        return key;
    } catch (error) {
        console.error('Error retrieving API key:', error);
        return null;
    }
};

// Chat with OpenAI
export const chatWithOpenAI = async (messages, apiKey) => {
    try {
        const response = await axios.post(
            API_URL,
            {
                model: "gpt-3.5-turbo",
                messages,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );
        return response.data.choices[0].message;
    } catch (error) {
        console.error('OpenAI API error:', error.response?.data || error.message);
        throw error;
    }
};
