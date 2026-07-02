import type { SubmitFunction } from '@sveltejs/kit';

const SPINNER_MARKER = 'data-form-enhance-spinner';
const HIDDEN_ICON_MARKER = 'data-form-enhance-hidden-icon';

function getSubmitButton(formElement: HTMLFormElement, submitter: HTMLElement | null) {
	if (submitter instanceof HTMLButtonElement && submitter.type === 'submit') {
		return submitter;
	}
	return formElement.querySelector<HTMLButtonElement>('button[type="submit"]');
}

function beginButtonLoading(button: HTMLButtonElement) {
	button.disabled = true;
	button.setAttribute('aria-busy', 'true');

	const spinner = document.createElement('span');
	spinner.className = 'loading loading-spinner loading-sm';
	spinner.setAttribute('aria-hidden', 'true');
	spinner.setAttribute(SPINNER_MARKER, 'true');
	button.insertBefore(spinner, button.firstChild);

	const hiddenIcons: HTMLElement[] = [];
	for (const child of button.children) {
		if (child === spinner) continue;
		if (child instanceof SVGElement || child.querySelector('svg')) {
			child.classList.add('hidden');
			child.setAttribute(HIDDEN_ICON_MARKER, 'true');
			hiddenIcons.push(child as HTMLElement);
		}
	}

	return { spinner, hiddenIcons };
}

function endButtonLoading(
	button: HTMLButtonElement,
	spinner: HTMLSpanElement | null,
	hiddenIcons: HTMLElement[]
) {
	button.disabled = false;
	button.removeAttribute('aria-busy');
	spinner?.remove();
	for (const icon of hiddenIcons) {
		icon.classList.remove('hidden');
		icon.removeAttribute(HIDDEN_ICON_MARKER);
	}
}

export function confirmEnhance(message: string | (() => string)): SubmitFunction {
	return (input) => {
		if (!confirm(typeof message === 'function' ? message() : message)) {
			input.cancel();
			return;
		}
		return formEnhance(input);
	};
}

export const formEnhance: SubmitFunction = ({ formElement, submitter }) => {
	const button = getSubmitButton(formElement, submitter);
	const loadingState = button ? beginButtonLoading(button) : null;

	return async ({ update }) => {
		try {
			await update();
		} finally {
			if (button && loadingState) {
				endButtonLoading(button, loadingState.spinner, loadingState.hiddenIcons);
			}
		}
	};
};
