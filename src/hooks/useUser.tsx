import { supabase } from "@/middlewares/supabase";
import { User } from "@/types/user";
import { useState } from "react";

export default function useUser() {
	const [user, setUser] = useState<User>({} as User);

	const getUserById = async (userId: string) => {
		const { data, error } = await supabase
			.from("users")
			.select("id, name, email, image_profile")
			.eq("id", userId)
			.single();

		if (error) throw error;
		setUser(data);
	};

	return { getUserById, user };
}

