import uuid from 'react-native-uuid';

import { Training } from '@app/objects/training/Training';
import {
	TrainingProgram,
	TrainingProgramDay,
	TrainingProgramDayExercise,
	ExerciseRoundParams
} from '@app/objects/program/TrainingProgram';
import { TrainingDay } from '@app/objects/training/TrainingDay';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { TrainingRound } from '@app/objects/training/TrainingRound';
import { trainingProgramMock } from '@app/objects/mocks/program';

export function getTrainingMock(program: TrainingProgram = trainingProgramMock): Training {
	const result: Training = {
		id: uuid.v4().toString(),

		days: [],
		programId: program.id,
		time: null,
	};

	result.days = program.days.map((item: TrainingProgramDay) => {
		const day: TrainingDay = {
			id: uuid.v4().toString(),
			programDayId: item.id,
			time: null,
			trainingId: result.id,

			exercises: item.exercises.map((e: TrainingProgramDayExercise) => {
				const exercise: TrainingExercise = {
					id: uuid.v4().toString(),
					exerciseId: e.id,
					rounds: e.rounds.map((r: ExerciseRoundParams) => {
						const round: TrainingRound = {
							id: uuid.v4().toString(),
							roundParamsId: r.id,
							weight: null,
							time: null,
						};

						return round;
					}),
					time: null,
				};

				return exercise;
			}),
		};

		return day;
	});

	return result;
}
