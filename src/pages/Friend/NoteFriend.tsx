import PageTitle from "@/components/PageTitle";
import { useAuth } from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { supabase } from "@/middlewares/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Calendar1Icon, CoinsIcon, FolderOpenIcon, HandCoinsIcon, Loader2Icon } from "lucide-react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/transaction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NoteFriend() {
	const { getUserById, user: friendUser } = useUser();
	const { user } = useAuth();
	const params = useParams();
	const [borrowList, setBorrowList] = useState<any[]>([]);
	const [returnList, setReturnList] = useState<any[]>([]);
	const [isPaidReturnLoading, setIsPaidReturnLoading] = useState<boolean>(false);

	const getBorrowNotes = async () => {
		const { data } = await supabase
			.from("notes")
			.select("*, users:friend_id (name, image_profile), note_categories:category_id (name)")
			.eq("user_id", user!.id)
			.eq("friend_id", params.friendId)
			.eq("isPaid", false)
			.order("created_at", { ascending: false });

		setBorrowList(data ?? []);
	};

	const getWaitingReturn = async () => {
		const { data } = await supabase
			.from("notes")
			.select("*, users:friend_id (name, image_profile), note_categories:category_id (name)")
			.eq("friend_id", user!.id)
			.eq("isPaid", false);
		setReturnList(data ?? []);
	};

	const paidReturn = async (noteId: string) => {
		setIsPaidReturnLoading(true);
		await supabase
			.from("notes")
			.update([
				{
					isPaid: true,
					paid_at: new Date(),
				},
			])
			.eq("id", noteId);
		setTimeout(() => {
			setIsPaidReturnLoading(false);
			getBorrowNotes();
		}, 1000);
	};

	useEffect(() => {
		getUserById(params.friendId ?? "");
		getBorrowNotes();
		getWaitingReturn();
	}, []);

	return (
		<MainLayout>
			<PageTitle title={friendUser.name} />

			<h1 className="text-xl text-red-500 font-medium">ที่ยืม</h1>
			{borrowList.length > 0 ? (
				borrowList.map((borrow) => (
					<Accordion type="single" collapsible key={borrow.id}>
						<AccordionItem value={borrow.id}>
							<AccordionTrigger>{borrow.note}</AccordionTrigger>
							<AccordionContent className="flex justify-between gap-5">
								<div className="space-y-2">
									<Label className="flex items-center gap-1">
										<Calendar1Icon size={20} />: <span>{borrow.date}</span>
									</Label>
									<Label className="flex items-center gap-1">
										<CoinsIcon size={20} />: <span>{formatCurrency(borrow.amount)}</span>
									</Label>
									<Label className="flex items-center gap-1">
										<FolderOpenIcon size={20} />: <span>{borrow.note_categories.name}</span>
									</Label>
									<Label className="flex items-center gap-1">
										<HandCoinsIcon size={20} />:{" "}
										<span>
											{borrow.isPaid ? (
												<Badge variant={"default"} className="bg-green-500">
													คืนแล้ว
												</Badge>
											) : (
												<Badge variant={"destructive"}>ยังไม่คืน</Badge>
											)}
										</span>
									</Label>
								</div>
								<div className="w-fit">
									<Button
										type="button"
										variant={"default"}
										disabled={isPaidReturnLoading}
										onClick={() => paidReturn(borrow.id)}
									>
										{isPaidReturnLoading && <Loader2Icon className="animate-spin" />} คืน
									</Button>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				))
			) : (
				<>
					<h1 className="text-gray-400">ไม่พบรายการ</h1>
				</>
			)}

			<section className="mt-10">
				<h1 className="text-xl text-green-500 font-medium">รอคืน</h1>
				{returnList.length > 0 ? (
					<Table>
						<TableCaption>รายการที่รอได้คืน</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">วันที่</TableHead>
								<TableHead>รายการ</TableHead>
								<TableHead className="text-right">จำนวน</TableHead>
								<TableHead>สถานะ</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{returnList.map((list) => (
								<TableRow key={list.id}>
									<TableCell>{list.date}</TableCell>
									<TableCell>{list.note}</TableCell>
									<TableCell className="text-right">{formatCurrency(list.amount)}</TableCell>
									<TableCell>{list.isPaid ? "คืนแล้ว" : "ยังไม่คืน"}</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={3}>รวม</TableCell>
								<TableCell className="text-right">
									{formatCurrency(returnList.reduce((sum, item) => sum + item.amount, 0))}
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				) : (
					<>
						<h1 className="text-gray-400">ไม่พบรายการ</h1>
					</>
				)}
			</section>
		</MainLayout>
	);
}

