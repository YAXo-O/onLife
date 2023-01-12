import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
	StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { palette } from '@app/styles/palette';
import { UserCard } from '@app/components/cards/user/UserCard';
import { CycleCollection } from '@app/components/collections/cycles/CycleCollection';
import { Routes } from '@app/navigation/routes';
import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';
import { SafeAreaView } from '@app/components/safearea/SafeAreaView';
import { IState } from '@app/store/IState';
import { useLoader } from '@app/hooks/useLoader';
import { getProgram } from '@app/services/Requests/PowerTrainRequests/TrainingProgram';
import { withUser } from '@app/hooks/withUser';
import { Nullable } from '@app/objects/utility/Nullable';
import { OnlifeTraining } from '@app/objects/training/Training';

export const MainScreen: React.FC = () => {
	const { navigate } = useNavigation();
	const { id } = withUser();
	const training = useSelector((state: IState) => state.session.item);
	const dispatch = useDispatch();
	const { start, finish } = useLoader();

	const refresh = () => {
		if (id === null) return;

		start();
		getProgram(id)
			.then((result: Nullable<OnlifeTraining>) => {
				const creator = new LocalActionCreators('session')
				dispatch(creator.set(result));
			})
			.catch((error) => console.warn('Failed to load training program: ', error))
			.finally(finish);
	};

	React.useEffect(() => {
		if (training !== null) return;

		refresh();
	}, [id, training]);

	const onPress = (id?: string) => {
		const creator = new LocalActionCreators('training');
		dispatch(creator.set({ block: id }));

		if (id) {
			navigate(Routes.TrainingList);
		}
	}

	return (
		<SafeAreaView style={styles.screen}>
			<CycleCollection
				header={<UserCard style={styles.card} />}
				onPress={onPress}
				onRefresh={refresh}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: palette.background,
	},
	card: {
		margin: 0,
		marginBottom: 20,
	},
});
