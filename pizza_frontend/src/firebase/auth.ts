import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";

// Function to create a user with email and password
export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Function to sign in a user with email and password
export const doSignInWithEmailAndPassword = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Function to sign in a user with Google
export const doSignInWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Add user to Firestore (implementation required here)
};

// Function to sign out the current user
export const doSignOut = (): Promise<void> => {
  return auth.signOut();
};

// Function to send a password reset email
export const doPasswordReset = (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

// Function to change the password of the current user
export const doPasswordChange = (password: string): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user found.");
  }
  return updatePassword(auth.currentUser, password);
};

// Function to send an email verification to the current user
export const doSendEmailVerification = (): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user found.");
  }
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
