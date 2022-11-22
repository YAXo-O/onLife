import * as React from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	FlatList,
	ListRenderItemInfo,
	Text,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	ScrollView, useWindowDimensions,
} from 'react-native';
import { useSelector } from 'react-redux';

import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';

import { Training } from '@app/objects/training/Training';
import { TrainingBlock } from '@app/objects/training/TrainingBlock';
import { TrainingDay } from '@app/objects/training/TrainingDay';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { TrainingRound } from '@app/objects/training/TrainingRound';

import Background from '@assets/images/training_background.png';
import { withUser } from '@app/hooks/withUser';
import { IState } from '@app/store/IState';
import { CurrentTraining } from '@app/store/Types';
import { Nullable } from '@app/objects/utility/Nullable';

import TrainingDumbbell from '@assets/icons/training_dumbbell.svg';
import TrainingVideo from '@assets/icons/training_video.svg';
import TrainingMaterial from '@assets/icons/training_material.svg';
import TrainingStats from '@assets/icons/training_stats.svg';
import { WithOrder } from '@app/objects/utility/WithOrder';

function getList(training: Nullable<Training> | undefined, info: Nullable<CurrentTraining> | undefined): Array<TrainingExercise> {
	if (!training || !info) return [];

	const block = training.blocks.find((block: TrainingBlock) => block.id === info.block);
	if (!block) return []

	const day = block.days.find((day: TrainingDay) => day.id === info.day);
	if (!day) return []

	return day.exercises ?? [];
}

function getRounds(exercise?: Nullable<TrainingExercise>): Array<TrainingRound> {
	if (!exercise) return [];

	return exercise.rounds.sort((a: WithOrder, b: WithOrder) => a.order - b.order) ?? [];
}

enum ExerciseTab {
	Training = 0,
	Video = 1,
	Material = 2,
	Stats = 3,
}

interface TabsProps {
	tab: ExerciseTab;
	item?: Nullable<TrainingExercise>;
}

const Tabs: React.FC<TabsProps> = (props: TabsProps) => {
	const current = props.item;

	switch (props.tab) {
		case ExerciseTab.Training:
			return (
				<View>
					<Text
						style={{
							fontFamily: 'Inter-SemiBold',
							lineHeight: 24,
							fontSize: 20,
							color: '#000',
							marginBottom: 30,
							paddingHorizontal: 22,
						}}
					>
						{current?.exercise?.name}
					</Text>

					<FlatList
						snapToInterval={315}
						snapToAlignment="start"
						decelerationRate="fast"
						contentContainerStyle={styles.setCollection}
						data={getRounds(current)}
						renderItem={(item: ListRenderItemInfo<TrainingRound>) => (
							<View style={styles.setCard}>
								<View>
									<Text
										style={{
											fontFamily: 'Inter-ExtraBold',
											fontSize: 20,
											lineHeight: 24,
											color: '#000',
										}}
									>
										SET {item.item.order + 1}
									</Text>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center'  }}>
									<Text
										style={{
											fontFamily: 'Inter-Medium',
											fontSize: 16,
											lineHeight: 20,
											color: '#000',
											width: 115,
										}}
									>
										Повторения
									</Text>
									<View
										style={{
											borderRadius: 8,
											backgroundColor: '#fff',
											alignItems: 'flex-start',
											justifyContent: 'center',
											paddingHorizontal: 22,
											paddingVertical: 13,
											marginHorizontal: 10,
											width: 100,
										}}
									>
										<Text
											style={{
												fontFamily: 'Inter-Light',
												fontSize: 20,
												lineHeight: 24,
												color: '#000'
											}}
										>{item.item.repeats}</Text>
									</View>
									<Text
										style={{
											fontFamily: 'Inter-Medium',
											fontSize: 16,
											lineHeight: 20,
											color: '#000',
											width: 100,
										}}
									>
										раз
									</Text>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center'  }}>
									<Text
										style={{
											fontFamily: 'Inter-Medium',
											fontSize: 16,
											lineHeight: 20,
											color: '#63CDDA',
											width: 115,
										}}
									>
										Выполненный вес*
									</Text>
									<TextInput
										keyboardType="numeric"
										style={{
											borderRadius: 8,
											backgroundColor: '#fff',
											alignItems: 'center',
											justifyContent: 'center',
											paddingHorizontal: 22,
											paddingVertical: 13,
											marginHorizontal: 10,
											fontFamily: 'Inter-Light',
											fontSize: 20,
											lineHeight: 24,
											color: '#000',
											width: 100,
										}}
									/>
									<Text
										style={{
											fontFamily: 'Inter-Medium',
											fontSize: 16,
											lineHeight: 20,
											color: '#000',
											width: 100,
										}}
									>
										kg
									</Text>
								</View>
							</View>
						)}
						keyExtractor={(item: TrainingRound) => item.id}
						ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
						horizontal
					/>
					<View style={{ marginVertical: 25 }}>
						<Text
							style={{
								color: '#112A50',
								fontFamily: 'Inter-Medium',
								fontSize: 12,
								lineHeight: 16,
								fontStyle: 'italic',
								paddingHorizontal: 22,
							}}
						>
							*Вес вносите после выполнения подхода
						</Text>
					</View>
				</View>
			);

		case ExerciseTab.Video:
			return (
				<View style={{ padding: 22 }}>
					<View>
						<Text style={{ color: '#000', fontFamily: 'Inter-Medium', fontSize: 16, lineHeight: 24 }}>
							{current?.exercise?.name ?? 'Упражнение'}
						</Text>
					</View>
				</View>
			);

		case ExerciseTab.Material:
			return null;

		case ExerciseTab.Stats:
			return null;
	}
};

export const TrainingScreen: React.FC = () => {
	const { user } = withUser();
	const info = useSelector((state: IState) => state.training.item);
	const height = useWindowDimensions().height;

	const list: Array<TrainingExercise> = getList(user?.training, info);
	const [value, setValue] = React.useState(() => list[0].id);
	const [tab, setTab] = React.useState(() => ExerciseTab.Training);

	const current = list.find((item) => item.id === value);

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
								item.item.id === value && styles.activeItem
							]}
							onPress={() => setValue(item.item.id)}
						>
							<Text
								style={[
									typography.cardTitle,
									styles.text,
									item.item.id === value && styles.activeText,
								]}
							>
								{item.item.order + 1}
							</Text>
							<Text
								style={[
									typography.cardTitle,
									styles.text,
									item.item.id === value && styles.activeText,
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
			<View style={{ height: 60 }} />
			<KeyboardAvoidingView>
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={{ paddingTop: 120 }}
					contentContainerStyle={{
						paddingBottom: 25,
						backgroundColor: 'transparent',
					}}
				>
					<View style={[styles.bottom, { height: height - 180, }]}>
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
							<TouchableOpacity style={styles.bullet}>
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
							<TouchableOpacity style={styles.bullet}>
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
							<Tabs tab={tab} item={current} />
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	top: {
		height: 190,
		position: 'absolute',
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
	setCollection: {
		paddingHorizontal: 22,
	},
	setCard: {
		backgroundColor: '#F2F4F7',
		padding: 20,
		borderRadius: 8,
		width: 300,
	},
});
