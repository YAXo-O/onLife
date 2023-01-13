import * as React from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	ListRenderItemInfo,
	Text,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';

import { TrainingExercise } from '@app/objects/training/TrainingExercise';

import { withUser } from '@app/hooks/withUser';
import { IState } from '@app/store/IState';
import { CurrentTraining } from '@app/store/Types';
import { Nullable } from '@app/objects/utility/Nullable';

import { ExerciseTab, ExerciseTabs } from '@app/screens/Internal/Training/ExerciseTabs';

import Background from '@assets/images/training_background.png';
import TrainingDumbbell from '@assets/icons/training_dumbbell.svg';
import TrainingVideo from '@assets/icons/training_video.svg';
import TrainingMaterial from '@assets/icons/training_material.svg';
import TrainingStats from '@assets/icons/training_stats.svg';
import { useLoader } from '@app/hooks/useLoader';
import { toString } from '@app/utils/validation';
import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@app/navigation/routes';
import { AlertBox, AlertType } from '@app/components/alertbox/AlertBox';
import { Timer } from '@app/components/timer/Timer';
import { SafeAreaView } from '@app/components/safearea/SafeAreaView';
import { SessionAdaptor } from '@app/objects/adaptors/SessionAdaptor';
import { OnlifeTrainingBlock } from '@app/objects/training/TrainingBlock';
import { saveTraining } from '@app/services/Requests/PowerTrainRequests/TrainingProgram';
import { OnlifeTraining } from '@app/objects/training/Training';
import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';
import { TrainingRound } from '@app/objects/training/TrainingRound';

interface HeaderItem {
	id: string;
	exercise: Nullable<TrainingExercise>;
}

function getList(info: Nullable<CurrentTraining> | undefined): Array<HeaderItem> {
	if (!info) return [];
	if (!info.active) return [];

	const list = (info.active.exercises ?? []).map<HeaderItem>((item: TrainingExercise) => ({
		id: item.id,
		exercise: item,
	}))
	if (info.active.time) return list;

	return list.concat({
		id: 'action',
		exercise: null,
	});
}

const collectionHeight = 150;
const offset = collectionHeight + 15;

function updateTrainingTime(training: OnlifeTraining): OnlifeTraining {
	const result: OnlifeTraining = { ...training };
	result.blocks = training.blocks.map((block: OnlifeTrainingBlock) => {
		const item = { ...block };

		item.days = block.days.map((day: OnlifeTrainingDay) => {
			const item = { ...day };

			item.exercises = day.exercises.map((exercise: TrainingExercise) => {
				const item = { ...exercise };

				const time = Math.max.apply(null, item.rounds.map((item: TrainingRound) => item.time ?? Infinity));
				item.time = time === Infinity ? null : time;

				return item;
			});

			const time = Math.max.apply(null, item.exercises.map((item: TrainingExercise) => item.time ?? Infinity));
			item.time = time === Infinity ? null : time;

			return item;
		});

		const time = Math.max.apply(null, item.days.map((item: OnlifeTrainingDay) => item.time ?? Infinity));
		item.time = time === Infinity ? null : time;

		return item;
	});

	return result;
}

function updateAvailability(training: OnlifeTraining): OnlifeTraining {
	const index = training.blocks.findIndex((block: OnlifeTrainingBlock) => block.time === null);
	if (index >= 0) {
		for (let i = 0; i <= index; i++) {
			training.blocks[i].available = true;
		}
	}

	return training;
}

