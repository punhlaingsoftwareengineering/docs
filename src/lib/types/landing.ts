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
		videoUrl: string;
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

export type LandingCategorySection = {
	name: string;
	slug: string;
	description: string;
	badge: string;
	documentCount: number;
	documents: {
		title: string;
		slug: string;
		excerpt: string | null;
	}[];
};
