<script lang="ts">
	type AlertType = 'success' | 'error' | 'warning' | 'info';

	let {
		form,
		successMessage = 'Saved successfully.'
	}: {
		form?: Record<string, unknown> | null;
		successMessage?: string;
	} = $props();

	const alert = $derived.by((): { type: AlertType; message: string } | null => {
		if (!form) return null;

		if (form.success === true) {
			const message = typeof form.message === 'string' ? form.message : successMessage;
			return { type: 'success', message };
		}

		if (typeof form.message === 'string') {
			return { type: 'error', message: form.message };
		}

		if (form.errors && typeof form.errors === 'object') {
			const errors = form.errors as Record<string, string[] | undefined>;
			const first = Object.values(errors).flat().find(Boolean);
			if (first) return { type: 'error', message: first };
		}

		return null;
	});
</script>

{#if alert}
	<div class="alert alert-{alert.type}" role="alert">
		<span>{alert.message}</span>
	</div>
{/if}
