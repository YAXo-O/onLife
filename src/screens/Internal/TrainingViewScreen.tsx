import * as React from 'react';
import {
	StyleSheet,
	View,
	ListRenderItemInfo,
	Text,
	FlatList,
} from 'react-native';

import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';

import { TrainingDay } from '@app/objects/training/TrainingDay';
import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { withUser } from '@app/hooks/withUser';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from '@app/store/IState';
import { CurrentTraining } from '@app/store/Types';
import { Nullable } from '@app/objects/utility/Nullable';
import { TrainingBlock } from '@app/objects/training/TrainingBlock';

import Rounds from '@assets/icons/rounds.svg';
import Dumbbell from '@assets/icons/dumbbell.svg';
import { ActionButton } from '@app/components/buttons/ActionButton';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@app/navigation/routes';
import { Training } from '@app/objects/training/Training';
import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';
import { SafeAreaView } from '@app/components/safearea/SafeAreaView';

interface ListItemProps {
	id: string;
	title: string;
	subtitle: string;
	rounds: number;
	reps: string;
	order: number,
}

function getDay(training?: Nullable<Training>, info?: Nullable<CurrentTraining>): Nullable<TrainingDay> {
	if (!training || !info) return null;

	const block = training.blocks.find((block: TrainingBlock) => block.id === info.block);
	if (!block) return null;

	const day = block.days.find((day: TrainingDay) => day.id === info.day);
	if (!day) return null;

	return day;
}

function getExercises(day?: Nullable<TrainingDay>): Array<ListItemProps> {
	if (!day) return [];

	return day.exercises.map((item: TrainingExercise) => {
		const order = item.order + 1;

		return {
			id: item.id,
			title: item?.exercise?.name ?? '',
			subtitle: `Упражнение ${order}`,
			rounds: item?.rounds.length ?? 0,
			reps: item?.rounds[0].repeats ?? '0',
			order,
		};
	}).sort((a, b) => a.order - b.order);
}

export const TrainingViewScreen: React.FC = () => {
	const { user } = withUser();
	const info = useSelector((store: IState) => store.training.item);
	const dispatch = useDispatch();
	const { navigate } = useNavigation();

	const day = getDay(user?.training, info);

	const render = (info: ListRenderItemInfo<ListItemProps>) => {
		return (
			<View style={styles.item}>
				<View>
					<Text style={[typography.placeholder, styles.subtitle]}>{info.item.subtitle}</Text>
				</View>
				<View style={styles.titleContainer}>
					<Text style={[typography.cardMediumTitle, styles.title]}>{info.item.title}</Text>
				</View>
				<View style={styles.row}>
					<View style={styles.bullet}>
						<View style={styles.icon}>
							<Rounds />
						</View>
						<Text style={[styles.subtitle]}>{info.item.rounds} подход{info.item.rounds > 1 ? info.item.rounds > 4 ? 'ов' : 'а' : ''}</Text>
					</View>
					<View style={styles.bullet}>
						<View style={styles.icon}>
							<Dumbbell />
						</View>
						<Text style={[styles.subtitle]}>{info.item.reps} раз</Text>
					</View>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.screen}>
			<FlatList
				data={getExercises(day)}
				renderItem={render}
				keyExtractor={item => item.id}
				style={styles.container}
				ItemSeparatorComponent={() => <View style={{ height: 15, }} />}
			/>
			<View style={styles.actionContainer}>
				<ActionButton
					text="Начать"
					onPress={() => {
						if (info?.active?.id !== day?.id) {
							const creator = new LocalActionCreators('training');
							dispatch(creator.set({ active: day }));
						}
						navigate(Routes.Training)
					}}
					style={styles.action}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: palette.background,
	},
	container: {
		marginHorizontal: 12,
		marginTop: 19,
	},
	item: {
		backgroundColor: palette.white['100'],
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderRadius: 10,
	},
	subtitle: {
		color: palette.blue['50'],
	},
	title: {
		color: palette.white['0'],
	},
	titleContainer: {
		marginTop: 15,
		marginBottom: 20,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	icon: {
		backgroundColor: '#63CDDA1A',
		width: 35,
		height: 35,
		borderRadius: 17,
		marginRight: 4,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bullet: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	actionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 30,
	},
	action: {
		maxWidth: 128,
	},
});
