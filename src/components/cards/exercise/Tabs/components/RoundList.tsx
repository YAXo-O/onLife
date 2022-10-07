import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { WeightInput } from '../../../../input/WeightInput';
import { Timer } from '../../../../timer/Timer';
import { ExerciseRoundParams, ExerciseRoundType } from '../../../../../objects/program/TrainingProgram';
import { useTimer } from '../../../../../hooks/useTimer';
import { TrainingRound } from '../../../../../objects/training/TrainingRound';

interface OwnProps {
	completed: Array<TrainingRound>;
	rounds: Array<ExerciseRoundParams>;
	onSet: (value: number, id: number) => void;
	disabled?: boolean;
}

export const RoundList: React.FC<OwnProps> = (props: OwnProps) => {
	const [clock, setClock] = React.useState<number>(-1);
	useTimer(1000, () => setClock((clock: number) => clock + 1));

	return (
		<View style={styles.container}>
			<View style={{ marginBottom: props.completed.length ? 4 : 0 }}>
				{
					props.completed.map((q, id) => {
						const round = props.rounds[id];
						const useTimer = round.type === ExerciseRoundType.Regular && id < props.completed.length - 1;
						const disabled = props.disabled || (id > 0 && props.completed[id - 1].time === null);

						return (
							<View key={q.roundParamsId}>
								<View key={q?.roundParamsId} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
									<Text
										style={[styles.text, { textAlign: 'left', fontWeight: 'bold' }]}
									>
										{id + 1} подход
									</Text>

									<View style={{ flex: 1, flexDirection: 'column' }}>
										<Text style={[ styles.text, { textAlign: 'right' } ]}>
											{round.repeats} повторений
										</Text>
									</View>
								</View>
								<WeightInput
									value={props.completed[id].weight ?? undefined}
									defaultValue={!disabled && id > 0 ? (props.completed[id - 1].weight ?? undefined) : undefined}
									onChange={(value: number) => props.onSet(value, id)}
									disabled={disabled}
								/>
								{
									useTimer ? (
										<Timer
											time={round.interval}
											start={q.time}
											clock={clock}
											stop={props.completed[id + 1].time}
										/>
									) : null
								}
							</View>
						)
					})
				}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		margin: 16,
		marginTop: 0,
	},
	text: {
		color: '#555',
		textAlign: 'justify',
	},
});
