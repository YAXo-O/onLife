import * as React from 'react';
import {
	View,
	FlatList,
	StyleSheet,
	StyleProp,
	ViewStyle,
	ListRenderItemInfo,
	Text, TextInput,
} from 'react-native';

import { TrainingProgramDayExercise } from '@app/objects/program/TrainingProgram';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { TrainingRound } from '@app/objects/training/TrainingRound';
import { typography } from '@app/styles/typography';
import { palette } from '@app/styles/palette';

interface OwnProps {
	style?: StyleProp<ViewStyle>;

	value: TrainingExercise;
	reference: TrainingProgramDayExercise;
}

export const SetCollection: React.FC<OwnProps> = (props: OwnProps) => {
	const render = (item: ListRenderItemInfo<TrainingRound>) => {
		return (
			<View style={styles.card}>
				<Text style={[typography.label, { color: '#000' }]}>SET {item.index + 1}</Text>
				<View style={styles.row}>
					<Text style={[typography.text, { color: '#777b79', fontSize: 14, lineHeight: 18 }]}>Повторения   </Text>
					<TextInput style={styles.input} />
					<Text style={[typography.text, { textAlign: 'left', color: '#000', fontSize: 14, lineHeight: 18 }]}>раз</Text>
				</View>
				<View style={[styles.row, { marginTop: 4 }]}>
					<View style={{ flexDirection: 'column' }}>
						<Text style={[typography.text, { borderStyle: 'solid', color: '#e2958c', fontSize: 14, lineHeight: 18 }]}>
							Выполненный
						</Text>
						<Text style={[typography.text, { borderStyle: 'solid', color: '#e2958c', fontSize: 14, lineHeight: 18 }]}>
							вес
						</Text>
					</View>
					<TextInput style={styles.input} />
					<Text style={[typography.text, { textAlign: 'left', color: '#000', fontSize: 14, lineHeight: 18 }]}>kg</Text>
				</View>
			</View>
		);
	};

	return (
		<View style={props.style}>
			<FlatList
				style={styles.container}
				data={props.value.rounds}
				renderItem={render}
				keyExtractor={(item: TrainingRound) => item.id}
				horizontal
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: -6,
	},
	card: {
		paddingVertical: 18,
		paddingHorizontal: 9,
		margin: 6,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderStyle: 'solid',
		borderRadius: 4,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	input: {
		backgroundColor: '#e7e7e7',
		height: 32,
		borderRadius: 4,
		minWidth: 64,
		marginHorizontal: 16,
		paddingHorizontal: 4,
		paddingVertical: 2,
	},
});
