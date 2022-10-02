import { WithId } from '../utility/WithId';
import { Nullable } from '../utility/Nullable';

export interface TrainingRound extends WithId {
	roundParamsId: string;
	weight: Nullable<number>;
	time: Nullable<number>;
}
