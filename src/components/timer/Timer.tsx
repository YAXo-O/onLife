import * as React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import moment from 'moment';

import { formatTime } from '@app/utils/datetime';
import { Nullable, Optional } from '@app/objects/utility/Nullable';

import Clock from '@assets/icons/timer/timer.clock.svg';
import Cross from '@assets/icons/cross.svg';
import { NotificationService } from '@app/services/Notifications';

type FireTimer = (time: number) => void;
type TimerComponent = React.FC & { fire: FireTimer; stop: () => void };

const alertDuration = 5;
const offBounce = 2 * alertDuration;

let fire: FireTimer = (time: number) => console.log('Mock timer: ', time);
let stop: () => void = () => console.log('Stop timer');

function getDiff(time: number): number {
	const now = moment().unix(); // Current time in seconds

	return time - now;
}

function tryClearNotification(taskId: React.MutableRefObject<Optional<string>>) {
	if (taskId.current) {
		NotificationService.cancel(taskId.current)
			.then(() => console.log('Scheduled timer notification has been cancelled'))
			.catch((error) => console.warn('Failed to cancel scheduled timer notification'));
		taskId.current = null;
	}
}

export const Timer: TimerComponent = () => {
	const [time, setTime] = React.useState<Nullable<number>>(null);
	const [value, setValue] = React.useState<number>(() => 0);
	const insets = useSafeAreaInsets();
	const taskId = React.useRef<Nullable<string>>();

	fire = (value: number ) => {
		tryClearNotification(taskId);
		setTime(value);

		NotificationService.schedule({
			title: 'Перерыв окончен',
			body: 'Пора преступать к следующему подходу!',
		}, value)
			.then((id: string) => {
				console.log('Scheduled timer notification');
				taskId.current = id;
			})
			.catch((error) => console.warn('Failed to schedule timer notification: ', error));
	}
	stop = () => {
		tryClearNotification(taskId);
		setTime(null);
	}

	React.useEffect(() => {
		let timer: Nullable<number> = null;

		if (time !== null) {
			const handle = () => {
				const diff = getDiff(time);
				setValue(diff);

				if (diff < 0 && diff > -offBounce) {
					Vibration.vibrate();
					tryClearNotification(taskId);
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

			tryClearNotification(taskId);
			if (timer !== null) {
				clearTimeout(timer);
			}
		};
	}, [time]);

	if (time === null) return null;

	return (
		<View style={[styles.container, { top: 10 + insets.top }]}>
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

Timer.fire = (value: number) => fire(moment().unix() + value);
Timer.stop = () => stop();

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 10,
		right: 10,
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
