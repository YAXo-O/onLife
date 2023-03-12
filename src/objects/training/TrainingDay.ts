import { WithId } from '@app/objects/utility/WithId';
import { Nullable } from '@app/objects/utility/Nullable';
import { OnlifeTrainingBlock } from '@app/objects/training/TrainingBlock';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';

export interface OnlifeTrainingDay extends WithId {
	order: number;
	cycle: string;

	name: string;
	description: string;

	trainingBlock: Nullable<OnlifeTrainingBlock>;
	trainingBlockId: string;

	trainingDayId: string;

	exercises: Array<TrainingExercise>;

	time: Nullable<number>;
}

export interface PowerAppTrainingDay extends WithId {
	created_at: string;
	program_id: number;
	day_id: string;
	cycle: string;
	status: number;
	start: number;
}
