import * as React from 'react';
import { View, Text } from 'react-native';
import { URL } from 'react-native-url-polyfill';
import YoutubeIframe from 'react-native-youtube-iframe';

import { AudioPlayer } from '@app/components/audio/AudioPlayer';
import { ExerciseTabsProps } from '@app/screens/Internal/Training/ExerciseTabs';

type OwnProps = Omit<ExerciseTabsProps, 'tab' | 'onComplete'>;
export const MediaTab: React.FC<OwnProps> = (props: OwnProps) => {
	const item = props.item?.exercise;

	const video = item?.video;
	const audio = item?.audio;
	const name = item?.name ?? 'Упражнение';
	const url = video ? new URL(video).search.get('v') : null;

	return (
		<View style={{ paddingHorizontal: 8, paddingVertical: 0 }}>
			{
				url ? (
					<View style={{
						paddingHorizontal: 14,
						marginBottom: 10,
						height: 200,
					}}>
						<YoutubeIframe
							height={200}
							videoId={url}
						/>
					</View>
				) : null
			}
			<View style={{ paddingHorizontal: 14, }}>
				<Text style={{ color: '#000', fontFamily: 'Inter-Medium', fontSize: 16, lineHeight: 24 }}>
					{name}
				</Text>
			</View>
			{
				audio ? (
					<View style={{ marginVertical: 20 }}>
						<AudioPlayer
							title={name}
							source={audio}
						/>
					</View>
				) : null
			}
		</View>
	);
};
