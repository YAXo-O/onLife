import { WithId } from '@app/objects/utility/WithId';
import { Nullable } from '@app/objects/utility/Nullable';
import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';
import { OnlifeTraining } from '@app/objects/training/Training';

export enum OnlifeTrainingBlockStatus {
	Completed = 0,
	Available = 1,
	Locked = 2,
}

export interface OnlifeTrainingBlock extends WithId {
	order: number;
	description: string;

	training: Nullable<OnlifeTraining>;
	trainingId: string;

	days: Array<OnlifeTrainingDay>;
	// This field comes from server - if user can train this block or not
	available: boolean;
	// This field is calculated locally
	status: OnlifeTrainingBlockStatus;

	time: Nullable<number>;
}
