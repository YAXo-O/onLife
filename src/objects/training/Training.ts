import { WithId } from '@app/objects/utility/WithId';
import { TrainingProgramType, OnlifeTrainingProgram } from '@app/objects/program/TrainingProgram';
import { User } from '@app/objects/User';
import { Nullable } from '@app/objects/utility/Nullable';
import { OnlifeTrainingBlock } from '@app/objects/training/TrainingBlock';
import { PowerAppTrainingRound } from '@app/objects/training/TrainingRound';

export interface OnlifeTraining extends WithId {
	name: string;
	description: string;
	type: TrainingProgramType;

	client: Nullable<User>;
	clientId: string;

	program: Nullable<OnlifeTrainingProgram>;
	programId: string;

	blocks: Array<OnlifeTrainingBlock>;

	time: Nullable<number>;
	created: number;
}

// One session contains data of single training day
export interface PowerAppSession extends WithId {
	created_at: Nullable<string>; // When training was started, a string in format of YYYY-MM-DDTHH:mm:ss:msZ
	start: Nullable<number>; // When first set of first exercise was started, in seconds since epoch

	program_id: number;
	day_id: string;
	cycle: string;

	status: number;
	items: Array<PowerAppTrainingRound>;
}
