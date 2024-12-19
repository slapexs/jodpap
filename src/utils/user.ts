import { supabase } from "@/middlewares/supabase";

export const getUserProfile = async (id: string) => {
	const { data, error } = await supabase.from("users").select("id,email,name,image_profile").eq("id", id);
	if (error) throw error;

	localStorage.setItem("userProfile", JSON.stringify(data[0]));
	return data[0];
};

export const addFriend = async (userId: string, friendId: string) => {
	const { error } = await supabase
		.from("friends")
		.insert([
			{
				user_id: userId,
				friend_id: friendId,
			},
		])
		.select();
	if (error) throw error;
};

export const deleteFriend = async (friendId: string) => {
	const { error } = await supabase.from("friends").delete().eq("id", friendId);
	if (error) throw error;
};

