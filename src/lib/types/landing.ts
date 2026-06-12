export type LandingFeature = {
	title: string;
	description: string;
	badge: string;
	href: string;
};

export type ResolvedLandingSettings = {
	heroSearchPlaceholder: string;
	techStack: {
		heading: string;
		items: string[];
	};
	features: {
		heading: string;
		subtitle: string;
		items: LandingFeature[];
	};
	codePreview: {
		heading: string;
		subtitle: string;
		terminalLabel: string;
		lines: string[];
	};
	docsCategories: {
		heading: string;
		subtitle: string;
		ctaLabel: string;
		ctaUrl: string;
		descriptions: Record<string, string>;
	};
	cta: {
		heading: string;
		subtitle: string;
		primaryLabel: string;
		primaryUrl: string;
		secondaryLabel: string;
		secondaryUrl: string;
	};
};

export type LandingCategoryCard = {
	name: string;
	slug: string;
	entrySlug: string;
	documentCount: number;
};
