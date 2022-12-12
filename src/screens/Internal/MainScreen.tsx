import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
	StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { palette } from '@app/styles/palette';
import { UserCard } from '@app/components/cards/user/UserCard';
import { CycleCollection } from '@app/components/collections/cycles/CycleCollection';
import { Routes } from '@app/navigation/routes';
import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';

export const MainScreen: React.FC = () => {
	const { navigate } = useNavigation();
	const dispatch = useDispatch();

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
