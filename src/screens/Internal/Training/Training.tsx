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
import { useSelector } from 'react-redux';

import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';

import { Training } from '@app/objects/training/Training';
import { TrainingBlock } from '@app/objects/training/TrainingBlock';
import { TrainingDay } from '@app/objects/training/TrainingDay';
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

function getList(info: Nullable<CurrentTraining> | undefined): Array<TrainingExercise> {
	if (!info) return [];
	if (!info.active) return [];

	return info.active.exercises ?? [];
}

export const TrainingScreen: React.FC = () => {
	const { user } = withUser();
	const info = useSelector((state: IState) => state.training.item);

	const list: Array<TrainingExercise> = getList(info);
	const [value, setValue] = React.useState(() => list[0].id);
	const [tab, setTab] = React.useState(() => ExerciseTab.Training);

	const completeExercise = () => {
		const id = list.findIndex((q: TrainingExercise) => q.id === value);
		if (id < list.length - 1) setValue(list[id + 1].id);
	};

	return (
		<View style={styles.screen}>
			<ImageBackground
				style={styles.top}
				source={Background}
				resizeMode="cover"
			>
				<FlatList
					style={styles.collection}
					data={list}
					renderItem={(item: ListRenderItemInfo<TrainingExercise>) => (
						<TouchableOpacity
							style={[
								styles.item,
								item.item.id === value && styles.activeItem,
								Boolean(item.item.time) && styles.completeItem,
							]}
							onPress={() => setValue(item.item.id)}
						>
							<Text
								style={[
									typography.cardTitle,
									styles.text,
									(item.item.id === value || Boolean(item.item.time)) && styles.activeText,
								]}
							>
								{item.item.order + 1}
							</Text>
							<Text
								style={[
									typography.cardTitle,
									styles.text,
									(item.item.id === value || Boolean(item.item.time)) && styles.activeText,
								]}
							>
								упр
							</Text>
						</TouchableOpacity>
					)}
					keyExtractor={(item: TrainingExercise) => item.id}
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
							item={list.find((q: TrainingExercise) => q.id === value)}
							onComplete={completeExercise}
						/>
					</View>
				</View>
			</ScrollView>
		</View>
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
