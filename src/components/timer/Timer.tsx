import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import TimerIcon from '../../../assets/icons/timer.svg';
import { Nullable } from '@app/objects/utility/Nullable';

interface TimerProps {
	// Time (in seconds)
	time: number;
}

export const Timer: React.FC<TimerProps> = (props: TimerProps) => {
	const [time, setTime] = React.useState<number>(() => props.time);
	const launch = React.useRef<Nullable<number>>(null);

	React.useEffect(() => {
		setTime(props.time);
		if (launch.current) {
			clearInterval(launch.current);
		}

		launch.current = setInterval(() => setTime((time: number) => time - 1), 1000);

		return () => {
			if (launch.current) {
				clearInterval(launch.current);
			}
		};
	}, [props.time]);

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
