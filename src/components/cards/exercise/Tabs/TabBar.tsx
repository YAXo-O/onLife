import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import BriefDescription from '../../../../../assets/icons/brief-description.svg';
import Training from '../../../../../assets/icons/training.svg';
import EducationalMaterial from '../../../../../assets/icons/educational-material.svg';

export enum ExerciseTabs {
	Brief = 0,
	Training = 1,
	Material = 2,
}

export interface TabButtonProps {
	active: number;
	setActive: (tab: number) => void;
	tab: ExerciseTabs;
	sibling?: boolean;
	icon: React.ComponentType<{ width: number, height: number}>;
	text: string;
}

interface TabBarProps {
	tab: number;
	setTab: (tab: number) => void;
}

const size = { width: 16, height: 16 };

const TabButton: React.FC<TabButtonProps> = (props: TabButtonProps) => {
	const Icon = props.iconContainer;

	return (
		<TouchableOpacity
			style={[
				styles.container,
				props.sibling ? styles.sibling : undefined,
				props.active === props.tab ? styles.active : undefined,
			]}
			onPress={() => props.setActive(props.tab)}
		>
			<Icon width={size.width} height={size.height} />
			<Text style={styles.text}>{props.text}</Text>
		</TouchableOpacity>
	);
};

export const TabBar: React.FC<TabBarProps> = (props: TabBarProps) => (
	<View style={styles.bar}>
		<TabButton
			active={props.tab}
			setActive={props.setTab}
			tab={ExerciseTabs.Brief}
			icon={BriefDescription}
			text="Краткое описание"
		/>
		<TabButton
			active={props.tab}
			setActive={props.setTab}
			tab={ExerciseTabs.Training}
			icon={Training}
			text="Тренировка"
			sibling
		/>
		<TabButton
			active={props.tab}
			setActive={props.setTab}
			tab={ExerciseTabs.Material}
			icon={EducationalMaterial}
			text="Учебный материал"
		/>
	</View>
);

const styles = StyleSheet.create({
	bar: {
		flexDirection: 'row',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#ddd',
		margin: 16,
		borderRadius: 8,
		overflow: 'hidden',
	},
	container: {
		flex: 1,
		padding: 6,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	active: {
		backgroundColor: '#e5e5ff',
	},
	sibling: {
		borderStyle: 'solid',
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderColor: '#eaeaea',
	},
	text: {
		color: '#555',
		fontSize: 12,
		textAlign: 'center',
		fontWeight: '500',
	},
});
