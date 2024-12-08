import { formatCurrency } from "@/utils/transaction";
import { Separator } from "../ui/separator";
import { PizzaIcon } from "lucide-react";

export default function Recent() {
	interface ITransaction {
		title: string;
		amount: number;
		friend: {
			id: string;
			name: string;
		};
		created_at: string;
		type: string;
		category: string;
	}

	const recents: ITransaction[] = [
		{
			title: "Dinner Bill",
			amount: 150,
			friend: {
				id: "101",
				name: "Alice",
			},
			created_at: new Date().toLocaleDateString(),
			type: "borrow",
			category: "food",
		},
		{
			title: "Concert Tickets",
			amount: 300,
			friend: {
				id: "102",
				name: "Bob",
			},
			created_at: new Date().toLocaleDateString(),
			type: "refund",
			category: "food",
		},
		{
			title: "Gift for Birthday",
			amount: 75,
			friend: {
				id: "103",
				name: "Charlie",
			},
			created_at: new Date().toLocaleDateString(),
			type: "borrow",
			category: "food",
		},
	];

	return (
		<main>
			<h1 className="font-bold">ล่าสุด</h1>
			<Separator />
			{recents.map((item: ITransaction, index: number) => (
				<nav key={index}>
					<div className="rounded-lg py-1">
						<section className="flex gap-3 items-center">
							<div className="w-10 h-10 rounded-full flex justify-center items-center bg-secondary">
								{item.category === "food" ? <PizzaIcon size={16} /> : ""}
							</div>
							<div className="flex gap-3">
								<div>
									<p>{item.friend.name}</p>
									<p className="text-gray-400">
										<small>{item.created_at}</small>
									</p>
								</div>
							</div>

							<div className="ml-auto flex gap-3">
								<h1>฿{formatCurrency(item.amount)}</h1>
							</div>
						</section>
					</div>
				</nav>
			))}
		</main>
	);
}

