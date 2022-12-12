import * as React from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	FlatList,
	ListRenderItemInfo,
	Text,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

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
import { completeTraining } from '@app/services/Requests/AppRequests/UserRequests';
import { TrainingDay } from '@app/objects/training/TrainingDay';
import { toString } from '@app/utils/validation';
import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';
import { setAction as itemSetAction } from '@app/store/ItemState/ActionCreators';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@app/navigation/routes';
import { AlertBox, AlertType } from '@app/components/alertbox/AlertBox';
import { Timer } from '@app/components/timer/Timer';
import { OrderService } from '@app/services/Utilities/OrderService';

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

export const TrainingScreen: React.FC = () => {
	const { user } = withUser();
	const { start, finish } = useLoader();
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const dispatch = useDispatch();
	const info = useSelector((state: IState) => state.training.item);
	const { navigate } = useNavigation();

	const day = info?.active;
	const list: Array<HeaderItem> = getList(info);
	const [value, setValue] = React.useState(() => list[0].id);
	const [tab, setTab] = React.useState(() => ExerciseTab.Training);

	const completeDay = () => {
		if (!day) return;

		if (day.time) {
			const creator = new LocalActionCreators('training');
			dispatch(creator.set({ day: null, block: null, active: null }));

			navigate(Routes.Main);
			Timer.stop();
		}

		setError(null);
		start();
		completeTraining(day)
			.then((item: TrainingDay) => {
				const creator = new LocalActionCreators('training');
				dispatch(creator.set({ day: null, block: null, active: null }));

				const training = user?.training;
				if (!training) return;

				const block = training.blocks.find(q => q.id === item.trainingBlockId);
				if (!block) return;

				const dayId = block.days.findIndex(q => q.id === item.id);
				if (dayId < 0) return;

				item.exercises = OrderService.sort(item.exercises);
				block.days[dayId] = item;
				dispatch(itemSetAction({ ...user }, 'user'));

				navigate(Routes.Main);
				Timer.stop();
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
				style={styles.top}
				source={Background}
				resizeMode="cover"
			>
				<FlatList
					style={styles.collection}
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
					ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
					horizontal
				/>
				<View style={styles.placeholder}>
					<Text style={[styles.placeholderText]}>* не забудьте завершить тренировку</Text>
				</View>
			</ImageBackground>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ marginTop: -10, }}
				contentContainerStyle={{
					backgroundColor: 'transparent',
				}}
			>
				<View style={[styles.bottom, { minHeight: '100%' }]}>
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
							training={user?.training}
							item={list.find((q: HeaderItem) => q.id === value)?.exercise ?? null}
							onComplete={completeExercise}
						/>
					</View>
				</View>
			</ScrollView>
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
		backgroundColor: '#fff',
	},
	top: {
		height: 190,
		left: 0,
		right: 0,
		top: 0,
		overflow: 'hidden',
	},
	bottom: {
		flex: 2,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: palette.white['100'],
	},
	collection: {
		paddingHorizontal: 22,
		marginTop: 64,
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
		marginBottom: 20,
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
