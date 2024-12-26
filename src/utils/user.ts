import { supabase } from "@/middlewares/supabase";
import { v4 as uuidV4 } from "uuid";

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
	const { error } = await supabase
		.from("user_friends")
		.delete()
		.or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);
	if (error) throw error;
};

export const uploadImageProfile = async (file: File) => {
	const fileName = uuidV4();
	const { error } = await supabase.storage
		.from("user_image_profile")
		.upload(fileName, file, { contentType: file.type });
	if (error) throw error;

	const { data } = await supabase.storage.from("user_image_profile").getPublicUrl(fileName);
	return data.publicUrl;
};

