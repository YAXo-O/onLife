import { WithId } from '../utility/WithId';
import { Nullable } from '../utility/Nullable';
import { TrainingExercise } from './TrainingExercise';

export interface TrainingDay extends WithId {
	trainingId?: string;
	programDayId: string;
	time: Nullable<number>;

	exercises: Array<TrainingExercise>;
}
