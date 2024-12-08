import PageTitle from "@/components/PageTitle";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { PaletteIcon } from "lucide-react";

export default function Setting() {
	const { setTheme } = useTheme();
	return (
		<MainLayout>
			<PageTitle title="ตั้งค่า" />

			<div className="flex justify-between">
				<div className="flex items-center gap-3">
					<PaletteIcon /> <Label>ธีม</Label>
				</div>

				<div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="default">
								เปลี่ยน
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</MainLayout>
	);
}

