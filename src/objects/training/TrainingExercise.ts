import { WithId } from '@app/objects/utility/WithId';
import { Nullable } from '@app/objects/utility/Nullable';
import { OnlifeExercise } from '@app/objects/program/Exercise';
import { TrainingRound } from '@app/objects/training/TrainingRound';
import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';

export interface TrainingExercise extends WithId {
	order: number;

	exercise: Nullable<OnlifeExercise>;
	exerciseId: Nullable<string>;

	parent: Nullable<TrainingExercise>;
	parentId: Nullable<string>;
	children: Array<TrainingExercise>;

	rounds: Array<TrainingRound>;

	trainingDay: Nullable<OnlifeTrainingDay>;
	trainingDayId: string;

	time: Nullable<number>;
}
