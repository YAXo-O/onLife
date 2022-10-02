import { User, Gender } from '../../../objects/User';
import { RequestManager } from '../RequestService';
import { Training } from '../../../objects/training/Training';

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

export function logIn(email: string, password: string): Promise<LoginResponse> {
	const service = new RequestManager('app/login/sign-in');

	return service.withBody({ email, password })
		.post<LoginResponse>();
}

export function register(model: RegisterModel): Promise<User> {
	const service = new RequestManager('app/login/sign-up');

	return service.withBody(model).post<User>();
}

export function getUser(): Promise<User> {
	const service = new RequestManager('app/login');

	return service.get<User>();
}
