import { WithId } from './utility/WithId';
import { Nullable } from './utility/Nullable';
import { TrainingProgram } from './program/TrainingProgram';

export enum Gender {
	Male = 0,
	Female = 1,
}

export interface User extends WithId {
	firstName: string;
	lastName: string;

	gender: Gender;
	birthDate: number;

	phone: string;
	email: string;

	height: number;
	weight: number;

	trainingProgramId: Nullable<string>;
	trainingProgram: Nullable<TrainingProgram>;
}
