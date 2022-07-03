import { WithId } from '../utility/WithId';
import { Exercise } from './Exercise';
import { Muscle } from './Muscle';

export enum RelationType {
	Main = 0,
	Assistance = 1
}

export interface ExerciseMuscle extends WithId {
	exercise: Exercise;
	exerciseId: string;

	muscle: Muscle;
	muscleId: string;

	muscleType: RelationType;
}
