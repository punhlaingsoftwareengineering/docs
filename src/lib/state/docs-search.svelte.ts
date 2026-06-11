export const docsSearch = $state({ open: false });

export function openDocsSearch() {
	docsSearch.open = true;
}

export function closeDocsSearch() {
	docsSearch.open = false;
}
