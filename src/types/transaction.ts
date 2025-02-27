export interface INoteCategory {
	id: string;
	name: string;
	created_at: string;
}

export interface ITransaction {
	id: string;
	friend_id: string;
	date: string;
	category_id: string;
	note: string;
	created_at: string;
	amount: number;
	isPaid: boolean;
	user_id: string;
	paid_at?: string;
	pay_slip?: string;
	users: {
		name: string;
		image_profile: string;
	};
	note_categories: {
		name: string;
	};
}
