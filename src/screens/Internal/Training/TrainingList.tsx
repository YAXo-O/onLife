import * as React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { IState } from '../../../store/IState';
import {
	TrainingProgramDay,
	TrainingProgramDayExercise,
	ExerciseRoundParams
} from '../../../objects/program/TrainingProgram';
import { Nullable } from '../../../objects/utility/Nullable';
import { ExerciseCard } from '../../../components/cards/exercise/ExerciseCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CurrentTrainingExercise, CurrentTrainingRound } from '../../../store/Types';
import { LocalActionCreators } from '../../../store/LocalState/ActionCreators';

type Props = NativeStackScreenProps<never>;

export const TrainingList: React.FC<Props> = (props: Props) => {
	const selection = useSelector((state: IState) => state.training);
	const user = useSelector((state: IState) => state.user);
	const day = React.useMemo<Nullable<TrainingProgramDay>>(() => {
		const day = selection.item?.day;
		if (day === null) return null;

		return user.item?.trainingProgram?.days.find((item: TrainingProgramDay) => item.id === day) ?? null;
	}, [user.item?.trainingProgram, selection.item?.day]);
	const dispatch = useDispatch();

	const complete = () => {
		const list: Array<CurrentTrainingExercise> = selection.item?.exercises ?? [];
		let completed = list.length === day?.exercises.length;

		for (let i = 0; i < list.length && completed; i++) {
			const completedRounds: Array<CurrentTrainingRound> = list[i].rounds;
			const rounds: Array<ExerciseRoundParams> = day?.exercises[i].rounds ?? [];
			completed = completed && (rounds.length === completedRounds.length);

			for (let j = 0; j < completedRounds.length && completed; j++) {
				if (completedRounds[j].timestamp === undefined) {
					completed = false;
				}
			}
		}

		function finish() {
			// update redux
			// make request to server
			const actions = new LocalActionCreators('training')
			dispatch(actions.set({ timestamp: +(new Date()), }));
			props.navigation.pop();
		}

		if (!completed) {
			Alert.alert(
				'Завершение тренировки',
				'В текущей тренировке есть невыполненные упражениня. Вы уверены, что хотите завершить тренировку?',
				[
					{
						text: 'Отмена',
						style: 'cancel',
					},
					{
						text: 'Завершить',
						onPress: finish,
					},
				],
			);
		} else {
			finish();
		}
	};

	return (
		<View style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContainer}
			>
				<View style={styles.listContainer}>
					{
						day?.exercises?.map((item: TrainingProgramDayExercise, id: number) => (
							<ExerciseCard
								order={id}
								exercise={item}
								key={item.id}
								style={id > 0 ? styles.sibling : undefined}
							/>
						))
					}
				</View>
			</ScrollView>
			<View
				style={styles.actionContainer}
			>
				<TouchableOpacity onPress={complete}>
					<Text style={styles.action}>
						Завершить тренировку
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	scrollContainer: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingTop: 8,
		paddingBottom: 54,
	},
	listContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		paddingHorizontal: 8,
	},
	sibling: {
		marginTop: 4,
	},
	actionContainer: {
		flex: 1,
		position: 'absolute',
		backgroundColor: 'white',
		left: 0,
		right: 0,
		bottom: 0,
		paddingVertical: 8,
		maxHeight: 38,
	},
	action: {
		textAlign: 'center',
		color: 'blue',
	},
});
