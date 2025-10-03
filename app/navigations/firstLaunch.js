// utils/firstLaunch.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_LAUNCH_KEY = '@first_launch';

export const checkFirstLaunch = async () => {
  try {
    const value = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
    return value === null; // Returns true if first launch
  } catch (error) {
    console.error('Error checking first launch:', error);
    return true; // Default to showing onboarding if error
  }
};

export const setFirstLaunchCompleted = async () => {
  try {
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
  } catch (error) {
    console.error('Error setting first launch:', error);
  }
};