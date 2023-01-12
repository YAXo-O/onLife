import * as React from 'react';
import {
	FlatList,
	ListRenderItemInfo,
	View,
	Text, StyleSheet, TouchableOpacity, LayoutChangeEvent,
} from 'react-native';

import { ExerciseTabsProps } from '@app/screens/Internal/Training/ExerciseTabs';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { palette } from '@app/styles/palette';
import { TrainingRound } from '@app/objects/training/TrainingRound';
import { Nullable } from '@app/objects/utility/Nullable';
import { Training } from '@app/objects/training/Training';
import { OnlifeTrainingBlock } from '@app/objects/training/TrainingBlock';
import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';

import Up from '@assets/icons/stats/stats.chevron_up.svg';
import Down from '@assets/icons/stats/stats.chevron_down.svg';

function getBlocks(training: Nullable<Training> | undefined, exerciseId: Nullable<string> | undefined): Array<OnlifeTrainingBlock> {
	if (!training || !exerciseId) return [];

	const blocks: Array<OnlifeTrainingBlock> = [];

	training.blocks.forEach((block: OnlifeTrainingBlock) => {
		if (block.days.some((day: OnlifeTrainingDay) => day.exercises.some((exercise: TrainingExercise) => exercise.exerciseId === exerciseId))) {
			blocks.push(block);
		}
	})

	return blocks;
}

function getStats(block: OnlifeTrainingBlock, exerciseId: string): Array<TrainingExercise> {
	const result: Array<TrainingExercise> = [];

	block.days.forEach((day: OnlifeTrainingDay) => {
		day.exercises.forEach((exercise: TrainingExercise) => {
			if (exercise.exerciseId === exerciseId) {
				result.push(exercise);
			}
		});
	});

	return result;
}

interface StatsCardProps {
	item: TrainingExercise;
}

const StatsCard: React.FC<StatsCardProps> = (props: StatsCardProps) => {
	const [height, setHeight] = React.useState(() => 0);
	const [textWidth, setTextWidth] = React.useState(() => 0);
	const [textHeight, setTextHeight] = React.useState(() => 0);
	const width = 320;

	return (
		<View
			style={{
				backgroundColor: palette.cyan['40'],
				borderRadius: 8,
				width,
			}}
			onLayout={(event: LayoutChangeEvent) => {
				setHeight(event.nativeEvent.layout.height);
			}}
		>
			<View
				style={{
					position: 'absolute',
					transform: [
						{ translateY: (height - textHeight) / 2 },
						{ translateX: -textWidth / 2 + 12 },
						{ rotate: '-90deg' },
					],
				}}
				onLayout={(event: LayoutChangeEvent) => {
					setTextWidth(event.nativeEvent.layout.width);
					setTextHeight(event.nativeEvent.layout.height);
				}}
			>
				<Text
					style={{
						fontFamily: 'Inter-SemiBold',
						fontSize: 16,
						lineHeight: 18,
					}}
				>
					{props.item.order + 1} неделя
				</Text>
			</View>

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
					{props.item.exercise?.name ?? '-'}
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
						props.item.rounds.map((round: TrainingRound, index: number) => (
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
									<Text style={{ fontFamily: 'Inter-Light', fontSize: 20, lineHeight: 24, color: '#000000' }}>
										{round.performedWeight ?? ''}{round.performedWeight ? ' кг' : ''}
									</Text>
								</View>
							</View>
						))
					}
				</View>
			</View>
		</View>
	);
};

interface BlockProps {
	block: OnlifeTrainingBlock;
	exerciseId: string
}

export const StatsBlock: React.FC<BlockProps> = (props: BlockProps) => {
	const [collapsed, setCollapsed] = React.useState<boolean>(() => false);
	const list = getStats(props.block, props.exerciseId);

	if (!list || !list.length) return null;

	return (
		<View>
			<TouchableOpacity
				onPress={() => setCollapsed(collapsed => !collapsed)}
				style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 22, marginBottom: 15 }}
			>
				<Text style={{ fontFamily: 'Inter-Bold', fontSize: 20, lineHeight: 22, color: '#112A50' }}>
					Блок тренировок №{props.block.order + 1}
				</Text>
				<View style={{ marginLeft: 10 }}>
					{
						collapsed ? <Down fillPrimary="#63CDDA" /> : <Up fillPrimary="#63CDDA" />
					}
				</View>
			</TouchableOpacity>
			{
				collapsed
					? null : (
						<FlatList
							snapToInterval={335}
							snapToAlignment="start"
							decelerationRate="fast"
							contentContainerStyle={styles.statsCollection}
							showsHorizontalScrollIndicator={false}
							data={list}
							renderItem={(item: ListRenderItemInfo<TrainingExercise>) => (
								<StatsCard item={item.item} />
							)}
							keyExtractor={(item: TrainingExercise) => item.id}
							ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
							horizontal
						/>
					)
			}
		</View>
	);
};

type OwnProps = Omit<ExerciseTabsProps, 'tab' | 'onComplete'>;
export const StatsTab: React.FC<OwnProps> = (props: OwnProps) => {
	const exerciseId = props.item?.exerciseId;
	const blocks = getBlocks(props.training, exerciseId);

	if (!blocks || !blocks.length || !exerciseId) return null;

	return (
		<>
			{blocks.map((item: OnlifeTrainingBlock) => (
				<StatsBlock
					key={item.id}
					block={item}
					exerciseId={exerciseId}
				/>
			))}
		</>
	);
};

const styles = StyleSheet.create({
	statsCollection: {
		paddingHorizontal: 22,
		marginTop: 15,
		marginBottom: 50,
	},
});
