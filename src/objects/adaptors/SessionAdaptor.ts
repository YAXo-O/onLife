import uuid from 'react-native-uuid';

import moment from 'moment';

import { OnlifeTraining, PowerAppSession } from '@app/objects/training/Training';
import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';
import { Nullable } from '@app/objects/utility/Nullable';
import {
	PowerAppTrainingRound,
	TrainingRound,
	PowerAppTrainingRoundParamCode,
	PowerAppTrainingRoundParam
} from '@app/objects/training/TrainingRound';
import { OnlifeTrainingBlock } from '@app/objects/training/TrainingBlock';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { hasValue } from '@app/utils/value';

function getParams(round: TrainingRound): Nullable<Array<PowerAppTrainingRoundParam>> {
	const params: Array<PowerAppTrainingRoundParam> = [];

	if (hasValue(round.performedWeight)) {
		params.push({
			code: PowerAppTrainingRoundParamCode.Weight,
			value: round.performedWeight!,
		});
	}

	if (hasValue(round.performedRepeats)) {
		params.push({
			code: PowerAppTrainingRoundParamCode.Repeats,
			value: round.performedRepeats!,
		});
	}

	if (params.length === 0) return null;

	return params;
}

export class SessionAdaptor implements PowerAppSession {
	public constructor(training: OnlifeTraining, block: OnlifeTrainingBlock, day: OnlifeTrainingDay) {
		this.id = uuid.v4().toString();
		this.created_at = moment().format('YYYY-MM-DD[T]HH:mm:ss:SSSSSS[Z]');

		this.cycle = day.cycle;
		this.day_id = day.trainingDayId;
		this.program_id = Number.parseInt(block.id);
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

		const stamp = moment().unix(); // If some property has no time - set same time for everything
		if (this.start !== Infinity) {
			this.start /= 1000;
		} else {
			this.start = stamp;
		}

		this.items = [];
		day.exercises.forEach((exercise: TrainingExercise) => {
			exercise.rounds.forEach((round: TrainingRound) => {
				const params = getParams(round);
				if (params === null) return;

				this.items.push({
					id: round.id,
					exerciseId: round.exerciseId,
					setId: round.order,
					start: round.time ? round.time / 1000 : stamp,
					comment: false,
					params,
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

	public toString(): string {
		const items = this.items.map((item: PowerAppTrainingRound) => `
		--- [id]: ${item.id}
		--- [exerciseId]: ${item.exerciseId}
		--- [setId]: ${item.setId}
		--- [comment]: ${item.comment}
		--- [start]: ${item.start}
		--- [params]: ${item.params}
		------
		`).join('\n\r');

		return `
		id: ${this.id}
		created_at: ${this.created_at}
		cycle: ${this.cycle}
		day_id: ${this.day_id}
		program_id: ${this.program_id}
		start: ${this.start}
		status: ${this.status}
		items:
		${items}
		`;
	}
}
