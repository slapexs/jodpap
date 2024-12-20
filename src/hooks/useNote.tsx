import { supabase } from "@/middlewares/supabase";
import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";

export default function useNote() {
	const { user } = useAuth();
	const [amount, setAmount] = useState<number>(0);
	const [noteAmount, setNoteAmount] = useState<number>(0);
	const getUnPaidAmount = async () => {
		const { data } = await supabase.from("notes").select("*").eq("user_id", user!.id).eq("isPaid", false);
		setNoteAmount(data?.length ?? 0);
		setAmount(data?.reduce((sum, item) => sum + item.amount, 0));
	};

	useEffect(() => {
		getUnPaidAmount();
	}, []);
	return { amount, noteAmount };
}

