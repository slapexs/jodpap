import { supabase } from "@/middlewares/supabase";
import { AuthContextType } from "@/types/auth";
import { User } from "@/types/user";
import { getUserProfile } from "@/utils/user";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
	user: null,
	signIn: async () => {},
	signOut: async () => {},
	signUp: async () => {},
	isAuthenticated: false,
	isLoading: false,
	getUserSession: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const getUserSession = async () => {
		const { data, error } = await supabase.auth.getSession();

		if (error) throw error;

		if (data.session) {
			const userProfile = await getUserProfile(data.session.user.id);
			setUser(userProfile);
			setIsAuthenticated(true);
		} else {
			setUser(null);
			setIsAuthenticated(false);
		}
	};

	useEffect(() => {
		getUserSession().finally(() => {
			setIsLoading(false);
		});
	}, []);

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;
		const userProfile = await getUserProfile(data.session.user.id);
		setUser(userProfile);
		setIsAuthenticated(true);
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setIsAuthenticated(false);
		localStorage.clear();
	};

	const signUp = async (email: string, password: string, name: string) => {
		const { data, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: window.location.origin + "/login",
			},
		});
		if (signUpError) throw signUpError;

		const { error: insertError } = await supabase.from("users").insert({ id: data.user?.id, email, name });
		if (insertError) throw insertError;
	};

	return (
		<AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated, isLoading, signUp, getUserSession }}>
			{children}
		</AuthContext.Provider>
	);
};

