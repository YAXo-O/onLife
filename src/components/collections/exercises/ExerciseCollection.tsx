import * as React from 'react';
import {
	View,
	FlatList,
	Text,
	StyleSheet,
	StyleProp,
	ViewStyle,
	ListRenderItemInfo, TouchableOpacity
} from 'react-native';

import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';

interface OwnProps {
	style?: StyleProp<ViewStyle>;
	title: React.ReactNode;

	list: Array<TrainingExercise>;

	value: string;
	onChange: (value: string) => void;
}

export const ExerciseCollection: React.FC<OwnProps> = (props: OwnProps) => {
	const render = ({ item, index }: ListRenderItemInfo<TrainingExercise>) => {
		return (
			<TouchableOpacity
				style={[styles.card, item.id === props.value ? styles.cardActive : null]}
				onPress={() => props.onChange(item.id)}
			>
				<Text
					style={[
						typography.subtitle,
						{ fontSize: 24, lineHeight: 30 },
						item.id === props.value ? styles.textActive : styles.text
					]}
				>
					{index + 1}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={props.style}>
			{props.title}
			<FlatList
				data={props.list}
				renderItem={render}
				keyExtractor={item => item.id}
				horizontal
				style={styles.container}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: -8,
	},
	card: {
		backgroundColor: palette.cyan['60'],
		borderRadius: 4,
		padding: 4,
		margin: 8,
		height: 64,
		width: 64,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cardActive: {
		backgroundColor: palette.white['100'],
	},
	text: {
		color: palette.white['100'],
	},
	textActive: {
		color: palette.cyan['60'],
	},
});
