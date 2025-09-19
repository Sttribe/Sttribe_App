// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// // import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
// import {
//   signInWithPhoneNumber,
//   PhoneAuthProvider,
//   signInWithCredential,
// } from "firebase/auth";
// import { auth, firebaseConfig } from "../firebaseConfig";
// import { useRouter } from "expo-router";

// export default function AuthScreen() {
//   const recaptchaVerifier = useRef(null);
//   const router = useRouter();

//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [verificationId, setVerificationId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Ensure +91 prefix if missing
//   const formatPhoneNumber = (number) => {
//     let formatted = number.trim();
//     if (!formatted.startsWith("+")) {
//       formatted = "+91" + formatted; // default Indias
//     }
//     return formatted;
//   };

//   const sendOtp = async () => {
//     if (!phoneNumber) {
//       Alert.alert("Error", "Please enter a phone number");
//       return;
//     }
//     try {
//       setLoading(true);
//       const formattedNumber = formatPhoneNumber(phoneNumber);
//       const confirmation = await signInWithPhoneNumber(
//         auth,
//         formattedNumber,
//         recaptchaVerifier.current
//       );
//       setVerificationId(confirmation.verificationId);
//       Alert.alert("Success", `OTP sent to ${formattedNumber}`);
//     } catch (err) {
//       Alert.alert("Error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmOtp = async () => {
//     if (!verificationId || !otp) {
//       Alert.alert("Error", "Please enter the OTP");
//       return;
//     }
//     try {
//       setLoading(true);
//       const credential = PhoneAuthProvider.credential(verificationId, otp);
//       const userCredential = await signInWithCredential(auth, credential);
//       const token = await userCredential.user.getIdToken();
//       console.log("Firebase Token:", token);
//       router.replace("/(tabs)");
//     } catch (err) {
//       Alert.alert("Error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         {/* <FirebaseRecaptchaVerifierModal
//           ref={recaptchaVerifier}
//           firebaseConfig={firebaseConfig}
//         /> */}

//         <Text style={styles.title}>Phone Login</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Enter phone number"
//           keyboardType="phone-pad"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//         />

//         {verificationId && (
//           <TextInput
//             style={styles.input}
//             placeholder="Enter OTP"
//             keyboardType="number-pad"
//             value={otp}
//             onChangeText={setOtp}
//           />
//         )}

//         <TouchableOpacity
//           style={styles.button}
//           onPress={verificationId ? confirmOtp : sendOtp}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {verificationId ? "Verify OTP" : "Send OTP"}
//           </Text>
//         </TouchableOpacity>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     marginVertical: 8,
//   },
//   button: {
//     backgroundColor: "#8B5CF6",
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
// });