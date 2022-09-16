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

export function logIn(email: string, password: string): Promise<User> {
	const service = new RequestManager('app/login/sign-in');

	return service.withBody({ email, password })
		.post<LoginResponse>()
		.then((response: LoginResponse) => response.client);
}

export function register(model: RegisterModel): Promise<User> {
	const service = new RequestManager('app/login/sign-up');

	return service.withBody(model).post<User>();
}

export function getUser(): Promise<User> {
	const service = new RequestManager('app/login');

	return service.get<User>();
}
