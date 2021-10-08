import * as React from 'react';
import { Text, View, StyleSheet} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

export function Header({ backCaption = 'Назад', title, subtitle }) {
	const navigation = useNavigation();

	return (
		<View style={styles.header}>
			<View style={{...styles.headerColumn, ...styles.column}}>
				<View style={styles.headerRow} onTouchEnd={() => navigation.goBack()}>
					<FontAwesome5 style={styles.headerBack} name="chevron-left" />
					<Text style={{...styles.headerBack, ...styles.headerBackCaption}}>{backCaption}</Text>
				</View>
			</View>
			<View style={{...styles.headerColumn, ...styles.column2}}>
				<Text style={styles.headerTitle}>{title}</Text>
				{
					subtitle
						? <Text style={styles.headerName}>{subtitle}</Text>
						: null
				}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		backgroundColor: '#E8E8E8',
		padding: 4,
		minHeight: 70,
		borderBottomColor: '#F5F5F5',
		borderBottomWidth: 8,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '100%',
	},
	headerColumn: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 8,
		paddingRight: 8,
	},
	headerTitle: {
		fontFamily: 'FuturaPT-Book',
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	headerBack: {
		fontFamily: 'FuturaPT-Book',
		fontSize: 16,
		fontWeight: 'normal',
		color: '#007bff',
	},
	headerBackCaption: {
		paddingLeft: 4,
	},
	headerName: {
		fontFamily: 'FuturaPT-Book',
		fontSize: 16,
		opacity: 0.52,
		fontWeight: 'normal',
		color: '#000000',
	},
	column: {
		width: '25%',
	},
	column2: {
		width: '50%',
	},
});
