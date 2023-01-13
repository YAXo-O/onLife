import uuid from 'react-native-uuid';

import moment from 'moment';

import { OnlifeTraining, PowerAppSession } from '@app/objects/training/Training';
import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';
import { Nullable } from '@app/objects/utility/Nullable';
import {
	PowerAppTrainingRound,
	TrainingRound,
	PowerAppTrainingRoundParamCode
} from '@app/objects/training/TrainingRound';
import { OnlifeTrainingBlock } from '@app/objects/training/TrainingBlock';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';

export class SessionAdaptor implements PowerAppSession {
	public constructor(training: OnlifeTraining, block: OnlifeTrainingBlock, day: OnlifeTrainingDay) {
		this.id = uuid.v4().toString();
		this.created_at = moment().format('YYYY-MM-DD[T]HH:mm:ss:SSSSSS[Z]');

		const index = training.blocks.findIndex((q: OnlifeTrainingBlock) => q.id === block.id) ?? 0;
		this.cycle = index.toString();
		this.day_id = day.trainingDayId;
		this.program_id = Number.parseInt(training.programId);
		this.status = 1;

		this.start = Math.min.apply(
			null,
			day.exercises.map((item: TrainingExercise) =>
				Math.min.apply(
					null,
					item.rounds
						.map((round: TrainingRound) => round.time)
						.filter((time: Nullable<number>) => time) as Array<number>,
				)
			)
		);
		if (this.start) {
			this.start /= 1000;
		}

		this.items = [];
		day.exercises.forEach((exercise: TrainingExercise) => {
			exercise.rounds.forEach((round: TrainingRound) => {
				this.items.push({
					id: round.id,
					exerciseId: round.exerciseId,
					setId: round.order,
					start: round.time ? round.time / 1000 : null,
					comment: false,
					params: [{
						code: PowerAppTrainingRoundParamCode.Weight,
						value: round.performedWeight ?? 0,
					}],
				});
			});
		});
	}

	public id: string;
	public created_at: Nullable<string>;
	public cycle: string;
	public day_id: string;
	public items: Array<PowerAppTrainingRound>;
	public program_id: number;
	public start: Nullable<number>;
	public status: number;
}
