import { RequestManager, ResponseType } from '@app/services/Requests/RequestService';

interface RegisterModel {
	email: string;
	phone: string;
	password: string;

	firstName: string;
	lastName: string;
}

export function logIn(email: string, password: string): Promise<string> {
	const service = new RequestManager('login-email');

	return service.withBody({ email, password })
		.post<{ token: string }>()
		.then(q => q.token);
}


export function register(model: RegisterModel): Promise<string> {
	const service = new RequestManager('register-email')

	return service.withResponse(ResponseType.JSON)
		.withBody({
			'first_name': model.firstName,
			'last_name': model.lastName,
			phone: model.phone,
			email: model.email,
			password: model.password,
		})
		.post<{ token: string }>()
		.then(({ token }) => token);
}
