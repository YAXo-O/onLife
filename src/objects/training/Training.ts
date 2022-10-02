import { WithId } from '../utility/WithId';
import { Nullable } from '../utility/Nullable';
import { TrainingDay } from './TrainingDay';

export interface Training extends WithId {
	programId: string;
	time: Nullable<number>;

	days: Array<TrainingDay>;
}
