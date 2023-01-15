import {
	PowerAppClient,
	PowerAppProfile,
	Gender,
	User, Client, OnlifeUser,
} from '@app/objects/User';
import { Nullable } from '@app/objects/utility/Nullable';
import moment from 'moment';

function getProfile(phone: string): PowerAppProfile {
	return {
		id: -1,
		age: false,
		height: false,
		weight: false,
		avatar: '',
		email: '',
		first_name: '',
		last_name: '',
		phone,
		sex: 'male',
	};
}

function toNumber(value: string | false): Nullable<number> {
	if (value === false) return null;

	const float = Number.parseFloat(value);
	if (Number.isNaN(float)) return null;

	return float;
}

function isOnlifeUser(item: PowerAppClient | OnlifeUser): item is OnlifeUser {
	return (item as OnlifeUser).id !== undefined;
}

function fromPowerAppClient(source: PowerAppClient): User {
	const profile = source.profiles[0] ?? getProfile(source.user?.phone);

	return {
		id: profile.id.toString(),
		phone: profile.phone,
		email: profile.email,

		firstName: profile.first_name,
		lastName: profile.last_name,
		fullName: '',

		gender: profile.sex === 'male' ? Gender.Male : Gender.Female,
		birthDate: null,
		age: toNumber(profile.age),

		height: toNumber(profile.height),
		weight: toNumber(profile.weight),
	};
}

function fromOnlifeUser(source: OnlifeUser): User {
	return {
		id: source.id,
		phone: source.phone,
		email: source.email,

		firstName: source.firstName,
		lastName: source.lastName,
		fullName: '',

		gender: source.gender,
		birthDate: source.birthDate,
		age: 0,

		height: source.height,
		weight: source.weight,
	};
}

export class UserAdaptor implements User {
	private readonly _age: Nullable<number>;
	public constructor (source: Client) {
		const value: User = isOnlifeUser(source) ? fromOnlifeUser(source) : fromPowerAppClient(source);

		this.id = value.id;
		this.phone = value.phone;
		this.email = value.email;

		this.firstName = value.firstName;
		this.lastName = value.lastName;

		this.gender = value.gender;
		this.birthDate = value.birthDate;

		this.height = value.height;
		this.weight = value.weight;
		this._age = value.age;
	}

	public readonly id: string;
	public readonly phone: string;
	public readonly email: string;

	public readonly firstName: string;
	public readonly lastName: string;
	public get fullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	public get age(): Nullable<number> {
		if (this.birthDate === null) return this._age;

		return moment(this.birthDate).diff(moment().utc().valueOf(), 'years');
	}
	public readonly birthDate: Nullable<number>;

	public readonly gender: Gender;
	public readonly height: Nullable<number>;
	public readonly weight: Nullable<number>;
}
