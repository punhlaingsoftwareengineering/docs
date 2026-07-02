import { marked, type Tokens } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { slugify } from '$lib/utils/slug';

marked.setOptions({ gfm: true, breaks: true });

marked.use({
	renderer: {
		heading({ tokens, depth }) {
			const text = this.parser.parseInline(tokens);
			const plain = text.replace(/<[^>]+>/g, '');
			const id = slugify(plain);
			return `<h${depth} id="${id}">${text}</h${depth}>\n`;
		}
	}
});

const sanitizeOptions: sanitizeHtml.IOptions = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat([
		'img',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6'
	]),
	allowedAttributes: {
		...sanitizeHtml.defaults.allowedAttributes,
		a: ['href', 'name', 'target', 'rel'],
		img: ['src', 'alt', 'title'],
		'*': ['id']
	}
};

export type DocHeading = {
	id: string;
	text: string;
	level: number;
};

export function extractHeadings(markdown: string, options?: { maxLevel?: number }): DocHeading[] {
	const maxLevel = options?.maxLevel ?? 6;
	const tokens = marked.lexer(markdown);
	return tokens
		.filter((token): token is Tokens.Heading => token.type === 'heading' && token.depth <= maxLevel)
		.map((token) => ({
			level: token.depth,
			text: token.text,
			id: slugify(token.text)
		}));
}

export function renderMarkdown(markdown: string): string {
	const raw = marked.parse(markdown, { async: false }) as string;
	return sanitizeHtml(raw, sanitizeOptions);
}

export function sanitizeDocHtml(html: string): string {
	return sanitizeHtml(html, sanitizeOptions);
}
