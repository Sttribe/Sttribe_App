// firebaseConfig.ts
import auth from '@react-native-firebase/auth';
export { auth };
// Example: listen to user state
export const listenToAuthChanges = (callback: (user: any) => void) => {
    return auth().onAuthStateChanged(callback);
};

// Example: Sign in with email
export const signIn = (email: string, password: string) => {
    return auth().signInWithEmailAndPassword(email, password);
};

// Example: Sign out
export const signOut = () => {
    return auth().signOut();
};
