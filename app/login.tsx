import React, { useEffect, useState } from "react";
import { Button, Text, View, Alert } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
    const [userInfo, setUserInfo] = useState<any>(null);
    const navigation = useNavigation();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "699272670821-e2m6cj4n75e8dc5a3t0ifvgc52hpecpf.apps.googleusercontent.com",
            offlineAccess: true,
        });
    }, []);

    const handleGoogleLogin = async () => {
        try {
            // Check if Play Services are available
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Sign in with Google
            const signInResult = await GoogleSignin.signIn();

            // CORRECTED: Access idToken from the data property
            const idToken = signInResult.data?.idToken;

            if (!idToken) {
                console.error("❌ No ID token received. Full response:", signInResult);
                Alert.alert("Login Error", "No ID token received from Google. Please check your configuration.");
                return;
            }

            console.log("idToken: ", idToken);

            // Create a Firebase credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign in with credential
            const userCredential = await auth().signInWithCredential(googleCredential);

            const user = userCredential.user;
            const token = await user.getIdToken();

            console.log("✅ Firebase User:", user);
            console.log("🔥 Firebase Token:", token);

            setUserInfo(user);

            // navigate to tabs/home after login
            navigation.reset({
                index: 0,
                routes: [{ name: "Tabs" }],
            });
        } catch (error: any) {
            console.error("Google login error", error);

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert("Login Cancelled", "You cancelled the login process.");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Alert.alert("Login in Progress", "A login operation is already in progress.");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert("Play Services Not Available", "Google Play Services are not available.");
            } else {
                Alert.alert("Login Error", "An unknown error occurred during login.");
            }
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button title="Login with Google" onPress={handleGoogleLogin} />

            {userInfo && (
                <View style={{ marginTop: 20 }}>
                    <Text>Welcome {userInfo.displayName}</Text>
                    <Text>Email: {userInfo.email}</Text>
                </View>
            )}
        </View>
    );
}