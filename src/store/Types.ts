import { Nullable } from '@app/objects/utility/Nullable';
import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';

export interface CurrentTraining {
	block: Nullable<string>;
	day: Nullable<string>;

	active: Nullable<OnlifeTrainingDay>;
}
