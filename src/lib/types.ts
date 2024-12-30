import { z } from 'zod';

export const ElementTypeSchema = z.enum(['video', 'image', 'audio', 'text', 'shape']);

export const MediaItemSchema = z.object({
	id: z.string().uuid('Invalid ID'),
	name: z.string(),
	type: z.enum(['image', 'video', 'audio']),
	url: z.string().url('Invalid URL'),
	width: z
		.number()
		.int('Width must be an integer')
		.min(128, 'Width must be atleast 128px')
		.max(2048, 'Width must not exceed 2048px')
		.optional(),
	height: z
		.number()
		.int('Height must be an integer')
		.min(128, 'Height must be atleast 128px')
		.max(2048, 'Height must not exceed 2048px')
		.optional(),
	duration: z.number().optional(),
	createdAt: z.date()
});

export const WorkspaceStateSchema = z
	.object({
		selectedElementId: z.string().uuid('Invalid ID').nullable().default(null),
		zoom: z.number().min(10, 'Minimum zoom 10%').max(500, 'Maximum zoom 500%').default(100)
	})
	.default({});

export const BaseElementSchema = z.object({
	id: z.string().uuid('Invalid ID'),
	name: z.string().nonempty('Project name cannot be empty'),
	type: ElementTypeSchema,
	startTime: z
		.number()
		.min(0, 'Start time must be greater than 0')
		.max(600, 'Start time must be less than 600 seconds')
		.default(0),
	duration: z
		.number()
		.min(10, 'Duration must be greater than 10 seconds')
		.max(600, 'Duration must be less than 600 seconds'),
	enabled: z.boolean().default(true),
	content: z.string().nullable().optional()
});

export const VisualElementSchema = BaseElementSchema.extend({
	x: z.number(),
	y: z.number(),
	width: z
		.number()
		.min(1, 'Width must be greater than 0')
		.max(2048, 'Width must be less than 2048'),
	height: z
		.number()
		.min(1, 'Height must be greater than 0')
		.max(2048, 'Height must be less than 2048'),
	rotation: z
		.number()
		.min(0, 'Rotation must be greater than 0')
		.max(360, 'Rotation must be less than 360'),
	opacity: z
		.number()
		.min(0, 'Opacity must be greater than 0')
		.max(1, 'Opacity must be less than 1')
		.default(1),
	lockAspectRatio: z.boolean().default(true)
});

export const LayerSchema = z.object({
	id: z.string().uuid('Invalid ID'),
	name: z.string().nonempty('Layer name cannot be empty'),
	enabled: z.boolean().default(true)
});

export const CompositionSchema = z
	.object({
		name: z
			.string()
			.min(3, 'Project name must be at least 3 characters long')
			.max(32, 'Project name cannot exceed 32 characters')
			.regex(
				/^(?!.*[<>:"\/\\|?*])(?!^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$)[^\/\0]{1,255}$/,
				'Invalid project name'
			)
			.default('Untitled'),
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
			.default(1080),
		fps: z.union([z.literal(24), z.literal(30), z.literal(60)]).default(30),
		duration: z
			.number()
			.min(10, 'Duration must be greater than 10 seconds')
			.max(600, 'Duration must be less than 10 minutes or 600 seconds')
			.default(300)
	})
	.default({});

export const DEFAULT_LAYER = '00000000-0000-0000-0000-000000000000';

export const DataSchema = z.object({
	elements: z.record(BaseElementSchema.or(VisualElementSchema)).default({}),
	layers: z.record(LayerSchema).default({
		default: {
			id: DEFAULT_LAYER,
			name: 'Layer 1',
			enabled: true
		}
	}),
	elementsToLayers: z.record(z.string()).default({}),
	layersToElements: z.record(z.array(z.string())).default({ default: [] }),
	layersOrder: z.array(z.string()).default([DEFAULT_LAYER]),
	composition: CompositionSchema
});

export const MediaStateSchema = z.object({
	items: z.array(MediaItemSchema).default([])
});

export type WorkspaceState = z.infer<typeof WorkspaceStateSchema>;
export type MediaItem = z.infer<typeof MediaItemSchema>;
export type MediaState = z.infer<typeof MediaStateSchema>;
export type ElementType = z.infer<typeof ElementTypeSchema>;
export type BaseElement = z.infer<typeof BaseElementSchema>;
export type VisualElement = z.infer<typeof VisualElementSchema>;
export type Layer = z.infer<typeof LayerSchema>;
export type Composition = z.infer<typeof CompositionSchema>;
export type Data = z.infer<typeof DataSchema>;
