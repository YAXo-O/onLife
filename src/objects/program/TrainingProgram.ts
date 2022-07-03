import { Nullable } from '../utility/Nullable';
import { WithId } from '../utility/WithId';
import { Exercise } from './Exercise';

export interface TrainingProgramDay extends WithId {
	name: string;
	description: string;

	trainingProgram: Nullable<TrainingProgram>;
	trainingProgramId: string;

	order: number;
	cycle: number;

	exercises: Array<TrainingProgramDayExercise>;
}

export enum ExerciseRoundType {
	Regular = 0,
	DropSet = 1,
}

export interface ExerciseRoundParams extends WithId {
	order: number;

	repeats: string;
	weight: string;
	interval: number;

	type: ExerciseRoundType;
}

export interface TrainingProgramDayExercise extends WithId {
	order: number;

	exercise: Nullable<Exercise>;
	exerciseId: string;

	trainingProgramDay: Nullable<TrainingProgramDay>;
	trainingProgramDayId: string;

	isSuperset: boolean;
	rounds: Array<ExerciseRoundParams>;
}

export interface TrainingProgram extends WithId {
	name: string;
	description: string;

	draft: boolean;
	cycles: number;

	createdDate: number;
	days: Array<TrainingProgramDay>;
}
