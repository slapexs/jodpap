import { supabase } from "@/middlewares/supabase";
import { v4 as uuidV4 } from "uuid";

export function formatCurrency(amount: number): string {
	return amount.toLocaleString("en-US");
}

export const getNoteCategories = async () => {
	const { data } = await supabase.from("note_categories").select();
	return data ?? [];
};

export const uploadPaySlip = async (file: File) => {
	const fileName = uuidV4();
	const { error } = await supabase.storage.from("pay_slip").upload(fileName, file, { contentType: file.type });
	if (error) throw error;

	const { data } = await supabase.storage.from("pay_slip").getPublicUrl(fileName);
	return data.publicUrl;
};

