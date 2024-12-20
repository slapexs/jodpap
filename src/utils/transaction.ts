import { supabase } from "@/middlewares/supabase";

export function formatCurrency(amount: number): string {
	return amount.toLocaleString("en-US");
}

export const getNoteCategories = async () => {
	const { data } = await supabase.from("note_categories").select();
	return data ?? [];
};

