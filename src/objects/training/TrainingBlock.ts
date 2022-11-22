import { WithId } from '@app/objects/utility/WithId';
import { Training } from '@app/objects/training/Training';
import { Nullable } from '@app/objects/utility/Nullable';
import { TrainingDay } from '@app/objects/training/TrainingDay';

export interface TrainingBlock extends WithId {
	order: number;
	description: string;

	training: Nullable<Training>;
	trainingId: string;

	days: Array<TrainingDay>;
	available: boolean;

	time: Nullable<number>;
}
