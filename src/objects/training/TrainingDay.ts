import { WithId } from '@app/objects/utility/WithId';
import { Nullable } from '@app/objects/utility/Nullable';
import { TrainingBlock } from '@app/objects/training/TrainingBlock';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';

export interface TrainingDay extends WithId {
	order: number;

	name: string;
	description: string;

	trainingBlock: Nullable<TrainingBlock>;
	trainingBlockId: string;

	exercises: Array<TrainingExercise>;

	time: Nullable<number>;
}
