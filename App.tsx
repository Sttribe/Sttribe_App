/**
 * App.tsx
 */

import React, { useEffect, useRef } from "react";
import { Alert, Platform, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
// import { NewAppScreen } from "@react-native-new-app-screen";
import AppNavigator from "./app/navigations/AppNavigator";
import messaging, { AuthorizationStatus } from "@react-native-firebase/messaging";
import "@react-native-firebase/auth";
import analytics from '@react-native-firebase/analytics';
import { storeApiKey } from "./app/openaiService";
import { OPENAI_API_KEY } from "@env";
import SplashScreen from "react-native-splash-screen";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";

// ✅ Background handler must be outside the component
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log("Message handled in the background!", remoteMessage);
// });

function App() {
  const isDarkMode = useColorScheme() === "dark";
  const API_KEY = OPENAI_API_KEY;
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {

    if (Platform.OS === 'android') SplashScreen.hide();

    const logEvent = async () => {
      await analytics().logEvent('app_open', {
        screen: 'Home',
        purpose: 'Test event',
      });
    };
    logEvent();

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
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

          if (previousRouteName !== currentRouteName && currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }

          routeNameRef.current = currentRouteName;
        }}
      >
        <AppNavigator />
      </NavigationContainer>
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
