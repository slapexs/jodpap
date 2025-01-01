import PageTitle from "@/components/PageTitle";
import { useAuth } from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { supabase } from "@/middlewares/supabase";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Calendar1Icon, CalendarDaysIcon, CoinsIcon, FolderOpenIcon, HandCoinsIcon, Loader2Icon } from "lucide-react";
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
import { formatCurrency, uploadPaySlip } from "@/utils/transaction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NoteFriend() {
	const { getUserById, user: friendUser } = useUser();
	const { user } = useAuth();
	const params = useParams();
	const [borrowList, setBorrowList] = useState<any[]>([]);
	const [returnList, setReturnList] = useState<any[]>([]);

	const [isPaidReturnLoading, setIsPaidReturnLoading] = useState<boolean>(false);
	const formSchema = z.object({
		noteId: z.string(),
		paySlip: z
			.any()
			.refine((file) => file instanceof File, {
				message: "โปรดอัพโหลดไฟล์ที่ถูกต้อง",
			})
			.refine((file) => file.size <= 5 * 1024 * 1024, {
				message: "ไฟล์ต้องมีขนาดไม่เกิน 5MB",
			})
			.refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
				message: "รองรับเฉพาะไฟล์ประเภท JPEG, PNG",
			}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			noteId: "",
			paySlip: undefined,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsPaidReturnLoading(true);
		try {
			const filePath: string | undefined =
				values.paySlip !== undefined ? await uploadPaySlip(values.paySlip) : undefined;
			await supabase
				.from("notes")
				.update([
					{
						isPaid: true,
						pay_slip: filePath,
						paid_at: new Date(),
					},
				])
				.eq("id", values.noteId);
			toast({ title: "เย้!", description: "คืนเงินเรียบร้อย" });
		} catch (error) {
			toast({ title: "เอ๊ะ!", description: (error as Error).message, duration: 3500, variant: "destructive" });
		}

		setTimeout(() => {
			setIsPaidReturnLoading(false);
			getBorrowNotes();
		}, 1000);
	};

	const getBorrowNotes = async (onlyUnPaid: boolean = false) => {
		const { data } = await supabase
			.from("notes")
			.select("*, users:friend_id (name, image_profile), note_categories:category_id (name)")
			.eq("user_id", user!.id)
			.eq("friend_id", params.friendId)
			.gte(
				"created_at",
				`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-01`
			)
			.lt(
				"created_at",
				`${new Date().getFullYear()}-${(new Date().getMonth() + 2).toString().padStart(2, "0")}-01`
			)
			.order("created_at", { ascending: false });

		if (!onlyUnPaid) {
			setBorrowList(data?.filter((item) => item.isPaid === false) ?? []);
		} else {
			setBorrowList(data?.filter((item) => item.isPaid === true) ?? []);
		}
	};

	const getWaitingReturn = async () => {
		const { data } = await supabase
			.from("notes")
			.select("*, users:friend_id (name, image_profile), note_categories:category_id (name)")
			.eq("friend_id", user!.id)
			.eq("isPaid", false);
		setReturnList(data ?? []);
	};

	useEffect(() => {
		getUserById(params.friendId ?? "");
		getBorrowNotes();
		getWaitingReturn();
	}, []);

	const thaiMonths = [
		"มกราคม",
		"กุมภาพันธ์",
		"มีนาคม",
		"เมษายน",
		"พฤษภาคม",
		"มิถุนายน",
		"กรกฎาคม",
		"สิงหาคม",
		"กันยายน",
		"ตุลาคม",
		"พฤศจิกายน",
		"ธันวาคม",
	];

	return (
		<MainLayout>
			<PageTitle title={friendUser.name} />
			<Alert className="mb-4">
				<CalendarDaysIcon className="w-4 h-4" />
				<AlertTitle>รายการของเดือน</AlertTitle>
				<AlertDescription>
					{thaiMonths[new Date().getMonth()]}/{new Date().getFullYear() + 543}
				</AlertDescription>
			</Alert>

			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-medium text-red-500">ที่ยืม</h1>
				</div>
				<div className="flex items-center space-x-2">
					<Label htmlFor="viewReturnList" className="text-xs">
						คืนแล้ว
					</Label>
					<Switch id="viewReturnList" onCheckedChange={(val: boolean) => getBorrowNotes(val)} />
				</div>
			</div>

			{borrowList.length > 0 ? (
				borrowList.map((borrow) => (
					<Accordion type="single" collapsible key={borrow.id}>
						<AccordionItem value={borrow.id}>
							<AccordionTrigger>
								<span className="flex items-center gap-2">
									{!borrow.isPaid && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
									{borrow.note}
								</span>
							</AccordionTrigger>
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
									{borrow.isPaid ? (
										<Link to={`/note/payslip/${borrow.id}`}>
											<img
												src={borrow.pay_slip}
												alt="pay_slip"
												className="max-w-[150px] shadow-md"
											/>
											<p className="text-center">
												<small>คลิกเพื่อดูรูปเต็ม</small>
											</p>
										</Link>
									) : (
										<Drawer onClose={() => form.setValue("noteId", "")}>
											<DrawerTrigger asChild>
												<Button
													type="button"
													onClick={() => form.setValue("noteId", borrow.id)}
												>
													คืน
												</Button>
											</DrawerTrigger>
											<DrawerContent>
												<Form {...form}>
													<form onSubmit={form.handleSubmit(onSubmit)}>
														<DrawerHeader>
															<DrawerTitle>อัปโหลดสลิป</DrawerTitle>
															<DrawerDescription>
																แนบสลิปเพื่อยืนยันว่าคืนค่า {borrow.note} แล้วนะ
															</DrawerDescription>

															<FormField
																control={form.control}
																name="paySlip"
																render={({ field }) => (
																	<FormItem className="text-left">
																		<FormLabel>เลือก</FormLabel>
																		<FormControl>
																			<Input
																				type="file"
																				accept="image/*"
																				onChange={(e) =>
																					field.onChange(e.target.files?.[0])
																				}
																				onBlur={field.onBlur}
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</DrawerHeader>

														<DrawerFooter>
															<Button type="submit" disabled={isPaidReturnLoading}>
																{isPaidReturnLoading && (
																	<Loader2Icon className="animate-spin" />
																)}
																ตกลง
															</Button>
															<DrawerClose asChild>
																<Button
																	variant="outline"
																	disabled={isPaidReturnLoading}
																>
																	ปิด
																</Button>
															</DrawerClose>
														</DrawerFooter>
													</form>
												</Form>
											</DrawerContent>
										</Drawer>
									)}
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

