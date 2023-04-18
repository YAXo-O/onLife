import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import moment from 'moment';

import { RepeatsInput } from '@app/components/input/RepeatsInput';
import { WeightInput } from '@app/components/input/WeightInput';
import { TrainingRound } from '@app/objects/training/TrainingRound';
import { KeysByValue } from '@app/types/Utility';
import { Nullable } from '@app/objects/utility/Nullable';
import { formatTime } from '@app/utils/datetime';
import { ActionButton, ActionType } from '@app/components/buttons/ActionButton';
import { NotificationService } from '@app/services/Notifications';

interface TrainingRoundCardProps {
	value: TrainingRound;
	onChange: (value: number | undefined, key: KeysByValue<TrainingRound, Nullable<number>>) => void;
	disabled?: boolean;
}

function getButtonTitle(completed: boolean, busy: boolean): string {
	if (completed) return 'Выполнен';
	if (busy) return 'Остановить';

	return 'Начать';
}

const TrainingRoundCardFitness: React.FC<TrainingRoundCardProps> = (props: TrainingRoundCardProps) => {
	const [time, setTime] = React.useState<number>(props.value.duration ?? 0);
	const [busy, setBusy] = React.useState<boolean>(() => false);

	const timer = React.useRef<Nullable<number>>(null);
	const end = React.useRef<Nullable<number>>(null);
	const task = React.useRef<Nullable<string>>(null);

	const timeout = () => {
		if (end.current === null) return;
		if (props.value.duration === null) return;

		const diff = end.current - moment().unix();
		setTime(Math.max(diff, 0));

		if (timer.current !== null && diff <= 0) {
			clearInterval(timer.current);
			timer.current = null;
			setBusy(false);
		}
	}

	React.useEffect(() => {
		return () => {
			if (timer.current !== null) {
				clearInterval(timer.current);
				timer.current = null;
			}

			if (task.current !== null) {
				NotificationService.cancel(task.current);
			}
		}
	}, []);

	React.useEffect(() => {
		if (time === 0) {
			props.onChange(props.value.duration ?? 0, 'performedDuration');
		}
	}, [time]);

	return (
		<>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 30,
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Text
					style={{
						fontFamily: 'Inter-Medium',
						fontSize: 16,
						lineHeight: 20,
						color: '#000',
						width: 115,
					}}
				>
					Время
				</Text>
				<Text
					style={{
						fontFamily: 'Inter-Light',
						fontSize: 20,
						lineHeight: 24,
						color: '#000',
					}}
				>
					{formatTime(props.value.time ? props.value.performedDuration ?? 0 : time)}
				</Text>
			</View>

			<ActionButton
				text={getButtonTitle(Boolean(props.value.time) || props.disabled, busy)}
				disabled={Boolean(props.value.time) || props.disabled}
				style={{ marginTop: 15 }}
				type={busy ? ActionType.Secondary : ActionType.Primary}
				onPress={() => {
					if (busy) {
						end.current = null;
						setTime(props.value.duration ?? 0);

						if (timer.current) {
							clearInterval(timer.current);
							timer.current = null;
						}

						if (task.current) {
							NotificationService.cancel(task.current);
						}
					} else {
						const value = moment().unix() + (props.value.duration ?? 0);
						end.current = value; // Time from epoch (in seconds);
						timer.current = setInterval(timeout, 1000);
						NotificationService.schedule({
							title: 'Подход окончен',
							body: 'Настало время перевести дыхание',
						}, value)
							.then((taskId) => task.current = taskId)
							.catch((error) => console.warn(`Не удалось поставить в очередь задачу (подход): `, error));
					}

					setBusy((state) => !state);
				}}
			/>
		</>
	)
}
const TrainingRoundCardPower: React.FC<TrainingRoundCardProps> = (props: TrainingRoundCardProps) => (
	<>
		<View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
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
			<RepeatsInput
				value={props.value.performedRepeats ?? undefined}
				placeholder={props.value.repeats ?? undefined}
				onEnd={(value?: number) => props.onChange(value, 'performedRepeats')}
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
				disabled={props.disabled}
			/>
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
				value={props.value.performedWeight ?? undefined}
				placeholder={props.value.weight ?? undefined}
				onEnd={(value?: number) => props.onChange(value, 'performedWeight')}
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
				disabled={props.disabled}
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
	</>
);

export const TrainingRoundCard: React.FC<TrainingRoundCardProps> = (props: TrainingRoundCardProps) => {
	const Content: React.FC<TrainingRoundCardProps> = typeof props.value.duration === 'number'
		? TrainingRoundCardFitness
		: TrainingRoundCardPower;

	return (
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
					SET {props.value.order + 1}
				</Text>
			</View>

			<Content
				value={props.value}
				onChange={props.onChange}
				disabled={props.disabled}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	setCard: {
		backgroundColor: '#F2F4F7',
		padding: 20,
		borderRadius: 8,
		width: 300,
	},
});
