import * as React from 'react';
import {
	View,
	Text,
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
} from 'react-native';

import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { TrainingRound } from '@app/objects/training/TrainingRound';
import { ExerciseTabsProps } from '@app/screens/Internal/Training/TrainingTabs/ExerciseTabs';
import { Nullable } from '@app/objects/utility/Nullable';
import { WithOrder } from '@app/objects/utility/WithOrder';
import { Timer } from '@app/components/timer/Timer';
import { now } from '@app/utils/datetime';
import { hasValue } from '@app/utils/value';
import { TrainingRoundCard } from '@app/components/cards/training/TrainingRoundCard';
import { KeysByValue } from '@app/types/Utility';

function getRounds(exercise?: Nullable<TrainingExercise>): Array<TrainingRound> {
	if (!exercise) return [];

	return exercise.rounds
		.sort((a: WithOrder, b: WithOrder) => a.order - b.order) ?? [];
}

function isExerciseFinished(exercise?: Nullable<TrainingExercise>): boolean {
	if (!exercise) return false;
	if (Boolean(exercise.time)) return true;

	return exercise.rounds.reduce((acc, cur) => acc && Boolean(cur.time), true)
}

type TrainingTabProps = Omit<ExerciseTabsProps, 'tab' | 'training'>;
export const TrainingTab: React.FC<TrainingTabProps> = (props: TrainingTabProps) => {
	const ref = React.useRef<Nullable<FlatList>>(null);
	const rounds = React.useMemo(() => getRounds(props.item), [props.item]);

	const goNext = (index: number) => {
		if (index < rounds.length - 1) {
			ref.current?.scrollToIndex({ animated: true, index: index + 1 });
		} else {
			ref.current?.scrollToIndex({ animated: true, index: 0 });
		}
	};

	const fireTimer = (index: number) => {
		const round = rounds[index];

		Timer.fire(round.interval);
	}

	const onChange = (value: number | undefined, id: number, field: KeysByValue<TrainingRound, Nullable<number>>) => {
		if (!props.item) return;
		if (!hasValue(value)) return;

		const current: TrainingRound = {
			...props.item.rounds[id],
			[field]: value,
		};

		const complete = hasValue(current.performedWeight) || hasValue(current.performedDuration);
		if (complete) {
			if (!current.time) {
				goNext(id);
				fireTimer(id);
			}

			current.time = current.time ?? now();
		}

		const exercise: TrainingExercise = {
			...props.item,
			rounds: props.item.rounds.map((round: TrainingRound) => {
				if (round.id === current.id) return current;

				return round;
			}),
		};

		if (isExerciseFinished(exercise)) {
			exercise.time = exercise.time ?? now();
		}

		props.onChange(exercise);
	}

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
				{props.item?.exercise?.name}
			</Text>

			<FlatList
				snapToInterval={315}
				snapToAlignment="start"
				decelerationRate="fast"
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={styles.setCollection}
				data={rounds}
				renderItem={(item: ListRenderItemInfo<TrainingRound>) => (
					<TrainingRoundCard
						value={item.item}
						onChange={(value: number | undefined, key: KeysByValue<TrainingRound, Nullable<number>>) => onChange(value, item.index, key)}
						disabled={props.disabled}
					/>
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
					*Данные вносите после выполнения подхода
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	setCollection: {
		paddingHorizontal: 22,
	},
});
