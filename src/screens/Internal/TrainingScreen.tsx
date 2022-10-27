import * as React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { palette } from '@app/styles/palette';
import { ExerciseCollection } from '@app/components/collections/exercises/ExerciseCollection';
import { typography } from '@app/styles/typography';
import { getTrainingMock } from '@app/objects/mocks/training';
import { trainingProgramMock } from '@app/objects/mocks/program';
import { ExerciseDetails } from '@app/components/cards/exercise/ExerciseDetails';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { TrainingProgramDayExercise } from '@app/objects/program/TrainingProgram';
import { SetCollection } from '@app/components/collections/sets/SetCollection';

const program = trainingProgramMock;
const training = getTrainingMock(program);

export const TrainingScreen: React.FC = () => {
	const [exercise, setExercise] = React.useState<string>(() => training.days[0].exercises[0].id);

	const value = training.days[0].exercises.find((item: TrainingExercise) => item.id === exercise)!;
	const reference = program.days[0].exercises.find((item: TrainingProgramDayExercise) => item.id === value.exerciseId)!;

	return (
		<ScrollView style={styles.container} contentContainerStyle={{ flex: 1 }}>
			<ExerciseCollection
				style={styles.collection}
				title={<Text style={[styles.title, typography.label]}>Упражнения</Text>}
				list={training.days[0].exercises}
				value={exercise}
				onChange={setExercise}
			/>
			<ExerciseDetails
				value={value}
				reference={reference}
			>
				<SetCollection
					value={value}
					reference={reference}
				/>
			</ExerciseDetails>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: palette.cyan['100'],
	},
	collection: {
		marginTop: 24,
		marginBottom: 20,
		marginLeft: 20,
	},
	title: {
		color: palette.cyan['0'],
	},
});
