import { WithId } from '@app/objects/utility/WithId';
import { TrainingProgramType, TrainingProgram } from '@app/objects/program/TrainingProgram';
import { User } from '@app/objects/User';
import { Nullable } from '@app/objects/utility/Nullable';
import { TrainingBlock } from '@app/objects/training/TrainingBlock';

export interface Training extends WithId {
	name: string;
	description: string;
	type: TrainingProgramType;

	client: Nullable<User>;
	clientId: string;

	program: Nullable<TrainingProgram>;
	programId: string;

	blocks: Array<TrainingBlock>;

	time: Nullable<number>;
	created: number;
}
