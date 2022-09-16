import * as React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { withUser } from '../../hooks/withUser';
import { usePrivateStorage } from '../../hooks/usePrivateStorage';
import { PrivateKeys } from '../../services/Privacy/PrivateKeys';
import { PrivateStorage } from '../../services/Privacy/PrivateStorage';

interface OwnProps {
}

export const DebugScreen: React.FC<OwnProps> = (props: OwnProps) => {
	const info = withUser();
	const storage = usePrivateStorage(PrivateKeys.Session);

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<View style={styles.item}>
					<Text>Session: {info.session !== null ? 'Present' : 'None'}</Text>
				</View>
				<View style={styles.item}>
					<TouchableOpacity style={styles.btn} onPress={() => PrivateStorage.clear(PrivateKeys.Session)}>
						<Text style={styles.btnText}>
							Reset Session
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.row}>
				<View style={styles.item}>
					<Text>User: {info.user !== null ? 'Present' : 'None'}</Text>
				</View>
				<View style={styles.item}>
					<TouchableOpacity style={styles.btn}>
						<Text style={styles.btnText}>
							Reset User
						</Text>
				</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	row: {
		flexDirection: 'row',
		paddingHorizontal: 16,
	},
	item: {
		flex: 1,
	},
	btn: {
	},
	btnText: {
		color: '#e1d8ab',
	},
})
