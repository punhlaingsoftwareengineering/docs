import { canAccessDocsAdmin } from '$lib/server/portal-access';

export async function canPreviewUnpublishedDocs(userId: string | undefined | null): Promise<boolean> {
	if (!userId) return false;
	return canAccessDocsAdmin(userId);
}
