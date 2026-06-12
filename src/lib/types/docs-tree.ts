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
