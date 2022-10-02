import { WithId } from '../utility/WithId';
import { TrainingRound } from './TrainingRound';
import { Nullable } from '../utility/Nullable';

export interface TrainingExercise extends WithId {
	exerciseId: string;
	time: Nullable<number>;
	rounds: Array<TrainingRound>;
}