export const TrainingScreen: React.FC = () => {
	const { start, finish } = useLoader();
	const { id } = withUser();
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const [slide, setSlide] = React.useState<number>(() => 0);

	const dispatch = useDispatch();
	const info = useSelector((state: IState) => state.training.item);
	const training = useSelector((state: IState) => state.session.item);
	const { navigate } = useNavigation();
	const insets = useSafeAreaInsets();
	const headerHeight = useHeaderHeight();
	const topHeight = headerHeight + collectionHeight;

	const day = info?.active;
	const list: Array<HeaderItem> = getList(info);
	const [value, setValue] = React.useState(() => list[0].id);
	const [tab, setTab] = React.useState(() => ExerciseTab.Training);

	const completeDay = () => {
		if (!day) return;
		if (!id) return;

		const userId = Number.parseInt(id);
		if (Number.isNaN(userId)) return;

		if (day.time) {
			const creator = new LocalActionCreators('training');
			dispatch(creator.set({ day: null, block: null, active: null }));

			navigate(Routes.Main);
			Timer.stop();
		}

		if (day.exercises.find((item: TrainingExercise) => item.time === null)) return;

		setError(null);
		if (!training) return;

		const block = training.blocks.find((q: OnlifeTrainingBlock) => q.id === day.trainingBlockId);
		if (!block) return;

		const message = new SessionAdaptor(training, block, day);

		Timer.stop();
		start();
		saveTraining(userId, message)
			.then(() => {
				const trainingCreator = new LocalActionCreators('training');
				dispatch(trainingCreator.set({ day: null, block: null, active: null }));

				const sessionCreator = new LocalActionCreators('session');
				const item = updateAvailability(updateTrainingTime(training));
				dispatch(sessionCreator.set(item));

				navigate(Routes.Main);
			})
			.catch((error: string | Error) => {
				console.warn('<Training> failed to complete training: ', error);
				setError(toString(error));
			})
			.finally(finish);
	};

	const completeExercise = () => {
		const id = list.findIndex((q: HeaderItem) => q.id === value);
		if (id < list.length - 2){
			setValue(list[id + 1].id);
		} else {
			completeDay();
		}
	};

	return (
		<SafeAreaView style={styles.screen}>
			<ImageBackground
				style={[
					styles.image,
					{
						height: topHeight,
						paddingTop: headerHeight,
					}
				]}
				source={Background}
			>
				<View style={[styles.collection, { height: 80 }]} />
				<View style={styles.placeholder}>
					<Text style={[styles.placeholderText]}>* не забудьте завершить тренировку</Text>
				</View>
			</ImageBackground>
			<ScrollView
				bounces={false}
				showsVerticalScrollIndicator={false}
				style={{
					marginTop: -offset,
					marginBottom: -insets.bottom,
					zIndex: 2,
					elevation: 2,
				}}
				contentContainerStyle={{
					paddingTop: collectionHeight,
					backgroundColor: 'transparent',
					minHeight: '100%',
				}}
				scrollEventThrottle={8}
				onScroll={(event) => {
					// Map slide from y coordinate to 0-1 space
					// Distance between card top and collection bottom is ~40
					const value = Math.max(Math.min(event.nativeEvent.contentOffset.y / 40, 1), 0);
					setSlide(value);
				}}
			>
				<View
					style={[styles.bottom, { minHeight: '100%' }]}
				>
					<View style={styles.row}>
						<TouchableOpacity
							style={styles.bullet}
							onPress={() => setTab(ExerciseTab.Training)}
						>
							<View
								style={[
									styles.bulletIcon,
									tab === ExerciseTab.Training && styles.bulletIconActive,
								]}
							>
								<TrainingDumbbell
									fillPrimary={tab === ExerciseTab.Training ? palette.white['100'] : palette.cyan['40']}
								/>
							</View>
							<Text style={styles.bulletText}>Тренировка</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.bullet}
							onPress={() => setTab(ExerciseTab.Video)}
						>
							<View
								style={[
									styles.bulletIcon,
									tab === ExerciseTab.Video && styles.bulletIconActive,
								]}
							>
								<TrainingVideo
									fillPrimary={tab === ExerciseTab.Video ? palette.white['100'] : palette.cyan['40']}
								/>
							</View>
							<Text style={styles.bulletText}>Видео</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.bullet}
							onPress={() => setTab(ExerciseTab.Material)}
						>
							<View
								style={[
									styles.bulletIcon,
									tab === ExerciseTab.Material && styles.bulletIconActive,
								]}
							>
								<TrainingMaterial
									fillPrimary={tab === ExerciseTab.Material ? palette.white['100'] : palette.cyan['40']}
								/>
							</View>
							<Text style={styles.bulletText}>Техника</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.bullet}
							onPress={() => setTab(ExerciseTab.Stats)}
						>
							<View
								style={[
									styles.bulletIcon,
									tab === ExerciseTab.Stats && styles.bulletIconActive,
								]}
							>
								<TrainingStats
									fillPrimary={tab === ExerciseTab.Stats ? palette.white['100'] : palette.cyan['40']}
								/>
							</View>
							<Text style={styles.bulletText}>Статистика</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.container}>
						<ExerciseTabs
							tab={tab}
							training={training}
							item={list.find((q: HeaderItem) => q.id === value)?.exercise ?? null}
							onComplete={completeExercise}
						/>
					</View>
				</View>
			</ScrollView>
			<FlatList
				style={[
					styles.collection,
					{
						position: 'absolute',
						top: headerHeight,
						left: 0,
						right: 0,
						opacity: 1 - slide,
						zIndex: slide > 0.5 ? 1 : 3,
						elevation: slide > 0.5 ? 1 : 3,
					}
				]}
				contentContainerStyle={{ paddingHorizontal: 22 }}
				data={list}
				renderItem={(item: ListRenderItemInfo<HeaderItem>) => {
					const exercise = item.item.exercise;

					if (exercise === null) {
						return (
							<TouchableOpacity
								style={[
									styles.item,
									{ backgroundColor: '#D04A3A' }
								]}
								onPress={() => completeDay()}
							>
								<Text
									style={[
										typography.cardTitle,
										styles.text,
										styles.activeText,
									]}
								>
									END
								</Text>
							</TouchableOpacity>
						);
					}

					return (
						<TouchableOpacity
							style={[
								styles.item,
								Boolean(exercise.time) && styles.completeItem,
								exercise.id === value && styles.activeItem,
							]}
							onPress={() => setValue(item.item.id)}
						>
							<Text
								style={[
									typography.cardTitle,
									styles.text,
									(exercise.id === value || Boolean(exercise.time)) && styles.activeText,
								]}
							>
								{exercise.order + 1}
							</Text>
							<Text
								style={[
									typography.cardTitle,
									styles.text,
									(item.item.id === value || Boolean(exercise.time)) && styles.activeText,
								]}
							>
								упр
							</Text>
						</TouchableOpacity>
					);
				}}
				keyExtractor={(item: HeaderItem) => item.id}
				ItemSeparatorComponent={() => <View style={{ height: 80, width: 15 }} />}
				showsHorizontalScrollIndicator={false}
				horizontal
			/>
			<AlertBox
				title="Ошибка завершения тренировки"
				type={AlertType.error}
				message={error}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	image: {
		width: '100%',
		paddingBottom: 25,
	},
	bottom: {
		flex: 2,
		paddingTop: 10,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: palette.white['100'],
	},
	collection: {
		marginTop: 10,
		marginBottom: 15,
	},
	item: {
		height: 80,
		width: 65,
		borderRadius: 10,
		backgroundColor: palette.white['100'],
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	activeItem: {
		backgroundColor: palette.cyan['40'],
	},
	completeItem: {
		backgroundColor: '#228591BF',
	},
	text: {
		color: palette.cyan['40'],
	},
	activeText: {
		color: palette.white['100'],
	},
	placeholder: {
		marginHorizontal: 22,
	},
	placeholderText: {
		color: '#fff',
		fontFamily: 'Inter-Regular',
		fontSize: 12,
		lineHeight: 16,
		fontStyle: 'italic',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 22,
		marginVertical: 35,
	},
	bullet: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	bulletIcon: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F2F4F7',
		width: 68,
		height: 68,
		borderRadius: 34,
	},
	bulletIconActive: {
		backgroundColor: palette.cyan['40'],
	},
	bulletText: {
		color: '#112A50B2',
		fontFamily: 'Inter-SemiBold',
		fontSize: 11,
		lineHeight: 20,
	},
	container: {
		paddingVertical: 22,
	},
	video: {
		width: '100%',
		height: 200,
		backgroundColor: 'black',
		borderRadius: 8,
	},
});
