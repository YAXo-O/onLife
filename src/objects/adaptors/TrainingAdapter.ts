import uuid from 'react-native-uuid';

import { OnlifeTraining, PowerAppSession } from '@app/objects/training/Training';
import {
	PowerAppTrainingProgram,
	TrainingProgramType,
	OnlifeTrainingProgram,
	PowerAppTrainingProgramDay,
	PowerAppTrainingProgramDayExercise,
	PowerAppTrainingExerciseParams,
	PowerAppTrainingExerciseParamCode,
} from '@app/objects/program/TrainingProgram';
import { Nullable } from '@app/objects/utility/Nullable';
import { OnlifeTrainingBlock } from '@app/objects/training/TrainingBlock';
import { User } from '@app/objects/User';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { PowerTrainExercise, OnlifeExercise } from '@app/objects/program/Exercise';
import {
	TrainingRound,
	PowerAppTrainingRound,
	PowerAppTrainingRoundParam,
	PowerAppTrainingRoundParamCode
} from '@app/objects/training/TrainingRound';

function convertExercise(item: PowerTrainExercise): OnlifeExercise {
	return {
		id: item.id,
		name: item.name,
		details: item.intro ?? '',
		description: item.text ?? '',

		image: item.photo,
		schema: item.scheme,
		video: item.video?.url,
		audio: null,

		properties: 0,
		muscles: [],
	};
}

function toInteger(str: Nullable<string> | undefined): Nullable<number> {
	if (!str) return null;

	const value = Number.parseInt(str, 10);
	if (Number.isNaN(value)) return null;

	return value;
}

function toTime(str: Nullable<string> | undefined): Nullable<number> {
	if (!str) return null;

	const value = str.split(':');
	if (value.length !== 2) return null;

	const minutes = toInteger(value[0]);
	const seconds = toInteger(value[1]);

	if (minutes === null || seconds === null) return null;

	return minutes * 60 + seconds;
}

function getParamValue(params: Array<PowerAppTrainingExerciseParams>, code: PowerAppTrainingExerciseParamCode): Nullable<string> {
	return params.find((item: PowerAppTrainingExerciseParams) =>
		item.code === code && item.active
	)?.number ?? null;
}

function getParamNumberValue(params: Array<PowerAppTrainingExerciseParams>, code: PowerAppTrainingExerciseParamCode): Nullable<number> {
	return toInteger(getParamValue(params, code));
}

function getParamTimeValue(params: Array<PowerAppTrainingExerciseParams>, code: PowerAppTrainingExerciseParamCode): Nullable<number> {
	return toTime(getParamValue(params, code));
}

function getPerformedValue(round: PowerAppTrainingRound): Nullable<number> {
	return round.params.find((item: PowerAppTrainingRoundParam) => item.code === PowerAppTrainingRoundParamCode.Weight)?.value ?? null;
}

interface TrainingRoundProgramValues {
	repeats: string;
	weight: string;
	interval: number;
}

function getProgramValues(exercise: PowerAppTrainingProgramDayExercise, setId: number): TrainingRoundProgramValues {
	const params = {
		repeats: getParamValue(exercise.params, PowerAppTrainingExerciseParamCode.Reps) ?? '-',
		weight: getParamValue(exercise.params, PowerAppTrainingExerciseParamCode.Weight) ?? '-',
		interval: getParamTimeValue(exercise.params, PowerAppTrainingExerciseParamCode.Rest) ?? 60,
	};

	const obj = exercise.extendedParams?.[setId.toString()];
	if (!exercise.extended || !exercise.extendedParams || !obj) {
		return params;
	}

	const repeats = obj[PowerAppTrainingExerciseParamCode.Reps]?.number;
	if (repeats) {
		params.repeats = repeats;
	}

	const weight = obj[PowerAppTrainingExerciseParamCode.Weight]?.number;
	if (weight) {
		params.weight = weight;
	}

	const interval = toInteger(obj[PowerAppTrainingExerciseParamCode.Rest]?.number);
	if (interval || interval === 0) {
		params.interval = interval;
	}

	return params;
}

function getSetsCount(exercise: PowerAppTrainingProgramDayExercise): number {
	const superset = toInteger(exercise.superset?.[PowerAppTrainingExerciseParamCode.Sets]);
	if (superset) return superset;

	return getParamNumberValue(exercise.params, PowerAppTrainingExerciseParamCode.Sets) ?? 0;
}

