import { Loader2Icon } from "lucide-react";

export default function Loading() {
	return (
		<div className="w-full space-y-2 p-4 flex justify-center items-center text-gray-400 gap-2">
			<Loader2Icon className="animate-spin " /> กำลังโหลด
		</div>
	);
}

