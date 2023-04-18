import { Nullable } from '@app/objects/utility/Nullable';
import { WithId } from '@app/objects/utility/WithId';
import { OnlifeExercise, PowerTrainExercise } from '@app/objects/program/Exercise';

export enum TrainingProgramType
{
	Regular = 0, // Regular coach-guided training
	Marathon = 1, // A marathon training
}

export interface OnlifeExerciseRoundParams extends WithId {
	order: number;

	repeats: string;
	weight: string;
	interval: number;

	parent: Nullable<OnlifeExerciseRoundParams>;
	parentId: Nullable<string>;
	children: Nullable<Array<OnlifeExerciseRoundParams>>;
}

export interface OnlifeTrainingProgramDayExercise extends WithId {
	order: number;

	exercise: Nullable<OnlifeExercise>;
	exerciseId: string;

	trainingProgramDay: Nullable<OnlifeTrainingProgramDay>;
	trainingProgramDayId: string;

	parent: Nullable<OnlifeTrainingProgramDayExercise>;
	parentId: Nullable<string>;
	children: Nullable<Array<OnlifeTrainingProgramDayExercise>>;

	rounds: Array<OnlifeExerciseRoundParams>;
}

export interface OnlifeTrainingProgramDay extends WithId {
	name: string;
	description: string;

	trainingProgramBlock: Nullable<OnlifeTrainingProgramBlock>;
	trainingProgramBlockId: string;

	order: number;
	exercises: Array<OnlifeTrainingProgramDayExercise>;
}

export interface OnlifeTrainingProgramBlock extends WithId {
	order: number;
	description: string;

	trainingProgram: Nullable<OnlifeTrainingProgram>;
	trainingProgramId: string;

	days: Array<OnlifeTrainingProgramDay>;
}

export interface OnlifeTrainingProgram extends WithId {
	name: string;
	description: string;

	draft: boolean;
	createdDate: number;
	type: TrainingProgramType;

	blocks: Array<OnlifeTrainingProgramBlock>;
}

export enum PowerAppTrainingExerciseParamCode {
	Sets = 'sets',
	Reps = 'reps',
	Rest = 'rest',
	Weight = 'weight',
	Duration = 'time',
}

export interface PowerAppTrainingExerciseParams {
	code: PowerAppTrainingExerciseParamCode;
	number: string | number;
	active: boolean;
}

export interface PowerAppTrainingProgramDayExercise extends WithId {
	name: string;
	exercise_id: string;
	params: Array<PowerAppTrainingExerciseParams>;
	extended?: true;
	extendedParams?: Record<string, Record<PowerAppTrainingExerciseParamCode, { number: string } | undefined>>;
	superset?: {
		[PowerAppTrainingExerciseParamCode.Sets]?: string;
		[PowerAppTrainingExerciseParamCode.Reps]?: string;
		[PowerAppTrainingExerciseParamCode.Weight]?: string;
		[PowerAppTrainingExerciseParamCode.Rest]?: string;
	};
}

export interface PowerAppTrainingProgramDay extends WithId {
	name: string;
	weekday: number;

	exercises: Array<PowerAppTrainingProgramDayExercise>;
}

export interface PowerAppTrainingProgram extends WithId<number> {
	name: string;
	description: Nullable<string>;
	cycles: Nullable<number>;

	dirty: boolean;
	trainingDays: Array<PowerAppTrainingProgramDay>;
	exercises: Record<string, PowerTrainExercise>;
}

export class TrainingProgramDay implements WithId {
	private readonly source: PowerAppTrainingProgramDay;

	constructor(item: PowerAppTrainingProgramDay) {
		this.source = item;
	}

	public get id(): string {
		return this.source.id;
	}

	public get name(): string {
		return this.source.name;
	}

	public get description(): Nullable<string> {
		return null;
	}

	public get order(): number {
		return this.source.weekday;
	}
}

export class TrainingProgramBlock implements WithId {
	public readonly order: number;
	public readonly days: Array<TrainingProgramDay>;

	public constructor(order: number, days: Array<PowerAppTrainingProgramDay>) {
		this.order = order;
		this.days = days.map((item: PowerAppTrainingProgramDay) => new TrainingProgramDay(item));
	}

	public get id(): string {
		return this.order.toString();
	}

	public get description(): Nullable<string> {
		return null;
	}
}

export class TrainingProgram implements WithId {
	private readonly source: PowerAppTrainingProgram;
	public readonly blocks: Array<TrainingProgramBlock>;

	public constructor(item: PowerAppTrainingProgram) {
		this.source = item;

		const blocks: Array<TrainingProgramBlock> = [];
		const count = item.cycles ?? 1;
		for (let i = 0; i < count; i++) {
			blocks.push(new TrainingProgramBlock(i, item.trainingDays));
		}
		this.blocks = blocks;
	}

	public get id(): string {
		return this.source.id.toString();
	}

	public get name(): string {
		return this.source.name;
	}

	public get description(): Nullable<string> {
		return this.source.description;
	}
}
