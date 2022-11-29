import * as React from 'react';
import {
	FlatList,
	ListRenderItemInfo,
	View,
	Text, StyleSheet,
} from 'react-native';

import { ExerciseTabsProps } from '@app/screens/Internal/Training/ExerciseTabs';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { palette } from '@app/styles/palette';
import { TrainingRound } from '@app/objects/training/TrainingRound';
import { Nullable } from '@app/objects/utility/Nullable';
import { Training } from '@app/objects/training/Training';
import { TrainingBlock } from '@app/objects/training/TrainingBlock';
import { TrainingDay } from '@app/objects/training/TrainingDay';

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

type OwnProps = Omit<ExerciseTabsProps, 'tab' | 'onComplete'>;
export const StatsTab: React.FC<OwnProps> = (props: OwnProps) => {
	return (
		<FlatList
			snapToInterval={335}
			snapToAlignment="start"
			decelerationRate="fast"
			contentContainerStyle={styles.statsCollection}
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
};

const styles = StyleSheet.create({
	statsCollection: {
		paddingHorizontal: 22,
	},
});
