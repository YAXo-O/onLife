import { Nullable } from '@app/objects/utility/Nullable';
import { TrainingDay } from '@app/objects/training/TrainingDay';

export interface CurrentTraining {
	block: Nullable<string>;
	day: Nullable<string>;

	active: Nullable<TrainingDay>;
}
