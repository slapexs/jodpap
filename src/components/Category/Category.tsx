import { CarIcon, CircleEllipsisIcon, PizzaIcon, ShoppingCartIcon, TicketIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function Category() {
	return (
		<main>
			<h1 className="font-bold">หมวดหมู่</h1>
			<Separator className="mb-2" />

			<div className="grid grid-cols-3 gap-3">
				<Button type="button" variant={"outline"}>
					<PizzaIcon /> อาหาร
				</Button>
				<Button type="button" variant={"outline"}>
					<ShoppingCartIcon /> ช้อปปิ้ง
				</Button>
				<Button type="button" variant={"outline"}>
					<TicketIcon /> จิปาถะ
				</Button>
				<Button type="button" variant={"outline"}>
					<CarIcon /> เดินทาง
				</Button>
				<Button type="button" variant={"outline"}>
					<CircleEllipsisIcon /> อื่น ๆ
				</Button>
			</div>
		</main>
	);
}

