<script lang="ts">
	import { onMount } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { EditorState } from '@codemirror/state';
	import { markdown } from '@codemirror/lang-markdown';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { renderMarkdown } from '$lib/markdown';

	let {
		value = $bindable(''),
		onchange
	}: {
		value?: string;
		onchange?: (content: string) => void;
	} = $props();

	let editorEl = $state<HTMLDivElement | null>(null);
	let previewHtml = $derived(renderMarkdown(value));
	let view: EditorView | null = null;

	onMount(() => {
		if (!editorEl) return;

		const isDark = document.documentElement.getAttribute('data-theme') === 'night';

		view = new EditorView({
			parent: editorEl,
			state: EditorState.create({
				doc: value,
				extensions: [
					basicSetup,
					markdown(),
					EditorView.updateListener.of((update) => {
						if (update.docChanged) {
							value = update.state.doc.toString();
							onchange?.(value);
						}
					}),
					...(isDark ? [oneDark] : [])
				]
			})
		});

		return () => view?.destroy();
	});

	$effect(() => {
		if (!view) return;
		const current = view.state.doc.toString();
		if (value !== current) {
			view.dispatch({
				changes: { from: 0, to: current.length, insert: value }
			});
		}
	});
</script>

<div class="grid min-h-[60vh] grid-cols-1 gap-0 border border-base-300 lg:grid-cols-2">
	<div class="overflow-hidden border-b border-base-300 lg:border-r lg:border-b-0">
		<div
			class="border-b border-base-300 bg-base-200 px-3 py-2 text-xs font-medium text-base-content/60"
		>
			Markdown
		</div>
		<div bind:this={editorEl} class="codemirror-host min-h-[50vh] text-sm"></div>
	</div>
	<div class="overflow-auto">
		<div
			class="border-b border-base-300 bg-base-200 px-3 py-2 text-xs font-medium text-base-content/60"
		>
			Preview
		</div>
		<div class="prose prose-sm max-w-none p-4">{@html previewHtml}</div>
	</div>
</div>

<style>
	:global(.codemirror-host .cm-editor) {
		min-height: 50vh;
	}
	:global(.codemirror-host .cm-scroller) {
		font-family: ui-monospace, monospace;
	}
</style>
