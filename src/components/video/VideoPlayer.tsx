import * as React from 'react';
import Video, { OnProgressData } from 'react-native-video';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Nullable } from '@app/objects/utility/Nullable';

import Play from '@assets/icons/audio-player/play.svg'
import { formatTime } from '@app/utils/datetime';

interface OwnProps {
	source: string;
}

export const VideoPlayer: React.FC<OwnProps> = (props: OwnProps) => {
	const ref = React.useRef<Nullable<Video>>(null);
	const [play, setPlay] = React.useState<boolean>(() => false);
	const [time, setTime] = React.useState<number>(() => 0);

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => setPlay(value => !value)}
		>
			<Video
				ref={ref}
				source={{ uri: props.source }}
				resizeMode="cover"
				style={styles.player}
				paused={!play}
				onProgress={(data: OnProgressData) => setTime(data.currentTime)}
			/>
			<View
				style={[styles.overlay, { opacity: play ? 0 : 1 }]}
			>
				<View style={styles.action}>
					<Play width={45} height={55} />
				</View>
				<View style={styles.timer}>
					<Text style={styles['timer-text']}>{formatTime(time)}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: 'hidden',
		borderRadius: 10,
	},
	player: {
		flex: 1,
	},
	overlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: '#5B5B5BAA',
		alignItems: 'center',
		justifyContent: 'center',
	},
	action: {
		width: 75,
		height: 75,
		backgroundColor: '#D9D9D9',
		borderRadius: 37.5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	timer: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		backgroundColor: '#000',
		paddingHorizontal: 4,
		paddingVertical: 2,
	},
	'timer-text': {
		color: '#fff',
		fontFamily: 'Inter',
		fontSize: 14,
		lineHeight: 16,
	},
});
