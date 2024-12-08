import { supabase } from "@/middlewares/supabase";

export const getUserProfile = async (id: string) => {
	const { data, error } = await supabase.from("users").select("id,email,name,image_profile").eq("id", id);
	if (error) throw error;

	localStorage.setItem("userProfile", JSON.stringify(data[0]));
	return data[0];
};

