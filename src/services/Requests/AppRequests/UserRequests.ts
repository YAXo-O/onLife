import { User } from '@app/objects/User';
import { RequestManager, ResponseType } from '@app/services/Requests/RequestService';
import { Training } from '@app/objects/training/Training';
import { Nullable } from '@app/objects/utility/Nullable';
import { OrderService } from '@app/services/Utilities/OrderService';
import { TrainingRound } from '@app/objects/training/TrainingRound';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';
import { now } from '@app/utils/datetime';

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

interface CompleteRoundMessage {
	id: string;
	weight: Nullable<number>;
	time: number;
}

interface CompleteExerciseMessage {
	id: string;
	time: number;

	rounds: Array<CompleteRoundMessage>;
}

interface CompleteDayMessage {
	id: string;
	exercises: Array<CompleteExerciseMessage>;
}

export function toCompleteMessage(day: OnlifeTrainingDay): CompleteDayMessage {
	return {
		id: day.id,
		exercises: day.exercises.map<CompleteExerciseMessage>((exc: TrainingExercise) => ({
			id: exc.id,
			time: exc.time ?? now(),
			rounds: exc.rounds.map<CompleteRoundMessage>((round: TrainingRound) => ({
				id: round.id,
				weight: round.performedWeight,
				time: round.time ?? now(),
			})),
		}))
	};
}

export function completeTraining(model: OnlifeTrainingDay): Promise<OnlifeTrainingDay> {
	const service = new RequestManager('app/training');

	return service.withBody(toCompleteMessage(model))
		.post<OnlifeTrainingDay>();
}
