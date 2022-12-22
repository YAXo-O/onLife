import * as React from 'react';
import Video, { LoadError, OnLoadData, OnProgressData, } from 'react-native-video';
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	Text,
	Modal, StatusBar,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';

import { Nullable } from '@app/objects/utility/Nullable';
import { formatTime } from '@app/utils/datetime';

import Pause from '@assets/icons/audio-player/audio-player.pause.svg';
import Play from '@assets/icons/audio-player/audio-player.play.svg';
import EnterFullscreen from '@assets/icons/video-player/video-player.fullscreen.enter.svg';
import ExitFullscreen from '@assets/icons/video-player/video-player.fullscreen.exit.svg';

interface OwnProps {
	source: string;
}

interface PlayerProps {
	fullscreen: boolean;
	toggleFullscreen: () => void;
}

type Props = OwnProps & PlayerProps;

const Player: React.FC<Props> = (props: Props) => {
	const [paused, setPaused] = React.useState<boolean>(() => true);
	const [time, setTime] = React.useState<number>(() => 0);
	const [controls, setControls] = React.useState<boolean>(() => true);

	const source = props.source.replace(':443', '');
	const meta = React.useRef<OnLoadData>();
	const player = React.useRef<Nullable<Video>>();

	return (
		<>
			<TouchableWithoutFeedback
				onPress={() => setControls((state: boolean) => !state)}
			>
				<Video
					paused={paused}
					currentTime={time}
					source={{ uri: source }}
					resizeMode="contain"
					style={styles.player}
					onError={(error: LoadError) => console.log(error.error)}
					onLoad={(data: OnLoadData) => meta.current = data}
					onProgress={(data: OnProgressData) => setTime(data.currentTime)}
					onEnd={() => setPaused(true)}
					ref={ref => player.current = ref}
					fullscreen={props.fullscreen}
					fullscreenOrientation="landscape"
					bufferConfig={{
						minBufferMs: 4000,
						maxBufferMs: 10000,
					}}
				/>
			</TouchableWithoutFeedback>
			{
				controls ? (
					<>
						<View style={styles['fullscreen-controls']}>
							<TouchableWithoutFeedback
								onPress={props.toggleFullscreen}
							>
								{
									props.fullscreen ? (
										<ExitFullscreen
											fillPrimary="rgba(255, 255, 255, 0.8)"
										/>
									) : (
										<EnterFullscreen
											fillPrimary="rgba(255, 255, 255, 0.8)"
										/>
									)
								}
							</TouchableWithoutFeedback>
						</View>
						<View style={styles['playback-controls']}>
							<TouchableWithoutFeedback
								onPress={() => {
									if (meta.current?.duration && time >= meta.current?.duration) {
										player.current?.seek(0);
									}

									setPaused((state: boolean) => !state)
								}}
							>
								<View style={styles['playback-controls__action']}>
									{
										paused
											? <Play fillPrimary="rgba(255, 255, 255, 0.8)" />
											: <Pause fillPrimary="rgba(255, 255, 255, 0.8)" />
									}
								</View>
							</TouchableWithoutFeedback>
						</View>
						<View style={styles['time-controls']}>
							<View style={styles['time-controls__row']}>
								<Text style={styles.text}>{formatTime(time)}</Text>
								<Text style={styles.text}>{formatTime(meta?.current?.duration ?? 0)}</Text>
							</View>
							<Slider
								minimumValue={0}
								maximumValue={1}
								value={meta.current?.duration ? time / meta.current.duration : 0}
								onSlidingComplete={(raw: number | Array<number>) => {
									const duration = meta.current?.duration;
									if (!duration) return;

									const isArray = Array.isArray(raw);
									const value = (isArray ? raw[0] : raw) * duration;

									if (value === time) return;

									setTime(value);
									player.current?.seek(value);
								}}
								minimumTrackTintColor="#63CDDA"
								maximumTrackTintColor="rgba(0, 0, 0, 0.7)"
								thumbTintColor="#63CDDA"
								containerStyle={{ height: 12 }}
								trackStyle={styles['time-controls__track']}
								thumbStyle={styles['time-controls__thumb']}
								trackClickable
							/>
						</View>
					</>
				) : null
			}
		</>
	);
};

export const VideoPlayer: React.FC<OwnProps> = (props: OwnProps) => {
	const [fullscreen, setFullscreen] = React.useState<boolean>(() => false);
	const toggle = () => setFullscreen((state: boolean) => !state);

	if (fullscreen) {
		return (
			<Modal
				visible
				animationType="fade"
			>
				<StatusBar translucent={false} />
				<View style={{ backgroundColor: 'black', flex: 1 }}>
					<Player {...props} fullscreen={fullscreen} toggleFullscreen={toggle} />
				</View>
			</Modal>
		);
	}

	return (
		<View style={styles.container}>
			<Player {...props} fullscreen={fullscreen} toggleFullscreen={toggle} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: 'hidden',
		borderRadius: 10,
		backgroundColor: '#5B5B5B',
	},
	player: {
		flex: 1,
	},
	'fullscreen-controls': {
		position: 'absolute',
		right: 8,
		top: 8,
	},
	'playback-controls': {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	'playback-controls__action': {
		width: 64,
		height: 64,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		borderRadius: 32,
	},
	'time-controls': {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		paddingHorizontal: 12,
	},
	'time-controls__row': {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 2,
	},
	'time-controls__track': {
		borderRadius: 0,
		height: 4,
	},
	'time-controls__thumb': {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	text: {
		fontFamily: 'Inter',
		fontSize: 12,
		lineHeight: 14,
		color: '#fff'
	},
});
