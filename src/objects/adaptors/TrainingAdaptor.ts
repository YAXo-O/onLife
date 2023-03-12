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
import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';
import { hasValue } from '@app/utils/value';

function convertExercise(item: PowerTrainExercise): OnlifeExercise {
	let audio: Nullable<string> = null;
	if (item.audio) {
		audio = `https://media.powertrain.app/audio/${item.audio.replace('media:audio/', '')}`;
	}

	return {
		id: item.id,
		name: item.name,
		details: item.intro ?? '',
		description: item.text ?? '',

		image: item.photo,
		schema: item.scheme,
		video: item.video?.url,
		audio,

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

function toFixed(value: string | number | unknown): Nullable<string> {
	if (typeof value === 'number') return value.toFixed(1);
	if (typeof value === 'string') return value;

	return null;
}

function getParamValue(params: Array<PowerAppTrainingExerciseParams>, code: PowerAppTrainingExerciseParamCode): Nullable<string> {
	const number = params.find((item: PowerAppTrainingExerciseParams) =>
		item.code === code && item.active
	)?.number;

	return toFixed(number);
}

function getParamNumberValue(params: Array<PowerAppTrainingExerciseParams>, code: PowerAppTrainingExerciseParamCode): Nullable<number> {
	return toInteger(getParamValue(params, code));
}

function getParamTimeValue(params: Array<PowerAppTrainingExerciseParams>, code: PowerAppTrainingExerciseParamCode): Nullable<number> {
	return toTime(getParamValue(params, code));
}

function getPerformedValue(round: PowerAppTrainingRound, code: PowerAppTrainingRoundParamCode): Nullable<number> {
	return round.params.find((item: PowerAppTrainingRoundParam) => item.code === code)?.value ?? null;
}

interface TrainingRoundProgramValues {
	repeats: string;
	weight: string;
	interval: number;
}

function getProgramValues(exercise: PowerAppTrainingProgramDayExercise, setId: number): TrainingRoundProgramValues {
	const params = {
		repeats: getParamValue(exercise.params, PowerAppTrainingExerciseParamCode.Reps) ?? '',
		weight: getParamValue(exercise.params, PowerAppTrainingExerciseParamCode.Weight) ?? '',
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

	const weight = toFixed(obj[PowerAppTrainingExerciseParamCode.Weight]?.number);
	if (weight) {
		params.weight = weight;
	}

	const interval = toTime(obj[PowerAppTrainingExerciseParamCode.Rest]?.number);
	if (interval !== null) {
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

	const list = params.filter((item: PowerAppTrainingRound) => item.exerciseId === exercise.id);
	return Array(count).fill(null)
		.map<PowerAppTrainingRound>((_, index: number) => {
			const completed = list.find((round: PowerAppTrainingRound) => round.setId === index);
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

			performedWeight: getPerformedValue(round, PowerAppTrainingRoundParamCode.Weight), // Get this value from session (if any)
			performedRepeats: getPerformedValue(round, PowerAppTrainingRoundParamCode.Repeats),
			time: round.start ? round.start * 1000 : null,

			/* Sets, Weight and Interval (from program) */
			...getProgramValues(exercise, round.setId),
		}))
}

function getSession(sessions: Array<PowerAppSession>, day: PowerAppTrainingProgramDay, cycle: string): PowerAppSession {
	let session = sessions.find((s: PowerAppSession) => s.day_id === day.id);
	if (!session) {
		session = {
			id: uuid.v4().toString(),

			created_at: null,
			start: null,

			program_id: 0,
			day_id: day.id,
			cycle,

			status: 0,
			items: day.exercises.map((item: PowerAppTrainingProgramDayExercise) => ({
				id: item.id,
				exerciseId: item.exercise_id,
				setId: 0,
				start: null,
				comment: false,
				params: [],
			})),
		}
	}

	return session;
}

function createDays(
	sessions: Array<PowerAppSession>,
	program: PowerAppTrainingProgram,
	blockId: string,
): Array<OnlifeTrainingDay> {
	const result: Array<OnlifeTrainingDay> = [];

	const cycles = program.cycles ?? 1;
	for (let cycle = 0; cycle < cycles; cycle++) {
		const sCycle = cycle.toString();
		const trainings = sessions.filter(q => q.cycle === sCycle);

		program.trainingDays.forEach((day: PowerAppTrainingProgramDay) => {
			const session = getSession(trainings, day, sCycle);

			const item: OnlifeTrainingDay = {
				id: session.id,
				name: day.name,
				description: '',
				order: 0,
				cycle: sCycle,

				trainingBlock: null,
				trainingBlockId: blockId,
				trainingDayId: session.day_id,
				time: session.start ? session.start * 1000 : null,
				exercises: day.exercises.map<TrainingExercise>((exercise: PowerAppTrainingProgramDayExercise, order: number) => ({
					id: exercise.id,
					order,

					exerciseId: exercise.exercise_id,
					exercise: null,

					parent: null,
					parentId: null,
					children: [],

					rounds: mergeRounds(session!.items, exercise, exercise.id),

					trainingDay: null,
					trainingDayId: '',

					time: null,
				})),
			};
			result.push(item);
		});
	}

	result.forEach((item: OnlifeTrainingDay, order: number) => (item.order = order));

	return result;
}

function createBlock(
	sessions: Array<PowerAppSession>,
	program: PowerAppTrainingProgram,
): OnlifeTrainingBlock {
	const blockId = program.id.toString();

	return {
		id: blockId,
		description: program.name,

		available: false,
		days: createDays(sessions, program, blockId),
		order: 0,
		time: null,
		training: null,
		trainingId: '',
	};
}

function fillExercises(block: OnlifeTrainingBlock, reference: Record<string, OnlifeExercise>): OnlifeTrainingBlock {
	block.days.forEach((day: OnlifeTrainingDay) => {
		day.exercises.forEach((exercise: TrainingExercise) => {
			if (exercise.exerciseId === null) return;

			exercise.exercise = reference[exercise.exerciseId] ?? null;
		})
	});

	return block;
}

function mergeBlocks(
	sessions: Array<PowerAppSession>,
	programs: Array<PowerAppTrainingProgram>,
	trainingId: string,
): Array<OnlifeTrainingBlock> {
	const exercises: Record<string, OnlifeExercise> = {};
	programs.forEach((program: PowerAppTrainingProgram) => {
		Object.values(program.exercises).forEach((item: PowerTrainExercise) => {
			if (exercises[item.id]) return;

			exercises[item.id] = convertExercise(item);
		});
	})

	return programs.map((program: PowerAppTrainingProgram, index: number) => {
		const block = createBlock(sessions.filter((session: PowerAppSession) => session.program_id === program.id), program);

		block.trainingId = trainingId;
		block.order = index;
		fillExercises(block, exercises);

		return block;
	});
}

interface Source {
	sessions: Array<PowerAppSession>;
	programs: Array<PowerAppTrainingProgram>;
}

function isSource(item: Source | OnlifeTraining): item is Source {
	return (item as Source).programs !== undefined && (item as Source).sessions !== undefined;
}

export class TrainingAdaptor implements OnlifeTraining {
	/**
	 * 	updateTimings - update times (when round, exercise, day, block, training) were completed
	 *	updates only missing values i.e. if value is present from server - nothing is updated
	 * @private
	 */
	private updateTimings(): void {
		this.blocks.forEach((block: OnlifeTrainingBlock) => {
			block.days.forEach((day: OnlifeTrainingDay) => {
				day.exercises.map((exercise: TrainingExercise) => {
					if (hasValue(exercise.time)) return;

					const time = Math.max.apply(null, exercise.rounds.map((round: TrainingRound) => round.time ?? Infinity));
					exercise.time = time !== Infinity ? time : null;
				});

				if (hasValue(day.time)) return;

				const time = Math.max.apply(null, day.exercises.map((exercise: TrainingExercise) => exercise.time ?? Infinity))
				day.time = time !== Infinity ? time : null;
			});

			if (hasValue(block.time)) return;

			const time = Math.max.apply(null, block.days.map((day: OnlifeTrainingDay) => day.time ?? Infinity));
			block.time = time !== Infinity ? time : null;
		});

		if (hasValue(this.time)) return;

		const time = Math.max.apply(null, this.blocks.map((block: OnlifeTrainingBlock) => block.time ?? Infinity));
		this.time = time !== Infinity ? time : null;
	}

	private updateAvailable(): void {
		const index = this.blocks.findIndex((block: OnlifeTrainingBlock) => block.time === null);
		if (index < 0) return;

		for (let i = 0; i <= index; i++) {
			this.blocks[i].available = true;
		}
	}

	public constructor(source: Source | OnlifeTraining) {
		if (isSource(source)) {
			this.id = uuid.v4().toString();
			this.name = 'Тренировка';
			this.description = '';
			this.type = TrainingProgramType.Regular;

			this.created = new Date().valueOf();
			this.time = null; // This is the time when training is completed

			this.client = null
			this.clientId = '';

			this.program = null;
			this.programId = '';

			this.blocks = mergeBlocks(
				source.sessions,
				source.programs,
				this.id,
			);
		} else {
			this.id = source.id;
			this.name = source.name;

			this.description = source.description;
			this.type = source.type;
			this.created = source.created;
			this.time = source.time;

			this.client = source.client;
			this.clientId = source.clientId;

			this.program = source.program;
			this.programId = source.programId;

			this.blocks = source.blocks;
		}

		this.updateTimings();
		this.updateAvailable();
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
