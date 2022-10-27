import * as React from 'react';
import { View, ViewStyle, StyleProp, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { typography } from '@app/styles/typography';
import { palette } from '@app/styles/palette';

interface OwnProps {
	value: string;
	onChange: (key: string) => void;

	containerStyle?: StyleProp<ViewStyle>;
	barStyle?: StyleProp<ViewStyle>;
	panStyle?: StyleProp<ViewStyle>;

	children?: Array<TabPane>;
}

interface TabPane {
	key: string;
	title: string;
	content: React.ReactNode;
}


export const TabView: React.FC<OwnProps> = (props: OwnProps) => {
	const bar = (props.children ?? []).map((item: TabPane) => ({ key: item.key, text: item.title }));
	const content = (props.children ?? []).find((item: TabPane) => item.key === props.value)?.content ?? null;

	return (
		<View style={props.containerStyle}>
			<View style={[style.bar, props.barStyle]}>
				{
					bar.map((q) => (
						<TouchableOpacity key={q.key} onPress={() => props.onChange(q.key)}>
							<Text style={[typography.tabbar, style.barText, q.key === props.value ? style.activeBarText : null]} key={q.key}>
								{q.text}
							</Text>
							{ q.key === props.value ? <View style={style.barLine} /> : null }
						</TouchableOpacity>
					))
				}
			</View>
			<View style={props.panStyle}>
				{content}
			</View>
		</View>
	);
};

const style = StyleSheet.create({
	bar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	barText: {
		color: palette.light.gray,
	},
	activeBarText: {
		color: palette.cyan['40'],
	},
	barLine: {
		height: 3,
		backgroundColor: palette.cyan['100'],
		borderRadius: 1,
	}
});
