import Navbar from "@/components/Navbar/Navbar";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<>
			<Navbar />
			<main className="container mx-auto px-6 sm:px-0">{children}</main>
		</>
	);
};

