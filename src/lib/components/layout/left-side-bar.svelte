<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
</script>

<div class="w-full border-r bg-background">
	<Tabs value="elements" class="h-full">
		<TabsList class="w-full justify-start rounded-none border-b">
			<TabsTrigger value="elements">Elements</TabsTrigger>
			<TabsTrigger value="media">Media</TabsTrigger>
			<TabsTrigger value="settings">Settings</TabsTrigger>
		</TabsList>
		<TabsContent value="elements" class="m-0 h-[calc(100%-41px)]">
			<!-- {/* <ElementsTab /> */} -->
		</TabsContent>
		<TabsContent value="media" class="m-0 h-[calc(100%-41px)]">
			<!-- <MediaTab /> -->
		</TabsContent>
		<TabsContent value="settings" class="m-0 h-[calc(100%-41px)]">
			<!-- {/* <SettingsTab /> */} -->
		</TabsContent>
	</Tabs>
</div>
