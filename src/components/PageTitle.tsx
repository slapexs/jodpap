interface IPageTitle {
	title: string;
}
export default function PageTitle({ title }: IPageTitle) {
	return (
		<main className="flex gap-3 items-baseline">
			<h1 className="font-semibold text-xl mt-3 mb-5">{title}</h1>
		</main>
	);
}

