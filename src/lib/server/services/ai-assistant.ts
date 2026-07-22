import type { AiChatMessage } from '$lib/schemas/ai-chat';

function normalize(text: string): string {
	return text.trim().toLowerCase();
}

function replyFor(message: string): string {
	const text = normalize(message);

	if (/search|ctrl\+k|find/.test(text)) {
		return 'Use the search control in the navbar or press Ctrl+K to open the docs search modal from anywhere.';
	}

	if (/categor|browse|section|article/.test(text)) {
		return 'Browse the landing page sections or open a category page to see all published articles in that section.';
	}

	if (/admin|publish|document|draft/.test(text)) {
		return 'Admins can manage categories and documents from /admin. Published documents show up in search and category listings.';
	}

	if (/theme|dark|light|font|appearance/.test(text)) {
		return 'Use the floating support button to change theme or font. Your appearance settings are shared across the docs, drive, and employee portal on this browser.';
	}

	if (/hello|hi|hey|thanks|thank you/.test(text)) {
		return 'Hello! Ask me about docs search, categories, admin publishing, or appearance settings.';
	}

	return 'I am not sure about that yet. Try asking about search, categories, publishing, or appearance settings.';
}

export function generateAiAssistantReply(
	message: string,
	_history: AiChatMessage[] = []
): AiChatMessage {
	return {
		role: 'assistant',
		content: replyFor(message)
	};
}
