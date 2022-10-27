import * as React from 'react';
import {
	View,
	StyleSheet,
	StyleProp,
	ViewStyle,
} from 'react-native';

interface OwnProps {
	primaryColor: string;
	secondaryColor: string;
	progress: number;
	style?: StyleProp<ViewStyle>;
	children?: React.ReactNode;
}

export const Progress: React.FC<OwnProps> = (props: OwnProps) => {
	return (
		<View style={[props.style, styles.container]}>
			{props.children}
			<View style={[styles.bar, { backgroundColor: props.primaryColor }]}>
				<View style={[styles.progress, { backgroundColor: props.secondaryColor, flex: props.progress }]} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	bar: {
		flexDirection: 'row',
		height: 5,
		borderRadius: 5,
		overflow: 'hidden',
	},
	progress: {
		height: 5,
		flex: 0.5,
		borderRadius: 5,
	},
});
