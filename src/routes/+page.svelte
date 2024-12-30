<script lang="ts">
	import LeftSideBar from '$lib/components/layout/left-side-bar.svelte';
	import StatusBar from '$lib/components/layout/status-bar.svelte';
	import TopBar from '$lib/components/layout/top-bar.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
</script>

<div class="flex h-screen w-screen flex-1 flex-col">
	<TopBar />
	<main class="h-full w-full">
		<Resizable.PaneGroup direction="vertical">
			<Resizable.Pane minSize={50}>
				<Resizable.PaneGroup direction="horizontal">
					<Resizable.Pane defaultSize={15} minSize={15} maxSize={25}>
						<LeftSideBar />
					</Resizable.Pane>
					<Resizable.Handle />
					<Resizable.Pane minSize={50}>Editor</Resizable.Pane>
					<Resizable.Handle />
					<Resizable.Pane defaultSize={15} minSize={15} maxSize={25}>Rightsidebar</Resizable.Pane>
				</Resizable.PaneGroup>
			</Resizable.Pane>
			<Resizable.Handle />
			<Resizable.Pane minSize={10} defaultSize={30}>Timeline</Resizable.Pane>
		</Resizable.PaneGroup>
	</main>
	<StatusBar />
</div>
