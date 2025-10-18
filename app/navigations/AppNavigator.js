import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Home, Users, Search, CreditCard, User, Wallet } from "lucide-react-native";
import { OPENAI_API_KEY } from "@env";

// screens
import AuthScreen from "../AuthScreen";
import Login from "../login";
import ChatScreen from "../chat";
import CreateGroup from "../create-group";
import EditProfile from "../edit-profile";
import GroupDetails from "../group-details";
import Help from "../help";
import MovieDetails from "../movie-details";
import Notifications from "../notifications";
import PaymentGateway from "../payment-gateway";
import PaymentMethods from "../payment-methods";
import Privacy from "../privacy";
import SubscriptionPurchase from "../subscription-purchase";
import Transactions from "../transactions";

// tab screens
import HomeScreen from "../(tabs)/index.tsx";
import Discover from "../(tabs)/discover.tsx";
import Groups from "../(tabs)/groups.tsx";
import Profile from "../(tabs)/profile.tsx";
import Recharge from "../(tabs)/recharge.tsx";
import WalletScreen from "../(tabs)/wallet.tsx";
import auth from "@react-native-firebase/auth";
import FreeOttStream from "../FreeOttStream.tsx";
import PrivacyPolicyScreen from "../PrivacyPolicy.tsx";
import RefundPolicyScreen from "../RefundPolicy.tsx";
import TermsConditionsScreen from "../TermsConditions.tsx";
import FAQScreen from "../FAQs.tsx";
import OnboardingScreen from "../OnboardingScreen.jsx";
import { checkFirstLaunch, setFirstLaunchCompleted } from "./firstLaunch.js";
import { storeApiKey } from "../openaiService.ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabsNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#8B5CF6",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 15),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Inter-Medium",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Groups"
        component={Groups}
        options={{
          title: "Groups",
          tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          title: "Discover",
          tabBarIcon: ({ size, color }) => <Search size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: "Wallet",
          tabBarIcon: ({ size, color }) => <Wallet size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Add this helper function to properly handle auth state
const useAuthState = () => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    loading: true,
    isFirstLaunch: null
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check first launch
        const isFirst = await checkFirstLaunch();

        // Set up auth listener
        const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
          if (currentUser) {
            try {
              const idToken = await currentUser.getIdToken();
              console.log("Firebase Token:", idToken);
              setAuthState({
                user: currentUser,
                token: idToken,
                loading: false,
                isFirstLaunch: isFirst
              });
            } catch (err) {
              console.error("Error getting Firebase token", err);
              setAuthState(prev => ({
                ...prev,
                loading: false,
                isFirstLaunch: isFirst
              }));
            }
          } else {
            setAuthState({
              user: null,
              token: null,
              loading: false,
              isFirstLaunch: isFirst
            });
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          token: null,
          loading: false,
          isFirstLaunch: true
        });
      }
    };

    initializeAuth();
  }, []);

  return authState;
};

export default function AppNavigator() {
  const { user, token, loading, isFirstLaunch } = useAuthState();
  const API_KEY = OPENAI_API_KEY;

  useEffect(() => {
    // Save OpenAI API key
    if (API_KEY) {
      storeApiKey(API_KEY)
        .then(() => console.log("API key stored successfully"))
        .catch(err => console.error("Error storing API key", err));
    }
  }, [API_KEY]);

  const handleOnboardingComplete = async () => {
    await setFirstLaunchCompleted();
  };

  // Show nothing while loading
  if (loading || isFirstLaunch === null) {
    return null;
  }

  // Determine the initial route based on the complete auth state
  let initialRoute = "Login";

  if (isFirstLaunch) {
    initialRoute = "Onboarding";
  } else if (user && token) {
    initialRoute = "Tabs";
  }

  console.log("Auth State:", {
    hasUser: !!user,
    hasToken: !!token,
    isFirstLaunch,
    initialRoute
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen {...props} onComplete={handleOnboardingComplete} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Login" component={Login} />
        {/* main tabs */}
        <Stack.Screen name="Tabs" component={TabsNavigator} />
        {/* extra stack screens */}
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="GroupDetails" component={GroupDetails} />
        <Stack.Screen name="Help" component={Help} />
        <Stack.Screen name="MovieDetails" component={MovieDetails} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="PaymentGateway" component={PaymentGateway} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="SubscriptionPurchase" component={SubscriptionPurchase} />
        <Stack.Screen name="Transactions" component={Transactions} />
        <Stack.Screen name="FreeOttStream" component={FreeOttStream} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="RefundPolicy" component={RefundPolicyScreen} />
        <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
        <Stack.Screen name="FAQs" component={FAQScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}