export function hasCustomSiteIcon(settings: {
	siteIconMime: string | null;
	siteIconData: string | null;
}): boolean {
	return Boolean(settings.siteIconMime && settings.siteIconData);
}

export function getSiteIconHref(settings: {
	siteIconMime: string | null;
	siteIconData: string | null;
	updatedAt: Date;
}): string | null {
	if (!hasCustomSiteIcon(settings)) return null;
	return `/site-icon?v=${settings.updatedAt.getTime()}`;
}
