import { User, Gender } from '../../../objects/User';
import { RequestManager } from '../RequestService';

interface LoginResponse {
	client: User;
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

export function logIn(login: string, password: string): Promise<User> {
	const service = new RequestManager('app/login/sign-in');

	return service.withBody({ login, password })
		.post<LoginResponse>()
		.then((response: LoginResponse) => response.client);
}

export function register(model: RegisterModel): Promise<User> {
	const service = new RequestManager('app/login/sign-up');

	return service.withBody(model).post<User>();
}
