import * as React from 'react';
import { View, Text } from 'react-native';
import { VideoPlayer } from '@app/components/video/VideoPlayer';
import { AudioPlayer } from '@app/components/audio/AudioPlayer';
import { ExerciseTabsProps } from '@app/screens/Internal/Training/ExerciseTabs';

type OwnProps = Omit<ExerciseTabsProps, 'tab' | 'onComplete'>;
export const MediaTab: React.FC<OwnProps> = (props: OwnProps) => {
	const item = props.item?.exercise;

	const video = item?.video;
	const audio = item?.audio;
	const name = item?.name ?? 'Упражнение';

	return (
		<View style={{ paddingHorizontal: 8, paddingVertical: 0 }}>
			{
				video ? (
					<View style={{
						paddingHorizontal: 14,

						marginBottom: 10,
						width: '100%',
						aspectRatio: 16 / 9,
					}}>
						<VideoPlayer
							source={video}
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
