import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import TimerIcon from '../../../assets/icons/timer.svg';

interface TimerProps {
	start: number | undefined; // When timer was launched
	stop: number | undefined;
	time: number; // What is timer's duration (in seconds)
	clock: number; // Current time
}

/**
 * Format time from seconds to mm:ss
 * @param time - time (in seconds)
 */
function format(time: number): string {
	const minutes = Math.abs(Math.round(time / 60)).toString(10);
	const seconds = Math.abs(time % 60).toString(10);

	return `${time < 0 ? '-' : ''}${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
}

function getTime(time: number, start: number | undefined, stop: number | undefined): number {
	if (start === undefined) return time;

	const end = stop ?? (+new Date());
	const diff = (end - start) / 1000;

	return Math.round(time - diff);
}

export const Timer: React.FC<TimerProps> = (props: TimerProps) => {
	const [time, setTime] = React.useState(0);

	React.useEffect(() => {
		const value = getTime(props.time, props.start, props.stop);
		setTime(value);
	}, [props.time, props.start, props.clock]);

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Отдых</Text>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<TimerIcon width={16} height={16} />
				<Text style={[styles.text, { marginLeft: 4 } ]}>{format(time)}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(107, 30, 87, 1)',
		paddingHorizontal: 8,
		paddingVertical: 8,
		borderRadius: 8,
		marginTop: 8,
		marginBottom: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	text: {
		color: 'rgba(255, 255, 255, 0.8)'
	}
});
