import type { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
	uid: string;
	email: string;
	username: string;
	isAdmin?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export const userProfileService = {
	// Create a new user profile in Firestore
	async createUserProfile(
		user: User,
		username: string,
	): Promise<{ success: boolean; error?: string }> {
		try {
			const userProfile: UserProfile = {
				uid: user.uid,
				email: user.email || "",
				username,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			await setDoc(doc(db, "users", user.uid), userProfile);
			return { success: true };
		} catch (error) {
			console.error("Error creating user profile:", error);
			return { success: false, error: "Failed to create user profile" };
		}
	},

	// Get a user profile from Firestore
	async getUserProfile(
		uid: string,
	): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
		try {
			const docRef = doc(db, "users", uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const data = docSnap.data() as UserProfile;
				return { success: true, data };
			}

			return { success: false, error: "User profile not found" };
		} catch (error) {
			console.error("Error getting user profile:", error);
			return { success: false, error: "Failed to get user profile" };
		}
	},

	// Update a user profile in Firestore
	async updateUserProfile(
		uid: string,
		updates: Partial<UserProfile>,
	): Promise<{ success: boolean; error?: string }> {
		try {
			const userRef = doc(db, "users", uid);
			await updateDoc(userRef, {
				...updates,
				updatedAt: new Date(),
			});
			return { success: true };
		} catch (error) {
			console.error("Error updating user profile:", error);
			return { success: false, error: "Failed to update user profile" };
		}
	},
};
