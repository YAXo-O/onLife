import * as React from 'react';
import {
	StyleSheet,
	Text,
	View,
	StyleProp,
	ViewStyle,
	TouchableOpacity,
	FlatList, ListRenderItemInfo,
} from 'react-native';

import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';
import { Progress } from '@app/components/display/progress/Progress';

import Locked from '@assets/icons/locked.svg'
import Unlocked from '@assets/icons/unlocked.svg';
import ChevronRight from '@assets/icons/chevron-right.svg';

interface OwnProps {
	header?: React.ReactElement;
	style?: StyleProp<ViewStyle>;
	onPress?: (id: string) => void;
}

interface ItemProps {
	id: string;
	title: string;
	done: number;
	total: number;
	disabled?: boolean;
	onPress?: () => void;
}

function getMock(): Array<ItemProps> {
	return [{
		id: '0',
		title: '1 блок тренировок',
		total: 5,
		done: 5,
		disabled: false,
	}, {
		id: '1',
		title: '2 блок тренировок',
		total: 5,
		done: 2,
		disabled: false,
	}, {
		id: '2',
		title: '3 блок тренировок',
		total: 5,
		done: 0,
		disabled: true,
	},  {
		id: '3',
		title: '4 блок тренировок',
		total: 5,
		done: 0,
		disabled: true,
	},  {
		id: '4',
		title: '5 блок тренировок',
		total: 5,
		done: 0,
		disabled: true,
	}, ];
}

const CycleItem: React.FC<ItemProps> = (props: ItemProps) => {
	const Icon = props.disabled ? Locked : Unlocked;
	const handleTouch = () => {
		if (props.disabled || !props.onPress) return;

		props.onPress();
	};

	return (
		<TouchableOpacity onPress={handleTouch} style={{ marginBottom: 20 }}>
			<View style={[styles.item]}>
				<View style={styles.content}>
					<View style={[styles.row, { height: 41 }]}>
						<Text style={[typography.cardMediumTitle, styles.text]}>
							{props.title}
						</Text>
						<View style={styles.spacer} />
						<View style={[styles.image, props.disabled ? styles.disabledImage : null]}>
							<Icon width={18} height={24}/>
						</View>
					</View>
					<Text style={[typography.text, styles.caption]}>
						{props.disabled ? 'недоступен' : 'доступен'}
					</Text>
					<Progress
						primaryColor={palette.white['60']}
						secondaryColor={palette.cyan['20']}
						progress={props.done / props.total}
						style={{ marginTop: 32 }}
					>
						<View style={[styles.row, { height: 45, marginBottom: 4, marginTop: 20 }]}>
							<Text style={[typography.text, styles.caption]}>кол-во тренировок</Text>
							<View style={styles.spacer} />
							<Text style={[typography.text, styles.caption]}>{props.done} из {props.total}</Text>
						</View>
					</Progress>
				</View>
				<View style={styles.bottom}>
					<Text style={[typography.text, styles.text]}>Подробнее</Text>
					<View style={styles.spacer} />
					<ChevronRight width={16} height={16} fillPrimary={palette.cyan['40']}/>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export const CycleCollection: React.FC<OwnProps> = (props: OwnProps) => {
	const render = ({ item, index }: ListRenderItemInfo<ItemProps>) => {
		return (
			<CycleItem
				id={item.id}
				title={item.title}
				done={item.done}
				total={item.total}
				disabled={item.disabled}
				onPress={() => props.onPress?.(item.id)}
			/>
		);
	};

	return (
		<FlatList
			ListHeaderComponent={props.header}
			data={getMock()}
			renderItem={render}
			keyExtractor={item => item.id}
		/>
	);
}

const horizontalItemMargin: number = 20;
const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	image: {
		width: 35,
		height: 35,
		borderRadius: 17,
		overflow: 'hidden',
		backgroundColor: palette.cyan['40'],
		alignItems: 'center',
		justifyContent: 'center',
	},
	disabledImage: {
		backgroundColor: palette.white['60'],
	},
	container: {
		flexDirection: 'row',
	},
	contentContainer: {
		marginHorizontal: -horizontalItemMargin,
	},
	item: {
		borderRadius: 15,
		backgroundColor: 'white',
		marginHorizontal: horizontalItemMargin,
		overflow: 'hidden',
	},
	text: {
		color: palette.blue['0'],
		textAlign: 'left',
	},
	caption: {
		color: palette.blue['50'],
		textAlign: 'left',
	},
	overlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		backgroundColor: palette.cyan['80'],
		opacity: 0.8,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	spacer: {
		flex: 1,
		minWidth: 10,
	},
	content: {
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: 15,
		paddingLeft: 30,
		paddingBottom: 30,
	},
	bottom: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 15,
		paddingLeft: 30,
		backgroundColor: palette.white['40'],
	},
});
