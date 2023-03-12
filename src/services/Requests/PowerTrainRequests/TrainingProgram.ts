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

function getProgram(wrapper: ProgramWrapper): Nullable<PowerAppTrainingProgram> {
	const value = wrapper.programs.find(({ isCurrent }) => isCurrent);
	if (!value) return null;

	return {
		...value.program,
		id: value.id,
	};
}

function getSessions(wrapper: SessionWrapper, programId: number): Array<PowerAppSession> {
	const list =  wrapper.sessions ?? [];

	return list.filter((item: PowerAppSession) => item.program_id === programId);
}

export async function getTraining(userId: string): Promise<Nullable<OnlifeTraining>> {
	try {
		const programWrapper = await new RequestManager(`profile/${userId}/programs`)
			.get<ProgramWrapper>();
		const program = getProgram(programWrapper);
		if (!program) return null;

		const sessionWrapper = await new RequestManager(`profile/${userId}/sessions`)
			.get<SessionWrapper>();
		const sessions = getSessions(sessionWrapper, program.id);

		return new TrainingAdaptor({ sessions, program });
	} catch (e) {
		console.warn('Failed to get trainings: ', e);
		throw new Error('Training request failed');
	}
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

