function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function escapeRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightSearchText(text: string, query: string): string {
	if (!text) return '';
	const escaped = escapeHtml(text);
	if (!query.trim()) return escaped;

	const pattern = escapeRegex(query.trim());
	return escaped.replace(
		new RegExp(`(${pattern})`, 'gi'),
		'<mark class="rounded-sm bg-accent px-0.5 text-accent-content">$1</mark>'
	);
}
