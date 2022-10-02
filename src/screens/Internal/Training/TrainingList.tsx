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
import { LocalActionCreators } from '../../../store/LocalState/ActionCreators';
import { TrainingRound } from '../../../objects/training/TrainingRound';
import { CurrentTraining } from '../../../store/Types';
import { TrainingDay } from '../../../objects/training/TrainingDay';
import { completeDay } from '../../../services/Requests/AppRequests/TrainingRequests';
import { Spinner } from '../../../components/spinner/Spinner';
import { AlertBox } from '../../../components/alertbox/AlertBox';

type Props = NativeStackScreenProps<never>;

export const TrainingList: React.FC<Props> = (props: Props) => {
	const currentTraining: Nullable<CurrentTraining> = useSelector((state: IState) => state.training.item);
	const user = useSelector((state: IState) => state.user);
	const day = React.useMemo<Nullable<TrainingProgramDay>>(() => {
		const day = currentTraining?.day;
		if (day === null) return null;

		return user.item?.trainingProgram?.days.find((item: TrainingProgramDay) => item.id === day) ?? null;
	}, [user.item?.trainingProgram, currentTraining?.day]);
	const completed = React.useMemo<boolean>(() => (
		Boolean(currentTraining?.training?.days.find(q => q.programDayId === currentTraining?.day)?.time)
	), [currentTraining, currentTraining?.day]);

	const dispatch = useDispatch();
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const [progress, setProgress] = React.useState<boolean>(() => false);
	const [offset, setOffset] = React.useState<number>(() => 0);

	const complete = () => {
		if (!currentTraining) return;

		const trainingDay: TrainingDay | undefined = currentTraining.training?.days.find(q => q.programDayId === currentTraining.day);
		if (!trainingDay) return;

		const list = trainingDay.exercises;
		let completed = list.length === day?.exercises.length;

		for (let i = 0; i < list.length && completed; i++) {
			const completedRounds: Array<TrainingRound> = list[i].rounds;
			const rounds: Array<ExerciseRoundParams> = day?.exercises[i].rounds ?? [];
			completed = completed && (rounds.length === completedRounds.length);

			for (let j = 0; j < completedRounds.length && completed; j++) {
				if (completedRounds[j].time === undefined) {
					completed = false;
				}
			}
		}

		function finish() {
			// update redux
			// make request to server
			if (!trainingDay) return;
			if (!currentTraining) return;

			setProgress(true);
			setError(null);
			completeDay(trainingDay)
				.then((res: TrainingDay) => {
					const actions = new LocalActionCreators('training')
					const item: CurrentTraining = { ...currentTraining, training: { ...currentTraining.training, }  };
					item.training.days = item.training?.days.map(q => q.programDayId === res.programDayId ? res : q);

					dispatch(actions.set(item));
					props.navigation.pop();
				})
				.catch((error: string | Error) => {
					if (typeof error === 'string') {
						setError(error);
					} else if ((error as Error).message) {
						setError(error.message);
					} else {
						setError('Что-то пошло не так');
					}
				})
				.finally(() => setProgress(false));
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
			<Spinner loading={progress} />
			<AlertBox message={error} style={{ marginBottom: offset }} />
			{
				!completed && (
					<View
						style={styles.actionContainer}
						onLayout={(event) => setOffset(event.nativeEvent.layout.height)}
					>
						<TouchableOpacity onPress={complete}>
							<Text style={styles.action}>
								Завершить тренировку
							</Text>
						</TouchableOpacity>
					</View>
				)
			}
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
