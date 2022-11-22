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
	ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import VideoPlayer from 'react-native-video-controls';
import WebView from 'react-native-autoheight-webview';

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
import { ImageFit } from '@app/components/image/ImageFit';

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
	training?: Nullable<Training>;
}

function getStats(training: Nullable<Training> | undefined, exerciseId: Nullable<string> | undefined): Array<TrainingExercise> {
	if (!training || !exerciseId) return [];

	const result: Array<TrainingExercise> = [];

	training.blocks.forEach((block: TrainingBlock) => {
		block.days.forEach((day: TrainingDay) => {
			day.exercises.forEach((exercise: TrainingExercise) => {
				if (exercise.exerciseId === exerciseId) {
					result.push(exercise);
				}
			});
		});
	});

	return result;
}

const Tabs: React.FC<TabsProps> = (props: TabsProps) => {
	const current = props.item;
	const [height, setHeight] = React.useState<number | undefined>(() => undefined);

	switch (props.tab) {
		case ExerciseTab.Training:
			return (
				<View>
					<Text
						style={{
							fontFamily: 'Inter-Medium',
							lineHeight: 24,
							fontSize: 20,
							color: '#000',
							marginBottom: 30,
							paddingHorizontal: 22,
							textAlign: 'center',
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
												color: '#000',
												textAlign: 'center',
											}}
										>
											{item.item.repeats}
										</Text>
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
											textAlign: 'center',
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
			const video = current?.exercise?.video;

			return (
				<View style={{ paddingHorizontal: 22 }}>
					{
						video ? (
							<View style={{
								padding: 0,
								marginBottom: 10,
								width: '100%',
								aspectRatio: 16 / 9,
							}}>
								<VideoPlayer
									style={styles.video}
									source={{ uri: video }}
									resizeMode="contain"
									playInBackground
								/>
							</View>
						) : null
					}
					<View>
						<Text style={{ color: '#000', fontFamily: 'Inter-Medium', fontSize: 16, lineHeight: 24 }}>
							{current?.exercise?.name ?? 'Упражнение'}
						</Text>
					</View>
				</View>
			);

		case ExerciseTab.Material:
			const image = current?.exercise?.image;
			const text = current?.exercise?.description ?? '';

			return (
				<View style={{ paddingHorizontal: 22 }}>
					<Text
						style={{
							color: '#000',
							fontFamily: 'Inter-Medium',
							fontSize: 20,
							lineHeight: 24,
							textAlign: 'center',
						}}
					>
						{current?.exercise?.name ?? 'Упражнение'}
					</Text>
					{
						image ? (
							<ImageFit
								source={{
									uri: image
								}}
								style={{
									marginTop: 15,
									width: '100%',
								}}
							/>
						) : null
					}
					{
						text ? (
							<View style={{ width: '100%', height, marginVertical: 25 }}>
								<WebView
									style={{
										backgroundColor: 'transparent',
										width: '100%',
									}}
									source={{ html: text, baseUrl: '', }}
									originWhitelist={['*']}
									onSizeUpdated={({ height }) => setHeight(height)}
									javaScriptEnabled={true}
									scrollEnabled={false}
									scalesPageToFit={false}
									automaticallyAdjustContentInsets={false}
									viewportContent="width=device-width, user-scalable=no"
								/>
							</View>
						) : null
					}
					<View style={{ height: 25 }} />
				</View>
			);

		case ExerciseTab.Stats:
			return (
				<FlatList
					snapToInterval={335}
					snapToAlignment="start"
					decelerationRate="fast"
					contentContainerStyle={styles.setCollection}
					showsHorizontalScrollIndicator={false}
					data={getStats(props.training, props.item?.exerciseId)}
					renderItem={(item: ListRenderItemInfo<TrainingExercise>) => (
						<View
							style={{
								backgroundColor: palette.cyan['40'],
								borderRadius: 8,
								width: 320,
							}}
						>
							<View
								style={{
									backgroundColor: '#F2F4F7',
									borderRadius: 8,
									marginLeft: 24,
								}}
							>
								<Text
									style={{
										color: '#112A50',
										fontSize: 16,
										lineHeight: 20,
										marginHorizontal: 15,
										marginTop: 15,
									}}
								>
									{item.item.exercise?.name ?? '-'}
								</Text>
								<View
									style={{
										marginHorizontal: 40,
										marginVertical: 15,
										flexDirection: 'row',
										flexWrap: 'wrap',
									}}
								>
									{
										item.item.rounds.map((round: TrainingRound, index: number) => (
											<View
												key={round.id}
												style={{
													flexDirection: 'column',
													marginLeft: index % 2 === 0 ? undefined : 30,
													marginTop: index <= 1 ? undefined : 20,
													width: 90,
													overflow: 'hidden',
												}}
											>
												<Text
													style={{
														color: '#112A50BF',
														fontFamily: 'Inter-Regular',
														fontSize: 14,
														lineHeight: 22,
													}}
												>
													{round.order + 1}-й подход
												</Text>
												<View
													style={{
														backgroundColor: '#fff',
														borderRadius: 8,
														alignItems: 'center',
														justifyContent: 'center',
														width: 90,
														height: 40,
													}}
												>
													<Text>
														{round.performedWeight ?? ''}{round.performedWeight ? ' кг' : ''}
													</Text>
												</View>
											</View>
										))
									}
								</View>
							</View>
						</View>
					)}
					keyExtractor={(item: TrainingExercise) => item.id}
					ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
					horizontal
				/>
			);
	}
};

export const TrainingScreen: React.FC = () => {
	const { user } = withUser();
	const info = useSelector((state: IState) => state.training.item);

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
			<KeyboardAvoidingView behavior="padding">
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
							<Tabs tab={tab} item={current} training={user?.training} />
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<View style={{ backgroundColor: 'white', flex: 1 }} />
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	top: {
		height: 190,
		// position: 'absolute',
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
	video: {
		width: '100%',
		height: 200,
		backgroundColor: 'black',
		borderRadius: 8,
	},
});
