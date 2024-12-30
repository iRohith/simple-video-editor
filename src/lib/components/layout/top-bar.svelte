<script lang="ts" module>
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem } from '$lib/components/ui/select';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { TooltipButton } from '$lib/components/ui/tooltip-button';
	import { dataStore } from '$lib/store/store.svelte';
	import { cn } from '$lib/utils';
	import { Select as SelectPrimitive } from 'bits-ui';
	import {
		ArrowLeftRight,
		ChevronDown,
		Download,
		Moon,
		Redo2,
		Save,
		Settings,
		Sun,
		Undo2
	} from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	import { toast } from 'svelte-sonner';
	import { superForm, superValidate } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { Button, buttonVariants } from '../ui/button';
	import * as Dialog1 from '../ui/dialog';
	import * as Drawer1 from '../ui/drawer';
	import * as Tooltip from '../ui/tooltip';

	const CompositionFormSchema = z.object({
		name: z
			.string()
			.min(3, 'Project name must be at least 3 characters long')
			.max(32, 'Project name cannot exceed 32 characters')
			.regex(
				/^(?!.*[<>:"\/\\|?*])(?!^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$)[^\/\0]{1,255}$/,
				'Invalid project name'
			)
			.default('Untitled'),
		size: z
			.object({
				width: z
					.number()
					.int('Width must be an integer')
					.multipleOf(2, 'Width must be a multiple of 2')
					.min(128, 'Width must be greater than 128px')
					.max(2048, 'Width must be less than 2048px')
					.default(1920),
				height: z
					.number()
					.int('Height must be an integer')
					.multipleOf(2, 'Height must be a multiple of 2')
					.min(128, 'Height must be greater than 128px')
					.max(2048, 'Height must be less than 2048px')
					.default(1080)
			})
			.required()
			.default({
				width: 1920,
				height: 1080
			}),
		fps: z.union([z.literal('24'), z.literal('30'), z.literal('60')]).default('30'),
		duration: z
			.object({
				minutes: z
					.number()
					.int('Minutes must be an integer')
					.min(0, 'Minutes must be positive')
					.max(10, 'Max 10 minutes')
					.default(5),
				seconds: z
					.number()
					.int('Seconds must be an integer')
					.min(0, 'Seconds must be positive')
					.max(600, 'Max 10 minutes')
					.default(0)
			})
			.refine((data) => data.minutes * 60 + data.seconds <= 600, {
				message: 'Max 10 minutes',
				path: ['minutes', 'seconds']
			})
			.default({
				minutes: 5,
				seconds: 0
			})
	});

	const data = await superValidate(zod(CompositionFormSchema));

	const STANDARD_RESOLUTIONS = [
		{ w: 1920, h: 1080, rw: 16, rh: 9 },
		{ w: 1280, h: 720, rw: 16, rh: 9 },
		{ w: 1024, h: 768, rw: 4, rh: 3 },
		{ w: 1600, h: 1200, rw: 4, rh: 3 }
	] as const;
</script>

<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';
	import { CompositionSchema } from '$lib/types';
	import { z } from 'zod';

	let isMobile: boolean = $state(false);
	let Dialog = $derived(isMobile ? Drawer1 : Dialog1);

	const checkMobile = () => {
		isMobile = window.innerWidth <= 768;
	};

	$effect(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	let settingsOpen = $state(false);

	const form = superForm(data, {
		validators: zodClient(CompositionFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, constraints } = form;

	$effect(() => {
		if (!settingsOpen) {
			formData.set({
				name: dataStore.composition.name,
				fps: dataStore.composition.fps.toString() as any,
				size: {
					width: dataStore.composition.width,
					height: dataStore.composition.height
				},
				duration: {
					minutes: Math.floor((dataStore.composition.duration % 3600) / 60),
					seconds: Math.floor(dataStore.composition.duration % 60)
				}
			});
		}
	});

	async function handleProjectSettingsSubmit(_: any) {
		const finalData = CompositionSchema.safeParse({
			name: $formData.name,
			width: $formData.size.width,
			height: $formData.size.height,
			fps: parseInt($formData.fps),
			duration: $formData.duration.minutes * 60 + $formData.duration.seconds
		});

		if (finalData.success) {
			dataStore.composition = finalData.data;
			settingsOpen = false;
			$formData.duration = {
				minutes: Math.floor((dataStore.composition.duration % 3600) / 60),
				seconds: Math.floor(dataStore.composition.duration % 60)
			};
		} else {
			toast.error('Invalid settings', {
				description: finalData.error.errors.map((e) => e.message).join('\n')
			});
		}
	}
</script>

<div class="relative flex h-12 w-full items-center border-b">
	<div class="absolute left-4 space-x-1">
		<Tooltip.Provider>
			<TooltipButton variant="outline" size="icon" tooltip="Save">
				<Save className="h-4 w-4" />
			</TooltipButton>

			<TooltipButton variant="outline" size="icon" tooltip="Download">
				<Download className="h-4 w-4" />
			</TooltipButton>

			<TooltipButton variant="outline" size="icon" tooltip="Undo">
				<Undo2 className="h-4 w-4" />
			</TooltipButton>

			<TooltipButton variant="outline" size="icon" tooltip="Redo">
				<Redo2 className="h-4 w-4" />
			</TooltipButton>
		</Tooltip.Provider>
	</div>

	<div class="absolute left-1/2 -translate-x-1/2 transform">
		<div class="flex items-center gap-1">
			<div class={cn(buttonVariants({ variant: 'outline' }), 'pointer-events-none')}>
				{dataStore.composition.name}
			</div>

			<Tooltip.Provider ignoreNonKeyboardFocus>
				<TooltipButton
					variant="outline"
					size="icon"
					tooltip="Project Settings"
					onclick={() => (settingsOpen = true)}
				>
					<Settings />
				</TooltipButton>
			</Tooltip.Provider>

			<Dialog.Root bind:open={settingsOpen} onOpenChange={(v) => (settingsOpen = v)} controlledOpen>
				<Dialog.Content class="mx-auto p-4 sm:max-w-[450px]">
					<Dialog.Header>
						<Dialog.Title>Project Settings</Dialog.Title>
					</Dialog.Header>

					<form method="dialog" use:enhance onsubmit={handleProjectSettingsSubmit}>
						<Form.Field {form} name="name">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Project Name</Form.Label>
									<Input
										{...props}
										{...$constraints.name}
										pattern={undefined}
										bind:value={$formData.name}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Fieldset {form} name="size">
							<Form.Legend>Resolution</Form.Legend>
							<div class="flex items-center gap-2">
								<Form.Control>
									{#snippet children({ props })}
										<Input
											{...props}
											{...$constraints.size?.width}
											bind:value={$formData.size.width}
											placeholder="Width"
											inputmode="numeric"
											type="number"
										/>
									{/snippet}
								</Form.Control>
								<Button
									variant="ghost"
									size="icon"
									class="ml-auto"
									onclick={() => {
										const w = $formData.size.width;
										const h = $formData.size.height;
										$formData.size.width = h;
										$formData.size.height = w;
									}}
								>
									<ArrowLeftRight />
								</Button>
								<Form.Control>
									{#snippet children({ props })}
										<Input
											{...props}
											{...$constraints.size?.height}
											bind:value={$formData.size.height}
											placeholder="Height"
											inputmode="numeric"
											type="number"
										/>
									{/snippet}
								</Form.Control>

								<Select
									type="single"
									value={`${$formData.size.width}x${$formData.size.height}`}
									onValueChange={(value) => {
										const [w, h] = value.split('x');
										$formData.size.width = parseInt(w);
										$formData.size.height = parseInt(h);
									}}
								>
									<SelectPrimitive.Trigger>
										<ChevronDown className="h-4 w-4 opacity-50" />
									</SelectPrimitive.Trigger>
									<SelectContent>
										<Separator />
										{#each STANDARD_RESOLUTIONS as R (`${R.w}x${R.h}`)}
											<SelectItem value={`${R.w}x${R.h}`}>
												<span>{`${R.w}x${R.h}`}</span>
												<span class="ml-auto">{`(${R.rw}:${R.rh})`}</span>
											</SelectItem>
										{/each}
									</SelectContent>
								</Select>
							</div>
							<Form.FieldErrors />
						</Form.Fieldset>

						<Form.Fieldset {form} name="duration">
							<Form.Legend>Duration</Form.Legend>
							<Form.Control>
								{#snippet children({ props })}
									<div class="flex flex-row items-baseline gap-2" {...props}>
										<Input
											bind:value={$formData.duration.minutes}
											placeholder="Minutes"
											inputmode="numeric"
											type="number"
										/>
										<span>m</span>
										<Input
											bind:value={$formData.duration.seconds}
											placeholder="Seconds"
											inputmode="numeric"
											type="number"
										/>
										<span>s</span>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Fieldset>

						<Form.Fieldset {form} name="fps">
							<div class="flex flex-row items-baseline">
								<Form.Legend>FPS :</Form.Legend>
								<Form.Control>
									{#snippet children({ props })}
										<ToggleGroup
											{...props}
											{...$constraints.fps}
											class="ml-8"
											type="single"
											value={$formData.fps.toString()}
											onValueChange={(v) => ($formData.fps = parseInt(v) as any)}
										>
											<ToggleGroupItem value="24">24</ToggleGroupItem>
											<ToggleGroupItem value="30">30</ToggleGroupItem>
											<ToggleGroupItem value="60">60</ToggleGroupItem>
										</ToggleGroup>
									{/snippet}
								</Form.Control>
							</div>
							<Form.FieldErrors />
						</Form.Fieldset>

						<Dialog.Footer>
							<Form.Button>Save</Form.Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>

	<div class="absolute right-4">
		<Tooltip.Provider>
			<TooltipButton onclick={toggleMode} variant="outline" size="icon" tooltip="Toggle theme">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</TooltipButton>
		</Tooltip.Provider>
	</div>
</div>
