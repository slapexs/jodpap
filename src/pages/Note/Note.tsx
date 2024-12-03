import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";

export default function Note() {
	const { signOut } = useAuth();

	return (
		<>
			<MainLayout>
				<div className="w-full mt-5">
					<h1 className="text-5xl font-semibold">จดไว้แล้ว</h1>
				</div>
			</MainLayout>
		</>
	);
}

