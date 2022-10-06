import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import WebView from 'react-native-autoheight-webview';
import uuid from 'react-native-uuid';

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
import { LocalActionCreators } from '../../../../store/LocalState/ActionCreators';
import { RoundList } from './components/RoundList';
import { TrainingRound } from '../../../../objects/training/TrainingRound';
import { TrainingDay } from '../../../../objects/training/TrainingDay';
import { TrainingExercise } from '../../../../objects/training/TrainingExercise';
import { CurrentTraining } from '../../../../store/Types';

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
	const training: Nullable<CurrentTraining> = useSelector((state: IState) => state.training.item);

	const programDay: TrainingProgramDay | undefined = program?.days?.find(q => q.id === training?.day);
	const trainingDay: TrainingDay | undefined = training?.training?.days.find(q => q.programDayId === training?.day);

	const programExercise: TrainingProgramDayExercise | undefined = programDay?.exercises?.find(q => q.exerciseId === props.exercise.id);
	const cur: TrainingExercise | undefined = trainingDay?.exercises?.find(q => q.exerciseId === programExercise?.id);

	const rounds: Array<ExerciseRoundParams> = program?.days.find((day: TrainingProgramDay) => day.id === training?.day)?.exercises
		.find((exercise: TrainingProgramDayExercise) => exercise.exerciseId === props.exercise.id)?.rounds ?? [];
	const completed: Array<TrainingRound> = rounds.map((round: ExerciseRoundParams) => {
		const res = cur?.rounds.find(q => q.roundParamsId === round.id);
		if (res) return res;

		return { id: uuid.v4().toString(), roundParamsId: round.id, weight: 0, time: null };
	});

	const dispatch = useDispatch();

	const onSet = (value: number, id: number) => {
		if (!training) return;
		if (!training.training) return;
		if (id >= rounds.length) return;
		if (value <= 0) return;

		const reference = rounds[id];
		const newRound: TrainingRound = { id: uuid.v4().toString(), roundParamsId: reference.id, weight: value, time: +(new Date) }
		const newRounds: Array<TrainingRound> = [...completed];
		newRounds[id] = newRound;

		const newExercises: Array<TrainingExercise> = (programDay?.exercises ?? []).map((item: TrainingProgramDayExercise) => {
			let cur: TrainingExercise | undefined = trainingDay?.exercises?.find(q => q.exerciseId === item.id);
			if (!cur) cur = { id: uuid.v4().toString(), exerciseId: item.id, rounds: [], time: null, }

			if (item.exerciseId === props.exercise.id) {
				return {
					...cur,
					rounds: newRounds,
				};
			}

			return cur;
		});
		const newDays: Array<TrainingDay> = (program?.days ?? []).map((item: TrainingProgramDay) => {
			let cur: TrainingDay | undefined = training?.training?.days?.find(q => q.programDayId === item.id);
			if (!cur) cur = { id: uuid.v4().toString(), trainingId: training.training.id, programDayId: item.id, exercises: [], time: null };

			if (cur.programDayId === training?.day) {
				return {
					...cur,
					exercises: newExercises,
				};
			}

			return cur;
		});

		const newTraining: CurrentTraining = { ...training, training: { ...training.training, days: newDays, } };
		const creator = new LocalActionCreators<'training'>('training');

		dispatch(creator.set(newTraining));
	};

	return (
		<RoundList
			completed={completed}
			rounds={rounds}
			onSet={onSet}
			disabled={Boolean(trainingDay?.time)}
		/>
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
