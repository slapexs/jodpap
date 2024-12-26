import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { supabase } from "@/middlewares/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function PaySlip() {
	const params = useParams();
	const [paySlip, setPaySlip] = useState<string>("");

	const getPaySlip = async () => {
		const { data } = await supabase.from("notes").select("pay_slip").eq("id", params.noteId).single();
		setPaySlip(data?.pay_slip);
	};
	useEffect(() => {
		getPaySlip();
	}, []);

	return (
		<MainLayout>
			<img src={paySlip} alt="" />
		</MainLayout>
	);
}

