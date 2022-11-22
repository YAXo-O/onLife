import { WithId } from '@app/objects/utility/WithId';
import { Nullable } from '@app/objects/utility/Nullable';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';

export interface TrainingRound extends WithId {
	order: number;

	repeats: string;
	weight: string;
	interval: number;

	exercise: Nullable<TrainingExercise>;
	exerciseId: string;

	parent: Nullable<TrainingRound>;
	parentId: Nullable<string>;
	children: Array<TrainingRound>;

	performedWeight: Nullable<number>;
	time: Nullable<number>;
}
