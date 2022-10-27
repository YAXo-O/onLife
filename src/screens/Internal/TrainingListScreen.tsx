import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';

import Play from '@assets/icons/play.svg';

enum AvailabilityStatus {
	Available = 0,
	Complete = 1,
	Locked = 2,
}

interface CycleInfo {
	id: string;
	status: AvailabilityStatus;
	days: Array<DayInfo>;
}

interface DayInfo {
	id: string;
	title: string;
	status: AvailabilityStatus;
}

const info: Array<CycleInfo> = [
	{
		id: '0',
		status: AvailabilityStatus.Complete,
		days: [
			{
				id: '0',
				title: 'Спина',
				status: AvailabilityStatus.Complete,
			},
			{
				id: '1',
				title: 'Грудь',
				status: AvailabilityStatus.Complete,
			},
			{
				id: '2',
				title: 'Плечи',
				status: AvailabilityStatus.Complete,
			},
			{
				id: '3',
				title: 'Руки',
				status: AvailabilityStatus.Complete,
			},
			{
				id: '4',
				title: 'Ноги',
				status: AvailabilityStatus.Complete,
			},
		],
	},
	{
		id: '1',
		status: AvailabilityStatus.Available,
		days: [
			{
				id: '0',
				title: 'Спина',
				status: AvailabilityStatus.Complete,
			},
			{
				id: '1',
				title: 'Грудь',
				status: AvailabilityStatus.Complete,
			},
			{
				id: '2',
				title: 'Плечи',
				status: AvailabilityStatus.Available,
			},
			{
				id: '3',
				title: 'Руки',
				status: AvailabilityStatus.Available,
			},
			{
				id: '4',
				title: 'Ноги',
				status: AvailabilityStatus.Available,
			},
		]
	},
	{
		id: '2',
		status: AvailabilityStatus.Locked,
		days: [
			{
				id: '0',
				title: 'Спина',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '1',
				title: 'Грудь',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '2',
				title: 'Плечи',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '3',
				title: 'Руки',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '4',
				title: 'Ноги',
				status: AvailabilityStatus.Locked,
			},
		],
	},
	{
		id: '3',
		status: AvailabilityStatus.Locked,
		days: [
			{
				id: '0',
				title: 'Спина',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '1',
				title: 'Грудь',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '2',
				title: 'Плечи',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '3',
				title: 'Руки',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '4',
				title: 'Ноги',
				status: AvailabilityStatus.Locked,
			},
		],
	},
	{
		id: '4',
		status: AvailabilityStatus.Locked,
		days: [
			{
				id: '0',
				title: 'Спина',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '1',
				title: 'Грудь',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '2',
				title: 'Плечи',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '3',
				title: 'Руки',
				status: AvailabilityStatus.Locked,
			},
			{
				id: '4',
				title: 'Ноги',
				status: AvailabilityStatus.Locked,
			},
		],
	},
];

interface TabBarProps {
	value: string;
	onChange: (value: string) => void;
}

const TabBar: React.FC<TabBarProps> = (props: TabBarProps) => {
	return (
		<View style={styles.barContent}>
			<ScrollView contentContainerStyle={styles.bar} horizontal>
				{
					info.map((item: CycleInfo, id: number) => (
						<TouchableOpacity
							style={[styles.barItem, item.id === props.value ? styles.barItemActive : undefined]}
							key={item.id}
							onPress={() => item.status !== AvailabilityStatus.Locked && props.onChange(item.id)}
						>
							<Text style={[typography.tabBar, styles.tabBarText]}>Блок {id + 1}</Text>
						</TouchableOpacity>
					))
				}
			</ScrollView>
		</View>
	);
}

interface ListItemProps {
	title: string;
	subtitle: string;
	status: AvailabilityStatus;
}

const ListItem1: React.FC<ListItemProps> = (props: ListItemProps) => {
	return (
		<View style={styles.listItem}>
			<View style={styles.row}>
				<View>
					<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 20, lineHeight: 28, color: 'black', }}>
						{props.title}
					</Text>
					<Text style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: 20, color: '#7188AC'}}>
						{props.subtitle}
					</Text>
				</View>
				<View style={styles.image}>
					<Play width={8} height={10} />
				</View>
			</View>
		</View>
	);
};

const ListItem2: React.FC<ListItemProps> = (props: ListItemProps) => {
	return (
		<View style={[styles.row, { paddingVertical: 8, paddingHorizontal: 14 }]}>
			<Text>
				<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, lineHeight: 20, color: 'black', }}>{props.title}. </Text>
				<Text style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: 20, color: 'black', }}>{props.subtitle}</Text>
			</Text>
			<View style={styles.image}>
				<Play width={8} height={10} />
			</View>
		</View>
	);
};

const ListDesign1: React.FC<{id: string}> = (props) => {
	return (
		<FlatList
			style={styles.list}
			data={info.find(q => q.id === props.id)?.days ?? []}
			keyExtractor={item => item.id}
			renderItem={item => (
				<ListItem1
					title={`Тренировка ${item.index + 1}.`}
					subtitle={item.item.title}
					status={item.item.status}
				/>
			)}
		/>
	);
};

const ListDesign2: React.FC<{id: string}> = (props) => {
	return (
		<FlatList
			style={styles.list}
			data={info.find(q => q.id === props.id)?.days ?? []}
			keyExtractor={item => item.id}
			ItemSeparatorComponent={() => <View style={{ height: 2, backgroundColor: 'rgba(118, 118, 128, 0.12)', }} />}
			renderItem={item => (
				<ListItem2
					title={`${item.index + 1}`}
					subtitle={item.item.title}
					status={item.item.status}
				/>
			)}
		/>
	);
}

export const TrainingListScreen: React.FC = () => {
	const route = useRoute();
	const [id, setId] = React.useState<string>(() => route.params.id);
	const [design, setDesign] = React.useState<0 | 1>(() => 0);

	return (
		<View style={styles.screen}>
			<TabBar value={id} onChange={setId} />
			{ design === 0 ? <ListDesign1 id={id} /> : <ListDesign2 id={id} /> }
			<View style={[styles.row, { margin: 16 }]}>
				<TouchableOpacity
					onPress={() => setDesign(0)}
					style={{ borderBottomWidth: design === 0 ? 2 : 0, borderStyle: 'solid', paddingVertical: 2, borderColor: palette.blue['0'], }}
				>
					<Text style={{ color: palette.blue['0'] }}>Вариант 1</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => setDesign(1)}
					style={{ borderBottomWidth: design === 1 ? 2 : 0, borderStyle: 'solid', paddingVertical: 2, borderColor:palette.blue['0'],  }}
				>
					<Text style={{ color: palette.blue['0'] }}>Вариант 2</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: palette.white['100'],
	},
	bar: {
		flexDirection: 'row',
	},
	barContent: {
		padding: 4,
		height: 32,
		backgroundColor: 'rgba(118, 118, 128, 0.12)',
		borderRadius: 8,
		margin: 8,
	},
	barItem: {
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 128,
		paddingHorizontal: 12,
	},
	barItemActive: {
		borderRadius: 8,
		backgroundColor: palette.white['100'],
	},
	tabBarText: {
		color: palette.white['0'],
	},
	list: {
		marginHorizontal: 8,
	},
	listItem: {
		backgroundColor: '#F3F2F7B2',
		marginVertical: 8,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 10,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	image: {
		width: 40,
		height: 40,
		backgroundColor: palette.cyan['40'],
		borderRadius: 10,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
