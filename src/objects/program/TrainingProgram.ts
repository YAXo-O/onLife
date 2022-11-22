import { Nullable } from '../utility/Nullable';
import { WithId } from '../utility/WithId';
import { Exercise } from './Exercise';

export enum TrainingProgramType
{
	Regular = 0, // Regular coach-guided training
	Marathon = 1, // A marathon training
}

export interface ExerciseRoundParams extends WithId {
	order: number;

	repeats: string;
	weight: string;
	interval: number;

	parent: Nullable<ExerciseRoundParams>;
	parentId: Nullable<string>;
	children: Nullable<Array<ExerciseRoundParams>>;
}

export interface TrainingProgramDayExercise extends WithId {
	order: number;

	exercise: Nullable<Exercise>;
	exerciseId: string;

	trainingProgramDay: Nullable<TrainingProgramDay>;
	trainingProgramDayId: string;

	parent: Nullable<TrainingProgramDayExercise>;
	parentId: Nullable<string>;
	children: Nullable<Array<TrainingProgramDayExercise>>;

	rounds: Array<ExerciseRoundParams>;
}

export interface TrainingProgramDay extends WithId {
	name: string;
	description: string;

	trainingProgramBlock: Nullable<TrainingProgramBlock>;
	trainingProgramBlockId: string;

	order: number;
	exercises: Array<TrainingProgramDayExercise>;
}

export interface TrainingProgramBlock extends WithId {
	order: number;
	description: string;

	trainingProgram: Nullable<TrainingProgram>;
	trainingProgramId: string;

	days: Array<TrainingProgramDay>;
}

export interface TrainingProgram extends WithId {
	name: string;
	description: string;

	draft: boolean;
	createdDate: number;
	type: TrainingProgramType;

	blocks: Array<TrainingProgramBlock>;
}
