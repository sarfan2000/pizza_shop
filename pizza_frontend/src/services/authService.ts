import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

interface AuthResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class AuthService {
  public static async signup(email: string, password: string): Promise<AuthResponse> {

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, data: userCredential.user };
    } catch (error: any) {
      console.error("Signup Error:", error.message);
      return { success: false, error: error.message };
    }
  }
  public static async login(email: string, password: string): Promise<AuthResponse> {

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, data: userCredential.user };
    } catch (error: any) {
      console.error("Login Error:", error.message);
      return { success: false, error: error.message };
    }
  }
}