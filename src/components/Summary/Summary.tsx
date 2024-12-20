import { formatCurrency } from "@/utils/transaction";
import { Badge } from "../ui/badge";

interface ISummaryProps {
	amount: number;
	noteAmount: number;
}

export default function Summary({ amount, noteAmount }: ISummaryProps) {
	return (
		<div className="my-5 space-y-3 text-center">
			<p className="font-light">หนี้ทั้งหมด</p>
			<h1 className="font-bold text-5xl">฿{formatCurrency(amount)}</h1>
			<Badge variant={"secondary"}>จาก {noteAmount} รายการ</Badge>
		</div>
	);
}

