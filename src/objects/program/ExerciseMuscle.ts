import { WithId } from '@app/objects/utility/WithId';
import { Muscle } from '@app/objects/program/Muscle';
import { OnlifeExercise } from '@app/objects/program/Exercise';

export enum RelationType {
	Main = 0,
	Assistance = 1
}

export interface ExerciseMuscle extends WithId {
	exercise: OnlifeExercise;
	exerciseId: string;

	muscle: Muscle;
	muscleId: string;

	muscleType: RelationType;
}
