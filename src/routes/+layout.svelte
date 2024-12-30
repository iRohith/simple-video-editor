<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Simple Video Editor</title>
</svelte:head>

<ModeWatcher />
<Toaster richColors closeButton />
{@render children()}
