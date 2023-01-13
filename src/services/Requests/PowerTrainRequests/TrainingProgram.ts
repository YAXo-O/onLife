import { PowerAppTrainingProgram } from '@app/objects/program/TrainingProgram';
import { RequestManager } from '@app/services/Requests/RequestService';
import { Nullable } from '@app/objects/utility/Nullable';
import { OnlifeTraining, PowerAppSession } from '@app/objects/training/Training';
import { TrainingAdaptor } from '@app/objects/adaptors/TrainingAdaptor';

interface ProgramWrapper {
	programs: Array<{
		program: PowerAppTrainingProgram,
		id: number,
		isCurrent?: boolean,
	}>;
}

interface SessionWrapper {
	sessions: Array<PowerAppSession>;
}

export async function getTraining(userId: string): Promise<Nullable<OnlifeTraining>> {
	const program = await new RequestManager(`profile/${userId}/programs`)
		.get<ProgramWrapper>()
		.then((wrap: ProgramWrapper) => {
			const value = wrap.programs.find(({ isCurrent }) => isCurrent);
			if (!value) return null;

			return {
				...value.program,
				id: value.id,
			};
		});
	const sessions = await new RequestManager(`profile/${userId}/sessions`)
		.get<SessionWrapper>()
		.then((item: SessionWrapper) => item.sessions ?? []);

	if (!program) return null;

	return new TrainingAdaptor(sessions, program);
}

interface SaveSessionWrapper {
	sessions: Array<PowerAppSession>;
}

interface SaveSessionResult {
	success: number;
}

export function saveTraining(userId: number, session: PowerAppSession): Promise<void> {
	return new RequestManager(`profile/${userId}/sessions`)
		.withBody<SaveSessionWrapper>({ sessions: [session] })
		.post<SaveSessionResult>()
		.then((result: SaveSessionResult) => {
			if (!result.success) throw new Error('Не удалось завершить тренировку');
		})
}

