import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Lock,
  User,
  MessageSquare
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export default function AuthScreen() {
  const router = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });


  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '699272670821-e2m6cj4n75e8dc5a3t0ifvgc52hpecpf.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  // const [request, response, promptAsync] = GoogleSignin.useAuthRequest({
  //   expoClientId: 'YOUR_EXPO_CLIENT_ID_HERE',
  //   iosClientId: 'YOUR_IOS_CLIENT_ID',
  //   androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  //   webClientId: '1:699272670821:web:dc7f20a1f33fce09fa208c', // from Firebase
  // });

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { id_token } = response.authentication;
  //     const credential = GoogleAuthProvider.credential(id_token);
  //     signInWithCredential(auth, credential)
  //       .then(async (userCredential) => {
  //         const token = await userCredential.user.getIdToken();
  //         console.log('Firebase Token:', token);
  //         Alert.alert('Success', 'Google Sign-In successful!', [
  //           { text: 'OK', onPress: () => router.replace('/(tabs)') }
  //         ]);
  //       })
  //       .catch((error) => {
  //         console.log('Firebase Auth Error:', error.message);
  //         Alert.alert('Error', error.message);
  //       });
  //   }
  // }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);

      console.log('User Info:', userCredential.user);
      Alert.alert('Success', 'Google Sign-In successful!', [
        { text: 'OK', onPress: () => router.navigate('TabsScreen') }
      ]);
    } catch (error) {
      console.log('Google Sign-In Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleSubmit = async () => {
    const { name, email, phone, password, confirmPassword } = formData;

    if (isLogin) {
      // Login flow
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const idToken = await userCredential.user.getIdToken();
        console.log('ID Token:', idToken); // <-- Use this for authenticated API calls
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => router.navigate('TabsScreen') }
        ]);
      } catch (error) {
        Alert.alert('Login Failed', error.message);
      }

    } else {
      // Signup flow
      if (!name || !email || !phone || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      try {
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const idToken = await userCredential.user.getIdToken();
        console.log('ID Token:', idToken); // <-- Use this later to call backend
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.navigate('TabsScreen') }
        ]);
      } catch (error) {
        Alert.alert('Signup Failed', error.message);
      }
    }
  };


  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity> */}
          <Text style={styles.headerTitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.heroGradient}
          >
            <Text style={styles.heroTitle}>
              {isLogin ? 'Sign In' : 'Join Us'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {isLogin
                ? 'Access your groups and start saving on OTT subscriptions'
                : 'Start sharing OTT subscriptions and save money with friends'
              }
            </Text>
          </LinearGradient>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <User size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Phone size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChangeText={(value) => updateFormData('phone', value)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <LinearGradient
              colors={['#8B5CF6', '#A78BFA']}
              style={styles.submitButtonGradient}
            >
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Alternative Actions */}
          <View style={styles.alternativeSection}>
            <Text style={styles.alternativeText}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.alternativeLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Options */}
          <View style={styles.socialSection}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <MessageSquare size={20} color="#25D366" />
                <Text style={styles.socialButtonText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms */}
          {!isLogin && (
            <View style={styles.termsSection}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


