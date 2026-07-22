export type DocTreeNode = {
	id: string;
	title: string;
	children: DocTreeNode[];
};

export type CategoryListingItem = {
	id: string;
	title: string;
	excerpt: string | null;
	children: CategoryListingItem[];
};

export type SidebarGroup = {
	name: string;
	id: string;
	items: DocTreeNode[];
};

export type DocNavItem = {
	id: string;
	title: string;
};

export type ParentOption = {
	id: string;
	title: string;
	depth: number;
	label: string;
};

export type AdminDocumentOrderRow = {
	id: string;
	title: string;
	categoryId: string;
	parentDocumentId: string | null;
	depth: number;
	published: boolean;
	sortOrder: number;
};

export type DocumentOrderGroup = {
	categoryId: string;
	categoryName: string;
	items: AdminDocumentOrderRow[];
};
