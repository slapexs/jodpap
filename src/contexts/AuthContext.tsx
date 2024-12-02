import { supabase } from "@/middlewares/supabase";
import { AuthContextType } from "@/types/auth";
import { User } from "@/types/user";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
	user: null,
	signIn: async () => {},
	signOut: async () => {},
	isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const userData = localStorage.getItem("userData");
		if (userData) {
			setUser(JSON.parse(userData));
			setIsAuthenticated(true);
		} else {
			setUser(null);
			setIsAuthenticated(false);
		}
	}, []);

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;

		const userData = { id: data.user.id, email: data.user.email! };
		localStorage.setItem("userData", JSON.stringify(userData));
		setUser(userData);
		setIsAuthenticated(true);
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setIsAuthenticated(false);
	};

	// TODO
	const signUp = async (userData: User) => {};

	const fetchUserDetails = async (userId: string): Promise<User> => {
		const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

		if (error) throw error;

		return {
			id: data.id,
			email: data.email,
		};
	};

	return <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated }}>{children}</AuthContext.Provider>;
};

