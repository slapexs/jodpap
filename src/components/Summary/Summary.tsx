import { formatCurrency } from "@/utils/transaction";
import { Badge } from "../ui/badge";

export default function Summary() {
	return (
		<div className="my-5 text-center">
			<p className="font-light">ยอดรวม</p>
			<h1 className="font-bold text-5xl">฿{formatCurrency(3022)}</h1>
			<Badge variant={"secondary"}>จาก 25 รายการ</Badge>
		</div>
	);
}

