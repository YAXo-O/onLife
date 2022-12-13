import * as React from 'react';
import {
	StyleSheet,
	Text,
	View, TouchableOpacity,
} from 'react-native';
import Sound from 'react-native-sound';

import Play from '@assets/icons/audio-player/audio-player.play.svg';
import Pause from '@assets/icons/audio-player/audio-player.pause.svg';
import SkipLeft from '@assets/icons/audio-player/audio-player.skip-left.svg';
import SkipRight from '@assets/icons/audio-player/audio-player.skip-right.svg';
import VolumeDown from '@assets/icons/audio-player/audio-player.volume-down.svg';
import VolumeUp from '@assets/icons/audio-player/audio-player.volume-up.svg';

import { Nullable } from '@app/objects/utility/Nullable';
import { clamp } from '@app/utils/math';
import { formatTime } from '@app/utils/datetime';

interface OwnProps {
	title: string;
	source: string;
}

Sound.setCategory('Playback');

interface AudioProgressControlProps {
	sound: Nullable<Sound>;
	time: number;
}

const AudioProgressControl: React.FC<AudioProgressControlProps> = (props: AudioProgressControlProps) => {
	const sound = props.sound;
	const progress = sound?.getDuration() ? (props.time / sound?.getDuration()) * 100 : 0;

	return (
		<>
			<View style={[styles['progress-bar'], { marginTop: 25 }]}>
				<View style={[styles['progress-bar__track'], { width: `${progress}%` }]} />
				<View style={[styles['progress-bar__control'], { left: `${progress}%` }]} />
			</View>
			<View style={styles['time-row']}>
				<Text style={styles.time}>{formatTime(props.time)}</Text>
				<Text style={styles.time}>{formatTime(props.sound?.getDuration() ?? 0)}</Text>
			</View>
		</>
	);
};

interface ControlsProps {
	playing: boolean;
	togglePlay: () => void;

	time: number;
	changeTime: (time: number) => void;
}

const Controls: React.FC<ControlsProps> = (props: ControlsProps) => {
	return (
		<View style={styles['controls-container']}>
			<TouchableOpacity
				style={styles['controls-container__action']}
				onPress={() => props.changeTime(props.time - 15)}
			>
				<SkipLeft width={25} height={25} />
			</TouchableOpacity>
			<TouchableOpacity
				style={styles['controls-container__action']}
				onPress={() => props.togglePlay()}
			>
				{
					props.playing
						? <Pause width={35} height={35} />
						: <Play width={45} height={45} />
				}
			</TouchableOpacity>
			<TouchableOpacity
				style={styles['controls-container__action']}
				onPress={() => props.changeTime(props.time + 15)}
			>
				<SkipRight width={25} height={25} />
			</TouchableOpacity>
		</View>
	);
};

interface VolumeProgressControlProps {
	value: number;
	onChange: (value: number) => void;
}

const VolumeProgressControl: React.FC<VolumeProgressControlProps> = (props: VolumeProgressControlProps) => {
	return (
		<View style={styles['volume-row']}>
			<TouchableOpacity
				onPress={() => props.onChange(props.value - 0.1)}
			>
				<VolumeDown />
			</TouchableOpacity>
			<View style={styles['volume-bar']}>
				<View style={[styles['volume-bar__control'], { left: `${props.value * 100}%` }]} />
			</View>
			<TouchableOpacity
				onPress={() => props.onChange(props.value + 0.1)}
			>
				<VolumeUp />
			</TouchableOpacity>
		</View>
	);
};

const interval = 250; // Update time slider frequency
export const AudioPlayer: React.FC<OwnProps> = (props: OwnProps) => {
	const [playing, setPlaying] = React.useState<boolean>(() => false);
	const [volume, setVolume] = React.useState<number>(() => 0.5);
	const [time, setTime] = React.useState<number>(() => 0);
	const audio = React.useRef<Nullable<Sound>>(null);

	const updateHandler = () => {
		const sound = audio.current
		if (!sound) return;

		if (sound.isLoaded() && sound.isPlaying()) {
			sound.getCurrentTime(setTime);
		}
	};

	const changeTime = (time: number) => {
		if (!audio.current) return;

		const value = clamp(0, audio.current.getDuration(), time);
		audio.current.setCurrentTime(value);
		setTime(value);
	}

	const changeVolume = (volume: number) => {
		if (!audio.current) return;

		const value = clamp(0, 1, volume);
		audio.current.setVolume(volume);
		setVolume(value);
	}

	const togglePlay = () => {
		if (!audio.current) return;

		if (playing) {
			setPlaying(false);
			audio.current.pause();
		} else {
			setPlaying(true);
			audio.current.play();
		}
	};

	React.useEffect(() => {
		audio.current?.release();

		const sound = new Sound(props.source.replace(':443', ''), undefined, (error) => {
			if (error) {
				console.warn('Unable to play audio: ', error);
			} else {
				audio.current = sound;
				setVolume(sound.getVolume());
			}
		});

		return () => {
			sound.release();
		};
	}, [props.source]);

	React.useEffect(() => {
		const timer = setInterval(updateHandler, interval);

		return () => clearInterval(timer);
	}, []);

	return (
		<View style={styles.card}>
			<View>
				<Text style={styles.caption}>
					Аудиозапись
				</Text>
			</View>
			<View style={{ marginTop: 5 }}>
				<Text style={styles.title} numberOfLines={1}>
					{props.title}
				</Text>
			</View>
			<AudioProgressControl
				sound={audio.current}
				time={time}
			/>
			<Controls
				playing={playing}
				togglePlay={togglePlay}
				time={time}
				changeTime={changeTime}
			/>
			<VolumeProgressControl
				value={volume}
				onChange={changeVolume}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#F2F4F7CC',
		borderRadius: 12,
		padding: 25,
		flexDirection: 'column',
	},
	caption: {
		fontFamily: 'Inter',
		fontSize: 12,
		lineHeight: 16,
		color: '#112A50BF',
	},
	title: {
		fontFamily: 'Inter',
		fontSize: 16,
		lineHeight: 20,
		color: '#112A50',
	},
	time: {
		fontFamily: 'Inter',
		fontSize: 12,
		lineHeight: 14,
		color: '#000'
	},
	'progress-bar': {
		backgroundColor: '#000000B2',
		borderRadius: 4,
		height: 4,
		width: '100%',
	},
	'progress-bar__track': {
		backgroundColor: '#63CDDA',
		height: '100%',
		borderTopLeftRadius: 4,
		borderBottomLeftRadius: 4,
		width: 0,
	},
	'progress-bar__control': {
		position: 'absolute',
		backgroundColor: '#63CDDA',
		width: 8,
		height: 8,
		borderRadius: 8,
		top: -2,
		transform: [{ translateX: -4 }],
	},
	'time-row': {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},
	'controls-container': {
		marginHorizontal: 75,
		marginVertical: 30,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	'controls-container__action': {
		alignItems: 'center',
		justifyContent: 'center',
		width: 35,
		height: 35,
	},
	'volume-row': {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 25,
	},
	'volume-bar': {
		flex: 1,
		backgroundColor: '#000000B2',
		borderRadius: 4,
		height: 4,
		marginHorizontal: 15,
	},
	'volume-bar__control': {
		position: 'absolute',
		top: -8,
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: '#fff',
		transform: [{
			translateX: -10,
		}],
		elevation: 1,
	},
});
