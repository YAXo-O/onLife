import * as React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Vibration,
} from 'react-native';

import { formatTime } from '@app/utils/datetime';
import { Nullable } from '@app/objects/utility/Nullable';

import Clock from '@assets/icons/timer/timer.clock.svg';
import Cross from '@assets/icons/cross.svg';

type FireTimer = (time: number) => void;
type TimerComponent = React.FC & { fire: FireTimer; stop: () => void };

const alertDuration = 5;
const offBounce = 2 * alertDuration;

let fire: FireTimer = (time: number) => console.log('Mock timer: ', time);
let stop: () => void = () => console.log('Stop timer');

function getDiff(time: number): number {
	const now = +(new Date()) / 1000;

	return time - now;
}

export const Timer: TimerComponent = () => {
	const [time, setTime] = React.useState<Nullable<number>>(null);
	const [value, setValue] = React.useState<number>(() => 0);

	fire = setTime;
	stop = () => setTime(null);

	React.useEffect(() => {
		let timer: Nullable<number> = null;

		if (time !== null) {
			const handle = () => {
				const diff = getDiff(time);
				setValue(getDiff(time));

				if (diff < 0 && diff > -offBounce) {
					Vibration.vibrate();
				}

				if (diff < -offBounce) {
					setTime(null);
				}
			};

			handle();
			timer = setInterval(handle, 1000);
		}

		return () => {
			Vibration.cancel();

			if (timer !== null) {
				clearTimeout(timer);
			}
		};
	}, [time]);

	if (time === null) return null;

	return (
		<View style={styles.container}>
			<Clock width={45} height={45} />
			<Text style={styles.text}>Отдых</Text>
			<Text style={styles.counter}>{formatTime(Math.max(value, 0))}</Text>
			<TouchableOpacity
				style={styles.action}
				onPress={() => setTime(null)}
			>
				<Cross
					width={20}
					height={20}
					fillPrimary="#fff"
				/>
			</TouchableOpacity>
		</View>
	);
}

Timer.fire = (value: number) => fire(+(new Date()) / 1000 + value);
Timer.stop = () => stop();

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 10,
		right: 10,
		top: 10,
		height: 90,
		backgroundColor: '#7A7A7AE5',
		paddingHorizontal: 10,
		paddingVertical: 22,
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	text: {
		fontFamily: 'Inter-SemiBold',
		fontSize: 16,
		lineHeight: 20,
		color: '#fff',
		marginLeft: 10,
	},
	counter: {
		fontFamily: 'Inter-Bold',
		fontSize: 32,
		lineHeight: 43,
		color: '#fff',
		marginLeft: 30,
	},
	action: {
		position: 'absolute',
		right: 10,
		top: 10,
	}
});
