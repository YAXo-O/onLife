import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { WeightInput } from '../../../../input/WeightInput';
import { Timer } from '../../../../timer/Timer';
import { CurrentTrainingRound } from '../../../../../store/Types';
import { ExerciseRoundParams } from '../../../../../objects/program/TrainingProgram';
import { useTimer } from '../../../../../hooks/useTimer';

interface OwnProps {
	completed: Array<CurrentTrainingRound>;
	rounds: Array<ExerciseRoundParams>;
	onSet: (value: number, id: number) => void;
}

export const RoundList: React.FC<OwnProps> = (props: OwnProps) => {
	const [clock, setClock] = React.useState<number>(-1);
	useTimer(1000, () => setClock((clock: number) => clock + 1));

	return (
		<View style={styles.container}>
			<View style={{ marginBottom: props.completed.length ? 4 : 0 }}>
				{
					props.completed.map((q, id) => (
						<View key={q.roundId}>
							<View key={q?.roundId} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text
									style={[styles.text, { textAlign: 'left', fontWeight: 'bold' }]}
								>
									{id + 1} подход
								</Text>

								<View style={{ flex: 1, flexDirection: 'column' }}>
									<Text style={[ styles.text, { textAlign: 'right' } ]}>
										{props.rounds[id].repeats} повторений
									</Text>
								</View>
							</View>
							<WeightInput
								value={props.completed[id].weight}
								onChange={(value: number) => props.onSet(value, id)}
							/>
							{
								id < props.completed.length - 1 ? (
									<Timer
										time={props.rounds[id].interval}
										start={q.timestamp}
										clock={clock}
										stop={props.completed[id + 1].timestamp}
									/>
								) : null
							}
						</View>
					))
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
