import { supabase } from "@/middlewares/supabase";
import { AuthContextType } from "@/types/auth";
import { User } from "@/types/user";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
	user: null,
	signIn: async () => {},
	signOut: async () => {},
	signUp: async () => {},
	isAuthenticated: false,
	isLoading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getUserSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (data.session) {
				setUser({ id: data.session.user.id, email: data.session.user.email! });
				setIsAuthenticated(true);
			} else {
				setUser(null);
				setIsAuthenticated(false);
			}
		};

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

		const userData = { id: data.user.id, email: data.user.email! };
		setUser(userData);
		setIsAuthenticated(true);
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setIsAuthenticated(false);
	};

	// TODO
	const signUp = async (email: string, password: string, name: string) => {
		const { data, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: window.location.origin + "/login",
			},
		});
		if (signUpError) throw signUpError;

		const { data: insertData, error: insertError } = await supabase
			.from("users")
			.insert({ id: data.user?.id, email, name });
		if (insertError) throw insertError;
	};

	const fetchUserDetails = async (userId: string): Promise<User> => {
		const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

		if (error) throw error;

		return {
			id: data.id,
			email: data.email,
		};
	};

	return (
		<AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated, isLoading, signUp }}>
			{children}
		</AuthContext.Provider>
	);
};

