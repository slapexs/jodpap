import { supabase } from "@/middlewares/supabase";

export const login = async (email: string, password: string) => {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });

	if (error) throw error;
};

