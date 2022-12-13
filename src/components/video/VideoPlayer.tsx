import * as React from 'react';
import Video, { LoadError, OnBufferData } from 'react-native-video';
import { StyleSheet, View } from 'react-native';

interface OwnProps {
	source: string;
}

export const VideoPlayer: React.FC<OwnProps> = (props: OwnProps) => {
	const source = props.source.replace(':443', '');

	return (
		<View
			style={styles.container}
		>
			<Video
				controls
				source={{ uri: source }}
				resizeMode="cover"
				style={styles.player}
				onError={(error: LoadError) => console.log(error.error)}
				onBuffer={(data: OnBufferData) => console.log(data.isBuffering)}
			/>
		</View>
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
