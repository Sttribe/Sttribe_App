import React, { useEffect, useState } from "react";
import { Button, Text, View, Alert, Image, StyleSheet } from "react-native";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        <SafeAreaView style={styles.container}>
            {/* App Logo / Illustration */}
            <View style={styles.header}>
                <Image
                    source={{
                        uri: "https://www.sttribe.com/assets/2543_090525_Sttribe_HP-PNG-01-Bkds-OOd.png",
                    }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Welcome to Sttribe</Text>
                <Text style={styles.subtitle}>
                    Save money by sharing OTT subscriptions with your friends and family - simple,
                    secure, and hassle-free.
                </Text>
            </View>

            {/* Login options */}
            <View style={styles.content}>
                <GoogleSigninButton
                    style={styles.googleButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={handleGoogleLogin}
                />

                <Text style={styles.footerText}>
                    By continuing, you agree to our{" "}
                    <Text style={styles.link}>Terms of Service</Text> and{" "}
                    <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFF",
        justifyContent: "space-evenly",
    },
    header: {
        alignItems: "center",
        marginTop: 80,
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 20,
    },
    content: {
        alignItems: "center",
        marginBottom: 60,
        paddingHorizontal: 20,
    },
    googleButton: {
        width: 230,
        height: 50,
        marginBottom: 24,
    },
    footerText: {
        fontSize: 12,
        color: "#9CA3AF",
        textAlign: "center",
        lineHeight: 18,
    },
    link: {
        color: "#6D28D9",
        fontWeight: "500",
    },
});