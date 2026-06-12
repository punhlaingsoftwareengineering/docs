export type DocTreeNode = {
	slug: string;
	title: string;
	children: DocTreeNode[];
};

export type SidebarGroup = {
	name: string;
	slug: string;
	items: DocTreeNode[];
};

export type DocNavItem = {
	slug: string;
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
	slug: string;
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

export type FooterCategory = {
	name: string;
	slug: string;
	entrySlug: string;
	documents: { title: string; slug: string }[];
};
