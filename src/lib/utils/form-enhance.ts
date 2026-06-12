import type { SubmitFunction } from '@sveltejs/kit';

function getSubmitButton(formElement: HTMLFormElement, submitter: HTMLElement | null) {
	if (submitter instanceof HTMLButtonElement && submitter.type === 'submit') {
		return submitter;
	}
	return formElement.querySelector<HTMLButtonElement>('button[type="submit"]');
}

export const formEnhance: SubmitFunction = ({ formElement, submitter }) => {
	const button = getSubmitButton(formElement, submitter);

	if (button) {
		button.classList.add('loading');
		button.disabled = true;
	}

	return async ({ update }) => {
		try {
			await update();
		} finally {
			if (button) {
				button.classList.remove('loading');
				button.disabled = false;
			}
		}
	};
};
