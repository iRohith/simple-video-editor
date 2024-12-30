<script lang="ts">
	import { dataStore } from '$lib/store/store.svelte';
	const composition = $derived(dataStore.composition);

	function formatDuration(seconds: number) {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	}
</script>

<div class="flex h-6 items-center justify-between border-t px-4 text-xs text-muted-foreground">
	<div>Project: {composition.name}</div>
	<div>Duration: {formatDuration(composition.duration)}</div>
	<div>Resolution: {composition.width}x{composition.height}</div>
	<div>FPS: {composition.fps}</div>
</div>
