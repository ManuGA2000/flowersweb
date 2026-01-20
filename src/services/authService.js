// Auth Service - Uses native Firebase SDK
// Requires google-services.json in android/app/
// src\services\authService.js
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Sign Up with Email
export const signUp = async (email, password, name, phone) => {
  try {
    const result = await auth().createUserWithEmailAndPassword(email, password);
    
    // Update profile name
    await result.user.updateProfile({ displayName: name });
    
    // Save user data to Firestore
    await firestore().collection('users').doc(result.user.uid).set({
      uid: result.user.uid,
      email: email,
      name: name,
      phone: phone || '',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Sign In with Email
export const signIn = async (email, password) => {
  try {
    const result = await auth().signInWithEmailAndPassword(email, password);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Sign Out
export const signOut = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Reset Password
export const resetPassword = async (email) => {
  try {
    await auth().sendPasswordResetEmail(email);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Get Current User
export const getCurrentUser = () => auth().currentUser;

// Auth State Listener
export const onAuthStateChanged = (callback) => auth().onAuthStateChanged(callback);

// Get User Profile from Firestore
export const getUserProfile = async (uid) => {
  try {
    const doc = await firestore().collection('users').doc(uid).get();
    if (doc.exists) {
      return { success: true, data: doc.data() };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update User Profile
export const updateUserProfile = async (uid, data) => {
  try {
    await firestore().collection('users').doc(uid).update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Error Messages
const getErrorMessage = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
};