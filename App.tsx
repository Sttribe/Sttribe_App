/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppNavigator from './app/navigations/AppNavigator';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import { useEffect } from 'react';
import { storeApiKey } from './app/openaiService';
import { OPENAI_API_KEY } from '@env';


// const firebaseConfig = {
//   apiKey: "AIzaSyCauLpc-3OCKx3D2wd0_Vo9Ei5dwTMomjA",
//   authDomain: "sttribe-85b3b.firebaseapp.com",
//   projectId: "sttribe-85b3b",
//   storageBucket: "sttribe-85b3b.firebasestorage.app",
//   messagingSenderId: "699272671623",
//   appId: "1:699272671623:web:2dbb0ead59b9aa4bf319a3"
// };
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig); // ✅ Initialize default app
// }

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const API_KEY = OPENAI_API_KEY;

  useEffect(() => {
    // ✅ Store API key once when this layout is mounted
    storeApiKey(API_KEY)
      .then(() => console.log("API key stored successfully"))
      .catch(err => console.error("Error storing API key", err));
  })
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* <AppContent /> */}
      <AppNavigator />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
