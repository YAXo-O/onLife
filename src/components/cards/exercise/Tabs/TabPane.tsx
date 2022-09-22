import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import WebView from 'react-native-autoheight-webview';

import { Exercise } from '../../../../objects/program/Exercise';
import { ExerciseTabs } from './TabBar';
import { Nullable } from '../../../../objects/utility/Nullable';
import { wrapHtml } from '../../../../utils/wrapHtml';
import { ImageFit } from '../../../image/ImageFit';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from '../../../../store/IState';
import {
	TrainingProgramDay,
	TrainingProgramDayExercise,
	ExerciseRoundParams
} from '../../../../objects/program/TrainingProgram';
import { WeightInput } from '../../../input/WeightInput';
import { LocalActionCreators } from '../../../../store/LocalState/ActionCreators';

interface TabPaneProps {
	tab: number;
	exercise: Nullable<Exercise>;
}

interface BaseTabProps {
	exercise: Exercise;
}

const BriefDescriptionTab: React.FC<BaseTabProps> = (props: BaseTabProps) => {
	const hasContent = props.exercise.image || props.exercise.details;
	if (!hasContent) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>
					Краткое описание отсутствует
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{
				props.exercise.image
					? (
						<ImageFit
							style={styles.image}
							source={{ uri: props.exercise.image }}
						/>
					) : null
			}
			<Text style={styles.text}>
				{props.exercise.details}
			</Text>
		</View>
	);
};

const TrainingTab: React.FC<BaseTabProps> = (props: BaseTabProps) => {
	const program = useSelector((state: IState) => state.user.item?.trainingProgram);
	const training = useSelector((state: IState) => state.training.item);
	const cur = training?.exercises?.find(q => q.exerciseId === props.exercise.id);
	const rounds: Array<ExerciseRoundParams> = program?.days.find((day: TrainingProgramDay) => day.id === training?.day)?.exercises
		.find((exercise: TrainingProgramDayExercise) => exercise.exerciseId === props.exercise.id)?.rounds ?? [];
	const completed = rounds.map((round) => cur?.rounds.find(q => q.roundId === round.id)).filter(q => q);

	console.log('<Training> training: ', training);

	const dispatch = useDispatch();

	const onAdd = (value: number) => {
		const id = completed.length;
		if (id >= rounds.length) return;
		if (value <= 0) return;

		const reference = rounds[id];
		const newRound = { roundId: reference.id, weight: value, timestamp: +(new Date) }
		const newRounds = [...completed, newRound];
		const newExercises = (training?.exercises ?? [{ exerciseId: props.exercise.id, rounds: [] }]).map(q => {
			if (q.exerciseId === props.exercise.id) {
				return {
					...q,
					rounds: newRounds,
				};
			}

			return q;
		});
		const newTraining = { ...training, exercises: newExercises };
		const creator = new LocalActionCreators<'training'>('training');

		dispatch(creator.set(newTraining));
	};

	return (
		<View style={styles.container}>
			<View style={{ marginBottom: completed.length ? 4 : 0 }}>
				{
					completed.map((q, id) => (
						<View key={q?.roundId} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text
								style={[styles.text, { textAlign: 'left', fontWeight: 'bold' }]}
							>
								{id + 1} подход
							</Text>

							<View style={{ flex: 1, flexDirection: 'column' }}>
								<Text style={[ styles.text, { textAlign: 'right' } ]}>
									{rounds[id].repeats} повторений по {rounds[id].weight} (кг)
								</Text>
								<Text
									style={[styles.text, { textAlign: 'right' }]}
								>
									выполненный вес: {q?.weight.toFixed(1)} (кг)
								</Text>
							</View>
						</View>
					))
				}
			</View>
			{
				completed.length < rounds.length ? (
					<View>
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text
								style={[styles.text, { textAlign: 'left', fontWeight: 'bold' }]}
							>
								{completed.length + 1} подход
							</Text>

							<View style={{ flex: 1, flexDirection: 'column' }}>
								<Text style={[ styles.text, { textAlign: 'right' } ]}>
									{rounds[completed.length].repeats} повторений по {rounds[completed.length].weight} (кг)
								</Text>
								<Text
									style={[styles.text, { textAlign: 'right' }]}
								>
									выполненный вес: -
								</Text>
							</View>
						</View>
						<WeightInput onAdd={onAdd} />
					</View>
				) : null
			}
		</View>
	);
};

const MaterialTab: React.FC<BaseTabProps> = (props: BaseTabProps) => {
	const [height, setHeight] = React.useState<number>(() => 0);
	const html = wrapHtml(props.exercise.description);

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.title}>Видеоматериалы</Text>
				{
					props.exercise.video
						? (
							<VideoPlayer
								style={styles.video}
								source={{ uri: props.exercise.video }}
								resizeMode="contain"
								playInBackground
							/>
						)
						: <Text style={styles.text}>Видеоматериалы отсутствуют</Text>
				}
			</View>
			<View style={styles.section}>
				<Text style={styles.title}>Как выполнять</Text>
				{
					props.exercise.description ? (
						<View style={{ flex: 1 }}>
							<WebView
								style={{ backgroundColor: 'transparent', height }}
								source={{ html, baseUrl: '', }}
								originWhitelist={['*']}
								onSizeUpdated={({ height }) => setHeight(height)}
								javaScriptEnabled={true}
								scrollEnabled={false}
								scalesPageToFit={false}
								automaticallyAdjustContentInsets={false}
								viewportContent="width=device-width, user-scalable=no"
							/>
						</View>
					)
					: <Text style={styles.text}>Описание отсутствует</Text>
				}
			</View>
			<View style={styles.section}>
				<Text style={styles.title}>Схема</Text>
				{
					props.exercise.schema ? (
						<ImageFit source={{ uri: props.exercise.schema }} />
					) : <Text style={styles.text}>Схема отсутствует</Text>
				}
			</View>
		</View>
	);
};

export const TabPane: React.FC<TabPaneProps> = (props: TabPaneProps) => {
	if (props.exercise == null) return <Text>Отсутствуют данные об упражнении</Text>;

	switch (props.tab) {
		case ExerciseTabs.Brief:
			return <BriefDescriptionTab exercise={props.exercise} />;

		case ExerciseTabs.Training:
			return <TrainingTab exercise={props.exercise} />;

		case ExerciseTabs.Material:
			return <MaterialTab exercise={props.exercise} />;
	}

	return null;
};

const styles = StyleSheet.create({
	container: {
		margin: 16,
		marginTop: 0,
	},
	section: {
		marginTop: 8,
	},
	text: {
		color: '#555',
		textAlign: 'justify',
	},
	title: {
		color: '#222',
		fontWeight: '600',
		fontSize: 16,
		textAlign: 'left',
	},
	image: {
		flex: 1,
		borderWidth: 0,
		borderColor: 'red',
		borderStyle: 'solid',
		resizeMode: 'contain',
	},
	video: {
		width: '100%',
		height: 200,
		backgroundColor: 'black',
		borderRadius: 8,
	},
});
