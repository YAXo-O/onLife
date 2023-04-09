import * as React from 'react';
import { View, Text } from 'react-native';
import WebView from 'react-native-autoheight-webview';

import { ExerciseTabsProps } from '@app/screens/Internal/Training/ExerciseTabs';
import { ImageFit } from '@app/components/image/ImageFit';

type OwnProps = Omit<ExerciseTabsProps, 'tab' | 'onChange' | 'training' | 'disabled'>;
export const MaterialTab: React.FC<OwnProps> = (props: OwnProps) => {
	const item = props.item?.exercise;
	const [height, setHeight] = React.useState<number | undefined>(() => undefined);

	const image = item?.image;
	const text = item?.description ?? '';
	const name = item?.name ?? 'Упражнение';

	return (
		<View style={{ paddingHorizontal: 22 }}>
			<Text
				style={{
					color: '#000',
					fontFamily: 'Inter-Medium',
					fontSize: 20,
					lineHeight: 24,
					textAlign: 'center',
				}}
			>
				{name}
			</Text>
			{
				image ? (
					<ImageFit
						source={{
							uri: image
						}}
						style={{
							marginTop: 15,
							width: '100%',
						}}
					/>
				) : null
			}
			{
				text ? (
					<View style={{ width: '100%', height, marginVertical: 25 }}>
						<WebView
							style={{
								backgroundColor: 'transparent',
								width: '100%',
							}}
							source={{ html: text, baseUrl: '', }}
							originWhitelist={['*']}
							onSizeUpdated={({ height }) => setHeight(height)}
							javaScriptEnabled={true}
							scrollEnabled={false}
							scalesPageToFit={false}
							automaticallyAdjustContentInsets={false}
							viewportContent="width=device-width, user-scalable=no"
						/>
					</View>
				) : null
			}
			<View style={{ height: 25 }} />
		</View>
	);
};
