import { WithId } from '@app/objects/utility/WithId';
import { Nullable } from '@app/objects/utility/Nullable';
import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';
import { OnlifeTraining } from '@app/objects/training/Training';

export interface OnlifeTrainingBlock extends WithId {
	order: number;
	description: string;

	training: Nullable<OnlifeTraining>;
	trainingId: string;

	days: Array<OnlifeTrainingDay>;
	available: boolean;

	time: Nullable<number>;
}
