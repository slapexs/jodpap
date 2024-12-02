import { User } from "@/types/user";

export interface AuthContextType {
	user: User | null;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	isAuthenticated: boolean;
}

