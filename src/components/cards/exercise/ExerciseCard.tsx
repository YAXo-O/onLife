import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import { Nullable } from '../../../objects/utility/Nullable';
import { OnlifeTrainingProgramDayExercise } from '../../../objects/program/TrainingProgram';

import { TabBar, ExerciseTabs } from './Tabs/TabBar';

import ChevronUp from '../../../../assets/icons/chevron-up.svg';
import ChevronDown from '../../../../assets/icons/chevron-down.svg';
import { TabPane } from './Tabs/TabPane';

interface OwnProps {
	order: number;
	exercise: Nullable<OnlifeTrainingProgramDayExercise>;
	style?: StyleProp<ViewStyle>;
}

interface IconProps {
	collapsed: boolean;
}

const size = { width: 32, height: 32 };
const CardIcon: React.FC<IconProps> = (props: IconProps) => {
	const Icon = props.collapsed ? ChevronDown : ChevronUp;

	return <Icon width={size.width} height={size.height} />
}

export const ExerciseCard: React.FC<OwnProps> = (props: OwnProps) => {
	const [collapsed, setCollapsed] = React.useState<boolean>(() => true);
	const [tab, setTab] = React.useState<ExerciseTabs>(() => ExerciseTabs.Training)

	return (
		<View>
			<TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
				<View style={[styles.container, props.style, !collapsed ? styles.expandedContainer : undefined]}>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>{props.order + 1}</Text>
					</View>
					<Text style={styles.text}>{props.exercise?.exercise?.name ?? 'Unknown name'}</Text>
					<View style={styles.iconContainer}>
						<CardIcon collapsed={collapsed} />
					</View>
				</View>
			</TouchableOpacity>
			{
				collapsed
					? null
					: (
						<View style={styles.content}>
							<TabBar tab={tab} setTab={setTab} />
							<TabPane tab={tab} exercise={props.exercise?.exercise ?? null} />
						</View>
					)
			}
			{ collapsed ? null : <View style={styles.expandedFooter} /> }
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#0b2267',
		paddingHorizontal: 16,
		paddingVertical: 24,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
	},
	expandedContainer: {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	content: {
		backgroundColor: '#eeeef8',
	},
	expandedFooter: {
		height: 8,
		backgroundColor: '#0b2267',
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
	badge: {
		backgroundColor: '#eee',
		width: 20,
		height: 20,
		borderRadius: 10,
	},
	badgeText: {
		color: '#0b2267',
		fontSize: 18,
		lineHeight: 20,
		textAlign: 'center',
	},
	text: {
		color: '#eee',
		textAlign: 'left',
		paddingHorizontal: 4,
		flex: 1,
	},
	iconContainer: {
		alignItems: 'flex-end',
	}
});
