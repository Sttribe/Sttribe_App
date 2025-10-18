// import { useEffect, useState } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Home, Users, Search, CreditCard, User, Edit, Wallet } from 'lucide-react-native';
// import { storeApiKey } from '../openaiService'; // make sure path is correct
// import auth from "@react-native-firebase/auth";
// import { NavigationContainer } from '@react-navigation/native';
// import LoginScreen from '../login';

// export default function TabLayout() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState<string | null>(null);
//   const Tab = createBottomTabNavigator();
//   // const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

//   useEffect(() => {
//     // ✅ Store API key once when this layout is mounted
//     storeApiKey(API_KEY)
//       .then(() => console.log("API key stored successfully"))
//       .catch(err => console.error("Error storing API key", err));

//     const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         const idToken = await currentUser.getIdToken(); // works same
//         setToken(idToken);
//         console.log("Firebase Token:", idToken);
//       } else {
//         setUser(null);
//         setToken(null);
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   if (loading) return null; // or show splash

//   // ✅ If no token/user, redirect to auth page
//   if (!token) {
//     return <LoginScreen />; // or use navigation.reset(...)
//   }

//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={{
//           headerShown: false,
//           tabBarActiveTintColor: '#8B5CF6',
//           tabBarInactiveTintColor: '#9CA3AF',
//           tabBarStyle: {
//             backgroundColor: '#FFFFFF',
//             borderTopWidth: 1,
//             borderTopColor: '#E5E7EB',
//             paddingBottom: 8,
//             paddingTop: 8,
//             height: 70,
//           },
//           tabBarLabelStyle: {
//             fontSize: 12,
//             fontFamily: 'Inter-Medium',
//             marginTop: 4,
//           },
//           tabBarIconStyle: {
//             marginTop: 4,
//           },
//         }}
//       >
//         <Tab.Screen
//           name="index"
//           options={{
//             title: 'Home',
//             tabBarIcon: ({ size, color }) => (
//               <Home size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="groups"
//           options={{
//             title: 'Groups',
//             tabBarIcon: ({ size, color }) => (
//               <Users size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="discover"
//           options={{
//             title: 'Discover',
//             tabBarIcon: ({ size, color }) => (
//               <Search size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="recharge"
//           options={{
//             title: 'Recharge',
//             href: null, // 🚀 hides from tab bar
//             tabBarIcon: ({ size, color }) => (
//               <CreditCard size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="wallet"
//           options={{
//             title: 'wallet',
//             tabBarIcon: ({ size, color }) => (
//               <Wallet size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="profile"
//           options={{
//             title: 'Profile',
//             tabBarIcon: ({ size, color }) => (
//               <User size={size} color={color} />
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }
