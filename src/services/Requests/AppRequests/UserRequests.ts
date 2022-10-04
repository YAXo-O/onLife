import { User, Gender } from '../../../objects/User';
import { RequestManager } from '../RequestService';
import { Training } from '../../../objects/training/Training';
import {
	TrainingProgram,
	TrainingProgramDay,
	TrainingProgramDayExercise
} from '../../../objects/program/TrainingProgram';
import { Nullable } from '../../../objects/utility/Nullable';

export interface LoginResponse {
	client: User;
	training: Training;
}

interface RegisterModel {
	email: string;
	password: string;

	firstName: string;
	lastName: string;

	height: number;
	weight: number;

	gender: Gender;
	birthDate: number;
}

interface IWithOrder {
	order: number;
}

function sortDays(a: TrainingProgramDay, b: TrainingProgramDay): number {
	if (a.cycle !== b.cycle) return a.cycle - b.cycle;

	return a.order - b.order;
}

function sort(a: IWithOrder, b: IWithOrder): number {
	return a.order - b.order;
}

function order(program: Nullable<TrainingProgram>): Nullable<TrainingProgram> {
	if (program?.days) {
		program.days.sort(sortDays);
		program.days.forEach((day: TrainingProgramDay) => {
			day.exercises.sort(sort);
			day.exercises.forEach((exc: TrainingProgramDayExercise) => {
				exc.rounds.sort(sort);
			});
		});
	}

	return program;
}

export function logIn(email: string, password: string): Promise<LoginResponse> {
	const service = new RequestManager('app/login/sign-in');

	return service.withBody({ email, password })
		.post<LoginResponse>()
		.then((response: LoginResponse) => {
			console.log('Response: ', response);

			order(response.client.trainingProgram);

			return response;
		});
}

export function register(model: RegisterModel): Promise<User> {
	const service = new RequestManager('app/login/sign-up');

	return service.withBody(model).post<User>();
}

export function getUser(): Promise<User> {
	const service = new RequestManager('app/login');

	return service.get<User>();
}

export function removeUser(): Promise<void> {
	const service = new RequestManager('app/login');

	return service.delete();
}
