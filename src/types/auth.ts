import { User } from "@/types/user";

export interface AuthContextType {
	user: User | null;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, name: string) => Promise<void>;
	signOut: () => Promise<void>;
	isAuthenticated: boolean;
	isLoading: boolean;
	getUserSession: () => void;
}

