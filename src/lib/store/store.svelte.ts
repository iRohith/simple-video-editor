import {
	DataSchema,
	MediaStateSchema,
	WorkspaceStateSchema,
	type Data,
	type MediaState,
	type WorkspaceState
} from '$lib/types';

export const dataStore: Data = $state(DataSchema.parse({}));
export const mediaStore: MediaState = $state(MediaStateSchema.parse({}));
export const workspaceStore: WorkspaceState = $state(WorkspaceStateSchema.parse({}));