function mergeRounds(
	params: Array<PowerAppTrainingRound>,
	exercise: PowerAppTrainingProgramDayExercise,
	exerciseId: string,
): Array<TrainingRound> {
	const count = getSetsCount(exercise);
	if (count === 0) return [];

	return Array(count).fill(null)
		.map<PowerAppTrainingRound>((_, index: number) => {
			const completed = params.find((round: PowerAppTrainingRound) => round.setId === index);
			if (completed) return completed;

			return {
				id: uuid.v4().toString(),
				exerciseId,
				setId: index,
				start: null,
				comment: false,
				params: [],
			};
		})
		.map<TrainingRound>((round: PowerAppTrainingRound) => ({
			id: round.id,
			order: round.setId,


			exercise: null,
			exerciseId: exercise.id,

			parent: null,
			parentId: null,
			children: [],

			performedWeight: getPerformedValue(round), // Get this value from session (if any)
			time: round.start,

			/* Sets, Weight and Interval (from program) */
			...getProgramValues(exercise, round.setId),
		}));
}

function mergeBlocks(sessions: Array<PowerAppSession>, program: PowerAppTrainingProgram): Array<OnlifeTrainingBlock> {
	const cycles = program.cycles ?? 1;
	const days = program.trainingDays ?? [];
	const exercises: Record<string, OnlifeExercise> = Object.values(program.exercises)
		.reduce((res: Record<string, OnlifeExercise>, cur: PowerTrainExercise) => {
			res[cur.id] = convertExercise(cur);

			return res;
		}, {});
	const blocks: Array<OnlifeTrainingBlock> = [];

	for (let i = 0; i < cycles; i++) {
		const block: OnlifeTrainingBlock = {
			id: uuid.v4().toString(),
			order: i,
			description: '',

			training: null,
			trainingId: '',

			days: [],
			available: i === 0 || blocks[i - 1].time !== null,

			time: null,
		};
		const cycle = i.toString();
		const trainings = sessions.filter((training: PowerAppSession) => training.cycle === cycle);

		block.days = days.map<{ session: PowerAppSession, day: PowerAppTrainingProgramDay }>((day: PowerAppTrainingProgramDay) => {
			let session = trainings.find((q: PowerAppSession) => q.day_id === day.id);
			if (session) return { session, day };

			return {
				session: {
					id: uuid.v4().toString(),

					created_at: null,
					start: null,

					program_id: 0,
					day_id: day.id,
					cycle,

					status: 0,
					items: day.exercises.map((item: PowerAppTrainingProgramDayExercise) => ({
						id: uuid.v4().toString(),
						exerciseId: item.id,
						setId: 0,
						start: null,
						comment: false,
						params: [],
					})),
				},
				day,
			}
		}).map(({ session, day }) => ({
			id: session.id,
			order: day.weekday - 1,
			name: day.name,
			description: '',

			trainingBlock: null,
			trainingBlockId: block.id,

			exercises: day.exercises.map<TrainingExercise>((exercise: PowerAppTrainingProgramDayExercise, order: number) => {
				const id = uuid.v4().toString();

				return {
					id,
					order,

					exerciseId: exercise.exercise_id,
					exercise: exercises[exercise.exercise_id] ?? null,

					parent: null,
					parentId: null,
					children: [],

					rounds: mergeRounds(session.items, exercise, id),

					trainingDay: null,
					trainingDayId: '',

					time: null,
				}
			}),
			time: null,
		}));
		blocks.push(block);
	}

	return blocks;
}

export class TrainingAdapter implements OnlifeTraining {
	public constructor(sessions: Array<PowerAppSession>, program: PowerAppTrainingProgram) {
		this.id = uuid.v4().toString();
		this.name = program.name;
		this.description = program.description ?? '';
		this.type = TrainingProgramType.Regular;

		this.created = new Date().valueOf();
		this.time = null; // This is the time when training is completed

		this.client = null
		this.clientId = '';
		this.program = null;
		this.programId = '';

		this.blocks = mergeBlocks(sessions.filter((item: PowerAppSession) => item.program_id === program.id), program);
	}

	public id: string;
	public name: string;
	public description: string;

	public blocks: Array<OnlifeTrainingBlock>;
	public client: Nullable<User>;
	public clientId: string;
	public created: number;
	public program: Nullable<OnlifeTrainingProgram>;
	public programId: string;
	public time: Nullable<number>;
	public type: TrainingProgramType;
}
