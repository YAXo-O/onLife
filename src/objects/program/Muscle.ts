import { WithId } from '../utility/WithId';
import { Nullable } from '../utility/Nullable';

export interface Muscle extends WithId {
	name: string;
	description: string;

	group: Nullable<MuscleGroup>;
	groupId: string;
}

export interface MuscleGroup extends WithId {
	name: string;
	description: string;
}
