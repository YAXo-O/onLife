import { WithId } from './utility/WithId';
import { Nullable } from './utility/Nullable';
import { OnlifeTrainingProgram } from './program/TrainingProgram';
import { OnlifeTraining } from '@app/objects/training/Training';

export enum Gender {
	Male = 0,
	Female = 1,
}

export interface OnlifeUser extends WithId {
	firstName: string;
	lastName: string;

	gender: Gender;
	birthDate: number;

	phone: string;
	email: string;

	height: number;
	weight: number;

	trainingProgramId: Nullable<string>;
	trainingProgram: Nullable<OnlifeTrainingProgram>;

	training: Nullable<OnlifeTraining>;
	trainingId: Nullable<string>;
}

export interface PowerAppUser extends WithId<number> {
	phone: string;
	push_token: string;
}

export interface PowerAppProfile extends WithId<number> {
	email: string;
	phone: string;

	avatar: string;
	first_name: string;
	last_name: string;
	sex: string;

	height: string | false;
	weight: string | false;
	age: string | false;
}

export interface PowerAppClient {
	user: PowerAppUser;
	profiles: Array<PowerAppProfile>;
}

export type Client = PowerAppClient | OnlifeUser;

export interface User extends WithId {
	id: string;
	phone: string;
	email: string;

	firstName: string;

	lastName: string;
	fullName: string;

	gender: Gender;
	birthDate: Nullable<number>;
	age: Nullable<number>;

	height: Nullable<number>;
	weight: Nullable<number>;
}
