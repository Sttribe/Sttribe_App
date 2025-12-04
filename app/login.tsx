import React, { useEffect, useState } from "react";
import { Button, Text, View, Alert, Image, StyleSheet, ActivityIndicator } from "react-native";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export default function LoginScreen() {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "699272670821-e2m6cj4n75e8dc5a3t0ifvgc52hpecpf.apps.googleusercontent.com",
            offlineAccess: true,
            // forceCodeForRefreshToken: true, // Force consent screen
            hostedDomain: '', // Optional
            accountName: '', // Optional
        });
    }, []);

    const handleGoogleLogin = async () => {
        if (loading) return;
        setLoading(true);

        try {
            console.log("🔄 Starting Google login process...");

            // 1️⃣ Ensure Google Play services are available
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            console.log("✅ Play services available");

            // 2️⃣ Start Google Sign-In
            const signInResult = await GoogleSignin.signIn();
            console.log("✅ Google Sign-In successful");

            // 3️⃣ Get ID token from Google
            const idToken = signInResult.data?.idToken;
            if (!idToken) {
                console.error("❌ No ID token received:", signInResult);
                Alert.alert("Login Error", "No ID token received from Google. Please try again.");
                return;
            }

            // 4️⃣ Sign in with Firebase using Google credentials
            console.log("🔄 Signing in with Firebase...");
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const userCredential = await auth().signInWithCredential(googleCredential);
            const user = userCredential.user;

            // 5️⃣ Get Firebase token for backend authorization
            const firebaseToken = await user.getIdToken(true);
            console.log("✅ Firebase token obtained");

            // 6️⃣ Sync with your backend
            try {
                console.log("🔄 Syncing user with backend...");
                await axios.post(
                    "https://api-s2onatgxwq-uc.a.run.app/api/auth/sync",
                    {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${firebaseToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("✅ User synced successfully with backend");
            } catch (syncError: any) {
                console.error("❌ Backend sync failed:", syncError.response?.data || syncError.message);
                Alert.alert("Sync Error", "Failed to sync user with backend.");
            }

            // 7️⃣ Save user to local state or Redux if needed
            setUserInfo(user);


            console.log("✅ Profile complete. Navigating to Tabs...");
            navigation.navigate("Tabs");

        } catch (error: any) {
            console.error("❌ Google login error:", error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert("Login Cancelled", "You cancelled the login process.");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Alert.alert("Login in Progress", "A login operation is already in progress.");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert("Play Services Error", "Google Play Services are not available.");
            } else {
                Alert.alert("Login Error", error.message || "Something went wrong during login.");
            }
        } finally {
            setLoading(false);
        }
    };



    const handleTestNavigation = () => {
        console.log("🧪 Test navigation to Tabs");
        navigation.navigate("Tabs");
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
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#8B5CF6" />
                        <Text style={styles.loadingText}>Signing you in...</Text>
                    </View>
                ) : (
                    <>
                        <GoogleSigninButton
                            style={styles.googleButton}
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={handleGoogleLogin}
                            disabled={loading}
                        />

                        {/* Debug button - remove in production */}
                        {/* <Button title="Test Navigation" onPress={handleTestNavigation} /> */}
                    </>
                )}

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
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        marginBottom: 24,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#6B7280",
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