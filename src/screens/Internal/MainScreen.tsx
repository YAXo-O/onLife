import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { palette } from '@app/styles/palette';
import { UserCard } from '@app/components/cards/user/UserCard';
import { CycleCollection } from '@app/components/collections/cycles/CycleCollection';
import { Routes, InternalScreenNavigationProps } from '@app/navigation/routes';
import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';
import { SafeAreaView } from '@app/components/safearea/SafeAreaView';
import { IState } from '@app/store/IState';
import { useLoader } from '@app/hooks/useLoader';
import { getTraining } from '@app/services/Requests/PowerTrainRequests/TrainingProgram';
import { withUser } from '@app/hooks/withUser';
import { Nullable } from '@app/objects/utility/Nullable';
import { OnlifeTraining } from '@app/objects/training/Training';
import { AlertBox, AlertType } from '@app/components/alertbox/AlertBox';

export const MainScreen: React.FC = () => {
	const navigation = useNavigation<InternalScreenNavigationProps>();
	const { id } = withUser();
	const training = useSelector((state: IState) => state.session.item);
	const dispatch = useDispatch();
	const { start, finish } = useLoader();
	const [error, setError] = React.useState<Nullable<string>>(() => null);

	const refresh = () => {
		if (id === null) return;

		setError(null);
		start();
		getTraining(id)
			.then((result: Nullable<OnlifeTraining>) => {
				const sessionCreator = new LocalActionCreators('session')
				if (result) {
					dispatch(sessionCreator.set(result));
				} else {
					dispatch(sessionCreator.clear());
				}

				const trainingCreator = new LocalActionCreators('training');
				dispatch(trainingCreator.set({ day: null, block: null, active: null }));
			})
			.catch((error) => {
				console.warn('Failed to load training program: ', error);
				setError('Не удалось получить данные по программе тренировок. Проверьте состояние сети и убедитесь, что вам добавлена тренировочная программа');
			})
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
			navigation.navigate(Routes.TrainingList);
		}
	}

	return (
		<SafeAreaView style={styles.screen}>
			<CycleCollection
				header={<UserCard style={styles.card} />}
				onPress={onPress}
				onRefresh={refresh}
			/>
			<AlertBox
				message={error}
				title="Ошибка при получении данных"
				type={AlertType.error}
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
