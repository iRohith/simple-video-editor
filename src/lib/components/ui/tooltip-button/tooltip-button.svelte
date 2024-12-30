<script lang="ts">
	import { cn } from '$lib/utils';
	import type { TooltipTriggerProps } from 'bits-ui';
	import { buttonVariants, type ButtonSize, type ButtonVariant } from '../button';
	import * as Tooltip from '../tooltip';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		type = 'button',
		tooltip,
		children,
		...restProps
	}: TooltipTriggerProps & {
		tooltip: string;
		variant?: ButtonVariant;
		size?: ButtonSize;
	} = $props();
</script>

<Tooltip.Root>
	<Tooltip.Trigger class={cn(buttonVariants({ variant, size }), className)} {type} {...restProps}>
		{@render children?.()}
	</Tooltip.Trigger>
	<Tooltip.Content>
		{tooltip}
	</Tooltip.Content>
</Tooltip.Root>
