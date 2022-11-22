import { Nullable } from '@app/objects/utility/Nullable';
import { Training } from '@app/objects/training/Training';

export interface CurrentTraining {
	block: Nullable<string>;
	day: Nullable<string>;

	training: Training;
}
