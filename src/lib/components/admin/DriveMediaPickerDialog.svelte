<script lang="ts">
	import { fetchWithSession } from '$lib/client/fetch-session';
	import { FolderOpen, LoaderCircle, Upload } from '@lucide/svelte';

	type MediaFile = { id: string; name: string; updatedAt: string | null };

	let {
		accept = '*/*',
		onSelect
	}: {
		accept?: string;
		onSelect: (url: string) => void;
	} = $props();

	let dialog = $state<HTMLDialogElement | null>(null);
	let files = $state<MediaFile[]>([]);
	let loading = $state(false);
	let uploading = $state(false);
	let pickingId = $state<string | null>(null);
	let error = $state<string | null>(null);
	let dragDepth = $state(0);

	export function open() {
		error = null;
		dialog?.showModal();
		void loadFiles();
	}

	function close() {
		dialog?.close();
		error = null;
		uploading = false;
		pickingId = null;
	}

	async function loadFiles() {
		loading = true;
		error = null;
		try {
			const r = await fetchWithSession('/api/drive-media');
			if (!r.ok) throw new Error(await r.text());
			const j = (await r.json()) as { files?: MediaFile[] };
			files = j.files ?? [];
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load files';
			files = [];
		} finally {
			loading = false;
		}
	}

	async function uploadFile(file: File) {
		uploading = true;
		error = null;
		try {
			const fd = new FormData();
			fd.set('file', file);
			const r = await fetchWithSession('/api/drive-media/upload', {
				method: 'POST',
				body: fd
			});
			if (!r.ok) throw new Error(await r.text());
			const j = (await r.json()) as { url?: string };
			if (!j.url) throw new Error('Upload did not return a URL');
			onSelect(j.url);
			close();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Upload failed';
		} finally {
			uploading = false;
		}
	}

	async function pickFile(fileId: string) {
		pickingId = fileId;
		error = null;
		try {
			const r = await fetchWithSession('/api/drive-media/pick', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ fileId })
			});
			if (!r.ok) throw new Error(await r.text());
			const j = (await r.json()) as { url?: string };
			if (!j.url) throw new Error('Pick did not return a URL');
			onSelect(j.url);
			close();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Could not use file';
		} finally {
			pickingId = null;
		}
	}

	function onFileInputChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (file) void uploadFile(file);
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		dragDepth = 0;
		const file = event.dataTransfer?.files?.[0];
		if (file) void uploadFile(file);
	}
</script>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box max-w-2xl">
		<h3 class="text-lg font-bold">Upload to PHH-DRIVE</h3>
		<p class="mt-1 text-sm text-base-content/70">
			Files are stored in <code class="text-xs">portal/documentation</code> on the team drive. A public
			link is copied into the media URL field.
		</p>

		<div
			class="mt-4 rounded-box border-2 border-dashed p-6 text-center transition-colors {dragDepth > 0
				? 'border-primary bg-primary/5'
				: 'border-base-300'}"
			ondragenter={() => (dragDepth += 1)}
			ondragleave={() => (dragDepth = Math.max(0, dragDepth - 1))}
			ondragover={(e) => e.preventDefault()}
			ondrop={onDrop}
			role="region"
			aria-label="Upload drop zone"
		>
			<Upload class="mx-auto mb-2 size-8 text-base-content/50" aria-hidden="true" />
			<p class="text-sm text-base-content/70">Drag a file here or</p>
			<label class="btn btn-primary btn-sm mt-2">
				Choose file
				<input type="file" class="hidden" {accept} onchange={onFileInputChange} disabled={uploading} />
			</label>
			{#if uploading}
				<div class="mt-3 flex items-center justify-center gap-2 text-sm">
					<LoaderCircle class="size-4 animate-spin" aria-hidden="true" />
					Uploading…
				</div>
			{/if}
		</div>

		<div class="mt-6">
			<div class="mb-2 flex items-center gap-2">
				<FolderOpen class="size-4" aria-hidden="true" />
				<h4 class="font-medium">Existing files</h4>
				<button type="button" class="btn btn-ghost btn-xs ml-auto" onclick={loadFiles} disabled={loading}>
					Refresh
				</button>
			</div>

			{#if loading}
				<div class="flex items-center gap-2 py-6 text-sm text-base-content/70">
					<LoaderCircle class="size-4 animate-spin" aria-hidden="true" />
					Loading…
				</div>
			{:else if files.length === 0}
				<p class="py-4 text-sm text-base-content/60">No files in this folder yet.</p>
			{:else}
				<ul class="max-h-56 space-y-1 overflow-y-auto rounded-box border border-base-300 p-2">
					{#each files as file (file.id)}
						<li class="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-base-200">
							<span class="min-w-0 flex-1 truncate text-sm">{file.name}</span>
							<button
								type="button"
								class="btn btn-outline btn-xs shrink-0"
								disabled={pickingId === file.id}
								onclick={() => pickFile(file.id)}
							>
								{#if pickingId === file.id}
									<LoaderCircle class="size-3 animate-spin" aria-hidden="true" />
								{:else}
									Use
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		{#if error}
			<div role="alert" class="alert alert-error alert-sm mt-4">
				<span>{error}</span>
			</div>
		{/if}

		<div class="modal-action">
			<button type="button" class="btn" onclick={close}>Close</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button type="submit" aria-label="Close">close</button>
	</form>
</dialog>
