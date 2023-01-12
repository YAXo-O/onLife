import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { OnlifeTrainingProgramDayExercise } from '@app/objects/program/TrainingProgram';
import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';

interface OwnProps {
	value: TrainingExercise;
	reference: OnlifeTrainingProgramDayExercise;

	children: React.ReactNode;
}

export const ExerciseDetails: React.FC<OwnProps> = (props: OwnProps) => {
	return (
		<View style={styles.container}>
			<View style={styles.row}><View style={styles.bar} /></View>
			<Text style={[typography.title, { fontSize: 20, lineHeight: 24, }, { color: '#000' }]}>
				{props.reference.exercise?.name ?? 'Упражнение'}
			</Text>
			{props.children}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	bar: {
		height: 3,
		width: 64,
		backgroundColor: palette.white['50'],
		borderRadius: 2,
		marginBottom: 16,
	},
	container: {
		backgroundColor: palette.white['100'],
		borderTopRightRadius: 16,
		borderTopLeftRadius: 16,
		paddingVertical: 10,
		paddingHorizontal: 20,
		flex: 1,
	},
});
