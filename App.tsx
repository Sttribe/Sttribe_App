/**
 * App.tsx
 */

import React, { useEffect } from "react";
import { Alert, Platform, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
// import { NewAppScreen } from "@react-native-new-app-screen";
import AppNavigator from "./app/navigations/AppNavigator";
import messaging, { AuthorizationStatus } from "@react-native-firebase/messaging";
import "@react-native-firebase/auth";
import { storeApiKey } from "./app/openaiService";
import { OPENAI_API_KEY } from "@env";
import SplashScreen from "react-native-splash-screen";

// ✅ Background handler must be outside the component
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log("Message handled in the background!", remoteMessage);
// });

function App() {
  const isDarkMode = useColorScheme() === "dark";
  const API_KEY = OPENAI_API_KEY;

  useEffect(() => {

    if (Platform.OS === 'android') SplashScreen.hide();


    requestUserPermission();
    getFCMToken();
    const unsubscribe = listenForMessages();

    // Save OpenAI API key (if needed)
    storeApiKey(API_KEY)
      .then(() => console.log("API key stored successfully"))
      .catch(err => console.error("Error storing API key", err));

    return unsubscribe; // cleanup listener
  }, []);

  // ✅ ask user permission
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    console.log("Authorization status:", authStatus);

    if (enabled) {
      console.log("Notification permission granted.");
    }
  };

  // ✅ get FCM token
  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log("FCM TOKEN:", token);
      // send token to backend if needed
    } catch (err) {
      console.error("Failed to get FCM token:", err);
    }
  };

  // ✅ foreground & tap events
  const listenForMessages = () => {
    // Foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("FCM foreground message:", remoteMessage);
      Alert.alert(remoteMessage.notification?.title ?? "New Notification");
    });

    // When app opened from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log("App opened from quit state:", remoteMessage);
        }
      });

    // When app opened from background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("App opened from background:", remoteMessage);
    });

    return unsubscribe;
  };

  return (
    <SafeAreaProvider >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* <NewAppScreen templateFileName="App.tsx" safeAreaInsets={safeAreaInsets} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
