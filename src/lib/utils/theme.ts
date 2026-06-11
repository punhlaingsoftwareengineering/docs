export type Theme = 'winter' | 'night';

export const THEME_KEY = 'docs-theme';

const DEFAULT_THEME: Theme = 'winter';

function systemTheme(): Theme {
	if (typeof matchMedia === 'undefined') return DEFAULT_THEME;
	return matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'winter';
}

export function getStoredTheme(): Theme {
	if (typeof localStorage === 'undefined') return systemTheme();

	const stored = localStorage.getItem(THEME_KEY);
	if (stored === 'winter' || stored === 'night') return stored;

	return systemTheme();
}

export function applyTheme(theme: Theme): void {
	if (typeof document === 'undefined') return;

	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme(current: Theme): Theme {
	const next: Theme = current === 'winter' ? 'night' : 'winter';
	applyTheme(next);
	return next;
}
