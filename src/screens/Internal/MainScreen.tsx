import * as React from 'react';
import {
	StyleSheet, View,
} from 'react-native';

import { palette } from '@app/styles/palette';
import { UserCard } from '@app/components/cards/user/UserCard';
import { CycleCollection } from '@app/components/collections/cycles/CycleCollection';

export const MainScreen: React.FC = () => {
	return (
		<View style={styles.screen}>
			<CycleCollection
				header={<UserCard style={styles.card} />}
			/>
		</View>
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
