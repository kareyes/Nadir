import {
	type AuthError,
	type User,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { writable } from "svelte/store";
import { auth } from "./firebase";
import { type UserProfile, userProfileService } from "./userProfile";

export const user = writable<UserProfile | null>(null);

// Initialize auth state listener
onAuthStateChanged(auth, (currentUser) => {
	console.log("Auth state changed:", currentUser?.uid);
	userProfileService
		.getUserProfile(currentUser?.uid || "")
		.then((profile) => {
			console.log("Fetched user profile:", profile);
			if (profile.success && profile.data) {
				user.set(profile.data);
			} else {
				user.set(null);
			}
		})
		.catch((error) => {
			console.error("Error fetching user profile:", error);
			// If there's an error fetching the profile, just set the user to currentUser
			// This ensures that the user store is always set, even if the profile fetch fails
			user.set(null);
		});
});

export const authService = {
	async signIn(email: string, password: string) {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);
			return { success: true, user: userCredential.user };
		} catch (error) {
			const authError = error as AuthError;
			return { success: false, error: authError.message };
		}
	},

	async signUp(email: string, password: string) {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			return { success: true, user: userCredential.user };
		} catch (error) {
			const authError = error as AuthError;
			return { success: false, error: authError.message };
		}
	},

	async signOut() {
		try {
			await signOut(auth);
			return { success: true };
		} catch (error) {
			const authError = error as AuthError;
			return { success: false, error: authError.message };
		}
	},

	getCurrentUser() {
		return auth.currentUser;
	},
};
