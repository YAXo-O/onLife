import * as React from 'react';
import {
	useDispatch,
	useSelector,
} from 'react-redux';
import {
	View,
	Text,
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
} from 'react-native';

import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';
import { IState } from '@app/store/IState';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { TrainingRound } from '@app/objects/training/TrainingRound';
import { ExerciseTabsProps } from '@app/screens/Internal/Training/ExerciseTabs';
import { WeightInput } from '@app/components/input/WeightInput';
import { Nullable } from '@app/objects/utility/Nullable';
import { WithOrder } from '@app/objects/utility/WithOrder';
import { Timer } from '@app/components/timer/Timer';
import { now } from '@app/utils/datetime';

function getRounds(exercise?: Nullable<TrainingExercise>): Array<TrainingRound> {
	if (!exercise) return [];

	return exercise.rounds.sort((a: WithOrder, b: WithOrder) => a.order - b.order) ?? [];
}

type TrainingTabProps = Omit<ExerciseTabsProps, 'tab'>;
export const TrainingTab: React.FC<TrainingTabProps> = (props: TrainingTabProps) => {
	const dispatch = useDispatch();
	const ref = React.useRef<Nullable<FlatList>>(null);
	const actions = new LocalActionCreators('training');

	const day = useSelector((state: IState) => state.training.item?.active);
	if (!day) return null;

	const current = props.item;
	const values = day.exercises.find((item: TrainingExercise) => item.id === current?.id);
	if (!values) return null;

	const rounds = getRounds(values);

	const onChange = (value: number, roundId: string) => {
		if (!values) return;

		const id = values.rounds.findIndex(q => q.id === roundId);
		if (id < 0) return;

		const current = values.rounds[id];
		values.rounds[id] = {
			...current,
			performedWeight: value,
			time: current.time ?? now(),
		};
		const finished = values.rounds.reduce((acc: boolean, cur: TrainingRound) => acc && Boolean(cur.time), true);

		const exerciseId = day.exercises.findIndex((item: TrainingExercise) => item.id === values.id);
		if (exerciseId < 0) return;

		day.exercises[exerciseId] = {
			...day.exercises[exerciseId],
			time: day.exercises[exerciseId]?.time ?? (finished ? now() : null),
		};

		dispatch(actions.set({ active: day }));
	}

	const goNext = (index: number) => {
		if (index < rounds.length - 1) {
			ref.current?.scrollToIndex({ animated: true, index: index + 1 });
		} else {
			ref.current?.scrollToIndex({ animated: true, index: 0 })
			props.onComplete();
		}
	};

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
				data={rounds}
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
							<WeightInput
								value={item.item.performedWeight ?? undefined}
								onEnd={(value?: number) => {
									if (value === undefined) return;

									if (item.item.time === null) {
										Timer.fire(item.item.interval);
									}

									onChange(value, item.item.id);
									goNext(item.index);
								}}
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
								disabled={Boolean(day?.time)}
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
				ref={ref}
				showsHorizontalScrollIndicator={false}
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
};

const styles = StyleSheet.create({
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
