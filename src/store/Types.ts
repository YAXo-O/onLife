import { Training } from '../objects/training/Training';

export interface CurrentTraining {
	cycle: number;
	day: string;

	training: Training;
}
