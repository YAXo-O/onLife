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

function isOnlifeUser(item: PowerAppClient | OnlifeUser): item is OnlifeUser {
	return (item as OnlifeUser).id !== undefined;
}

function toNumber(value: Nullable<string> | false): Nullable<number> {
	if (value === null || value === false) return null;

	const number = parseFloat(value);
	if (Number.isNaN(number)) return null;

	return number;
}

export class User implements WithId {
	private readonly source: PowerAppClient | OnlifeUser;

	public constructor(item: PowerAppClient | OnlifeUser) {
		this.source = item;
	}

	public get id(): string {
		return isOnlifeUser(this.source) ? this.source.id : this.source.profiles[0].id.toString();
	}
	public get phone(): string {
		return isOnlifeUser(this.source) ? this.source.phone : this.source.profiles[0].phone;
	}
	public get email(): string {
		return isOnlifeUser(this.source) ? this.source.email : this.source.profiles[0].email;
	}

	public get firstName(): string {
		return isOnlifeUser(this.source) ? this.source.firstName : this.source.profiles[0].first_name;
	}

	public get lastName(): string {
		return isOnlifeUser(this.source) ? this.source.lastName : this.source.profiles[0].last_name;
	}

	public get fullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	public get gender(): Gender {
		if (isOnlifeUser(this.source)) return this.source.gender;

		return this.source.profiles[0].sex === 'male' ? Gender.Male : Gender.Female;
	}
	public get birthDate(): Nullable<number> {
		return isOnlifeUser(this.source) ?  this.source.birthDate : null;
	}

	public get age(): Nullable<number> {
		if (isOnlifeUser(this.source)) {
			if (!this.source.birthDate) return null;

			return ((new Date()).getUTCFullYear() - (new Date(this.source.birthDate)).getUTCFullYear());
		}

		return toNumber(this.source.profiles[0].age);
	}

	public get height(): Nullable<number> {
		return isOnlifeUser(this.source) ? this.source.height : toNumber(this.source.profiles[0].height);
	}
	public get weight(): Nullable<number> {
		return isOnlifeUser(this.source) ? this.source.weight : toNumber(this.source.profiles[0].weight);
	}
}
