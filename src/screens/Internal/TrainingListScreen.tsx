import * as React from 'react';
import {
	StyleSheet,
	View,
	FlatList,
	ListRenderItemInfo,
	Text, TouchableOpacity,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import { palette } from '@app/styles/palette';

import { IState } from '@app/store/IState';
import { OnlifeTrainingBlock } from '@app/objects/training/TrainingBlock';

import { OnlifeTrainingDay } from '@app/objects/training/TrainingDay';
import { typography } from '@app/styles/typography';

import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';
import { ActionButton } from '@app/components/buttons/ActionButton';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@app/navigation/routes';
import { SafeAreaView } from '@app/components/safearea/SafeAreaView';

import Eye from '@assets/icons/eye.svg';
import Play from '@assets/icons/play.svg';
import Hide from '@assets/icons/hide.svg';

enum AvailabilityStatus {
	Available = 0,
	Complete = 1,
	Current = 2,
	Locked = 3,
}

interface ListItemProps {
	id: string;
	title: string;
	subtitle: string;
	status: AvailabilityStatus;
}

function getIcon(status: AvailabilityStatus): React.ReactNode {
	switch (status) {
		case AvailabilityStatus.Available:
		case AvailabilityStatus.Complete:
			return <Eye/>;

		case AvailabilityStatus.Current:
			return <Play/>;

		case AvailabilityStatus.Locked:
			return <Hide/>;
	}
}

function getTrainings(block?: OnlifeTrainingBlock): Array<ListItemProps> {
	if (!block) return [];
	if (!block.days?.length) return [];

	let cur = block.days?.find((item: OnlifeTrainingDay) => !item.time);

	return (block?.days ?? []).map((item: OnlifeTrainingDay) => {
		let status = AvailabilityStatus.Available;

		if (!block.available) {
			status = AvailabilityStatus.Locked;
		} else if (item.order === cur?.order) {
			status = AvailabilityStatus.Current;
		} else if (item.time) {
			status = AvailabilityStatus.Complete;
		}

		return {
			id: item.id,
			title: `${(item?.order ?? 0) + 1} тренировка`,
			subtitle: item?.name ?? '',
			status,
		};
	});
}

export const TrainingListScreen: React.FC = () => {
	const info = useSelector((state: IState) => state.training.item);
	const session = useSelector((state: IState) => state.session.item);
	const dispatch = useDispatch();
	const { navigate } = useNavigation();

	const blockId = info?.block;
	if (!blockId) return null;

	const block = session?.blocks.find((item: OnlifeTrainingBlock) => item.id === blockId);
	if (!block) return null;

	const onPress = (id: string) => {
		const creator = new LocalActionCreators('training');
		dispatch(creator.set({ day: id }));
		navigate(Routes.TrainingView);
	}

	const render = (info: ListRenderItemInfo<ListItemProps>) => {
		return (
			<TouchableOpacity
				style={styles.item}
				onPress={() => {
					if (!block.available) return;

					onPress(info.item.id);
				}}
			>
				<View>
					<Text style={[styles.title, typography.cardTitle]}>{info.item.title}</Text>
					<Text style={[styles.subtitle, typography.placeholder]}>{info.item.subtitle}</Text>
				</View>
				<ActionButton
					style={styles.icon}
					onPress={() => onPress(info.item.id)}
					disabled={!block.available}
				>
					<View style={styles.icon}>
						{getIcon(info.item.status)}
					</View>
				</ActionButton>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.screen}>
			<FlatList
				data={getTrainings(block)}
				renderItem={render}
				ListHeaderComponent={() => (
					<View
						style={styles.header}
					>
						<Text
							style={[
								styles.title,
								typography.cardMediumTitle,
							]}
						>
							Блок тренировок №{block.order + 1}
						</Text>
					</View>
				)}
				keyExtractor={item => item.id}
				style={styles.container}
				ItemSeparatorComponent={() => <View style={{ height: 16, }} />}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: palette.white['100'],
	},
	header: {
		paddingHorizontal: 18,
		paddingTop: 12,
		paddingBottom: 24,
	},
	container: {
		margin: 10,
	},
	item: {
		paddingVertical: 12,
		paddingLeft: 18,
		paddingRight: 14,
		backgroundColor: '#F3F2F7B2',
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	title: {
		color: palette.blue['0'],
	},
	subtitle: {
		color: palette.blue['50'],
	},
	icon: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
