export const SHARED_THEME_STORAGE_KEY = 'phh-ui-theme';
export const SHARED_FONT_STORAGE_KEY = 'phh-ui-font';
export const LEGACY_THEME_STORAGE_KEY = 'docs-theme';

export const APP_THEMES = [
	'system',
	'light',
	'dark',
	'cupcake',
	'bumblebee',
	'emerald',
	'corporate',
	'synthwave',
	'retro',
	'cyberpunk',
	'valentine',
	'halloween',
	'garden',
	'forest',
	'aqua',
	'lofi',
	'pastel',
	'fantasy',
	'wireframe',
	'black',
	'luxury',
	'dracula',
	'cmyk',
	'autumn',
	'business',
	'acid',
	'lemonade',
	'night',
	'coffee',
	'winter',
	'dim',
	'nord',
	'sunset',
	'caramellate',
	'abyss',
	'silk'
] as const;

export const APP_FONTS = [
	{ value: 'maple-mono', label: 'Maple Mono', stack: "'Maple Mono', ui-monospace, monospace" },
	{
		value: 'adwaita-sans',
		label: 'Adwaita Sans',
		stack: "'Adwaita Sans', ui-sans-serif, system-ui, sans-serif"
	},
	{
		value: 'adwaita-mono',
		label: 'Adwaita Mono',
		stack: "'Adwaita Mono', ui-monospace, monospace"
	},
	{ value: 'roboto', label: 'Roboto', stack: "'Roboto', ui-sans-serif, system-ui, sans-serif" },
	{ value: 'arial', label: 'Arial', stack: 'Arial, Helvetica, sans-serif' },
	{
		value: 'times-new-roman',
		label: 'Times New Roman',
		stack: "'Times New Roman', Times, serif"
	},
	{
		value: 'comic-relief',
		label: 'Comic Relief',
		stack: "'Comic Sans MS', 'Comic Neue', cursive"
	},
	{ value: 'pangolin', label: 'Pangolin', stack: "'Pangolin', 'Comic Sans MS', cursive" }
] as const;

export type AppTheme = (typeof APP_THEMES)[number];
export type AppFont = (typeof APP_FONTS)[number]['value'];

const VALID_THEMES = new Set<string>(APP_THEMES);
const VALID_FONTS = new Set<string>(APP_FONTS.map((font) => font.value));

function getCookieDomain(): string | null {
	if (typeof window === 'undefined') return null;
	const { hostname } = window.location;
	if (
		hostname === 'localhost' ||
		hostname.endsWith('.localhost') ||
		/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
	) {
		return null;
	}

	const parts = hostname.split('.').filter(Boolean);
	if (parts.length < 2) return null;
	return `.${parts.slice(-2).join('.')}`;
}

function readCookie(name: string): string | null {
	if (typeof document === 'undefined') return null;
	const prefix = `${name}=`;
	for (const part of document.cookie.split(';')) {
		const trimmed = part.trim();
		if (trimmed.startsWith(prefix)) {
			return decodeURIComponent(trimmed.slice(prefix.length));
		}
	}
	return null;
}

function writeCookie(name: string, value: string) {
	if (typeof document === 'undefined') return;
	const domain = getCookieDomain();
	const domainPart = domain ? `; domain=${domain}` : '';
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax${domainPart}`;
}

function normalizeTheme(theme: unknown): AppTheme {
	return typeof theme === 'string' && VALID_THEMES.has(theme) ? (theme as AppTheme) : 'system';
}

function normalizeFont(font: unknown): AppFont {
	return typeof font === 'string' && VALID_FONTS.has(font) ? (font as AppFont) : 'roboto';
}

export function resolveTheme(theme: AppTheme): string {
	if (theme !== 'system') return theme;
	if (typeof matchMedia === 'undefined') return 'winter';
	return matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'winter';
}

export function readStoredTheme(): AppTheme {
	if (typeof localStorage === 'undefined') return 'system';
	return normalizeTheme(
		readCookie(SHARED_THEME_STORAGE_KEY) ??
			localStorage.getItem(SHARED_THEME_STORAGE_KEY) ??
			localStorage.getItem(LEGACY_THEME_STORAGE_KEY)
	);
}

export function readStoredFont(): AppFont {
	if (typeof localStorage === 'undefined') return 'roboto';
	return normalizeFont(
		readCookie(SHARED_FONT_STORAGE_KEY) ?? localStorage.getItem(SHARED_FONT_STORAGE_KEY)
	);
}

export function applyTheme(theme: AppTheme): void {
	if (typeof document === 'undefined' || typeof localStorage === 'undefined') return;
	document.documentElement.setAttribute('data-theme', resolveTheme(theme));
	localStorage.setItem(SHARED_THEME_STORAGE_KEY, theme);
	localStorage.setItem(LEGACY_THEME_STORAGE_KEY, resolveTheme(theme));
	writeCookie(SHARED_THEME_STORAGE_KEY, theme);
}

export function applyFont(font: AppFont): void {
	if (typeof document === 'undefined' || typeof localStorage === 'undefined') return;
	document.documentElement.setAttribute('data-font', font);
	localStorage.setItem(SHARED_FONT_STORAGE_KEY, font);
	writeCookie(SHARED_FONT_STORAGE_KEY, font);
}

export function syncSharedAppearance(): void {
	applyTheme(readStoredTheme());
	applyFont(readStoredFont());
}

export function toggleTheme(current: AppTheme): AppTheme {
	const next: AppTheme = resolveTheme(current) === 'night' ? 'winter' : 'night';
	applyTheme(next);
	return next;
}

export function watchSharedAppearance(onChange?: () => void) {
	if (typeof window === 'undefined') return () => {};

	const sync = () => {
		syncSharedAppearance();
		onChange?.();
	};

	window.addEventListener('focus', sync);
	document.addEventListener('visibilitychange', sync);

	return () => {
		window.removeEventListener('focus', sync);
		document.removeEventListener('visibilitychange', sync);
	};
}
