import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { RequestManager } from '@app/services/Requests/RequestService';

export function completeDay(day: OnlifeTrainingDay): Promise<OnlifeTrainingDay> {
	const service = new RequestManager('app/training');

	day.exercises.forEach((q: TrainingExercise) => {
		if (q.time === null) {
			if (q.rounds.some(q => q.time === null)) {
				q.time = +(new Date());
			} else {
				q.time = q.rounds.map(q => q.time).sort((a, b) => b! - a!)[0];
			}
		}
	});

	return service.withBody(day)
		.post<OnlifeTrainingDay>();
}
