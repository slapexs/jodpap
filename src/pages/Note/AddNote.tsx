import PageTitle from "@/components/PageTitle";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import useFriend from "@/hooks/useFriend";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { getNoteCategories } from "@/utils/transaction";
import { INoteCategory } from "@/types/transaction";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/middlewares/supabase";
import { useNavigate } from "react-router";

export default function AddNote() {
	const { friends } = useFriend();
	const [noteCategory, setNoteCategory] = useState<INoteCategory[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const formSchema = z.object({
		friendId: z.string({ message: "เลือกเพื่อนด้วย" }).min(3, "เลือกเพื่อนด้วย"),
		date: z.date({ message: "ระบุวันที่ด้วย" }),
		amount: z.string({ message: "ระบุจำนวนด้วย" }).min(1, "ระบุจำนวนด้วย").max(7),
		categoryId: z.string().optional(),
		note: z.string().min(3, "ระบุไว้หน่อยว่าค่าอะไร"),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			friendId: "",
			date: new Date(),
			amount: "",
			categoryId: "d283f7ad-f1a4-46a1-b19f-24d48d618edd",
			note: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const { amount, date, friendId, note, categoryId } = values;
		setIsLoading(true);
		try {
			await supabase.from("notes").insert({ amount, date, friend_id: friendId, note, category_id: categoryId });
			toast({ title: "เย้!", description: "บันทึกโน๊ตใหม่เรียบร้อย" });
			setTimeout(() => {
				navigate(`/friend/${friendId}`);
			}, 1500);
		} catch (error) {
			toast({ title: "เอ๊ะ!", description: (error as Error).message, duration: 3500, variant: "destructive" });
		}
		setIsLoading(false);
	};

	useEffect(() => {
		getNoteCategories().then((cates: INoteCategory[]) => {
			setNoteCategory(cates);
		});
	}, []);

	return (
		<MainLayout>
			<PageTitle title="เพิ่มบันทึก" />

			<Card className="pt-5">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="space-y-6">
							<FormField
								control={form.control}
								name="friendId"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>เลือกเพื่อน</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-full justify-between",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value
															? friends.find((friend) => friend.id === field.value)?.name
															: "เลือก"}
														<ChevronsUpDown className="opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput placeholder="ค้นหาเพื่อน" className="h-9" />
													<CommandList>
														<CommandEmpty>ไม่พบใครเลย</CommandEmpty>
														<CommandGroup>
															{friends.map((friend) => (
																<CommandItem
																	value={friend.id}
																	key={friend.id}
																	onSelect={() => {
																		form.setValue("friendId", friend.id);
																	}}
																>
																	{friend.name}
																	<Check
																		className={cn(
																			"ml-auto",
																			friend.id === field.value
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex  flex-col">
										<FormLabel>วันที่ยืม</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(field.value, "dd-MM-yyyy")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem className="">
										<FormLabel>จำนวน</FormLabel>
										<FormControl>
											<Input placeholder="200" type="number" min={0} max={9999999} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="categoryId"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormLabel>หมวดหมู่</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex flex-col space-y-1"
											>
												{noteCategory.map((cate: INoteCategory) => (
													<FormItem
														className="flex items-center space-x-3 space-y-0"
														key={cate.id}
													>
														<FormControl>
															<RadioGroupItem value={cate.id} />
														</FormControl>
														<FormLabel className="font-normal">{cate.name}</FormLabel>
													</FormItem>
												))}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="note"
								render={({ field }) => (
									<FormItem>
										<FormLabel>โน๊ต</FormLabel>
										<FormControl>
											<Textarea placeholder="จดไว้หน่อยว่าค่าอะไร" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button type="submit" className="w-full" variant={"default"} disabled={isLoading}>
								{isLoading && <Loader2Icon className="animate-spin" />} บันทึก
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</MainLayout>
	);
}

