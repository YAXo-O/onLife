import { User } from '@app/objects/User';
import { RequestManager, ResponseType } from '@app/services/Requests/RequestService';
import { Training } from '@app/objects/training/Training';
import { Nullable } from '@app/objects/utility/Nullable';
import { OrderService } from '@app/services/Utilities/OrderService';
import { TrainingRound } from '@app/objects/training/TrainingRound';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';

export interface LoginResponse {
	client: User;
	training: Training;
}

interface RegisterModel {
	email: string;
	phone: string;
	password: string;

	firstName: string;
	lastName: string;
}

function order(program: Nullable<Training>): Nullable<Training> {
	if (!program) return null;

	program.blocks = OrderService.sort(program.blocks, 20);
	console.log(program.blocks[0].days[0].exercises.map((item: TrainingExercise) => ({ order: item.order, exercise: item.exercise?.name ?? '-' })));
	console.log(program.blocks[0].days[0].exercises[0].rounds.map((item: TrainingRound) => ({ order: item.order, repeats: item.repeats })));

	return program;
}

export function logIn(email: string, password: string): Promise<LoginResponse> {
	const service = new RequestManager('app/login/sign-in');

	return service.withBody({ email, password })
		.post<LoginResponse>()
		.then((response: LoginResponse) => {
			order(response.client?.training);

			return response;
		});
}

export function register(model: RegisterModel): Promise<void> {
	const service = new RequestManager('app/login/sign-up');

	return service.withResponse(ResponseType.None)
		.withBody(model)
		.post<void>();
}

export function getUser(): Promise<User> {
	const service = new RequestManager('app/login');

	return service.get<User>()
		.then((item: User) => {
			order(item?.training);

			return item;
		});
}

export function removeUser(): Promise<void> {
	const service = new RequestManager('app/login');

	return service.delete();
}
