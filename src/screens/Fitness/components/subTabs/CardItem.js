import * as React from 'react';
import {
	StyleSheet,
	Dimensions,
	Text,
	View,
} from 'react-native';

import {extractParam} from '@app/utils';

const {width} = Dimensions.get('window');

const CardItem = props => {
	const { name, exercise, session } = props;

	const setsData = React.useMemo(() => {
		let items;
		if (exercise.exercises) {
			items = exercise.exercises.concat();
		} else {
			items = [exercise];
		}
		const sets = [];
		for (const exerciseItem of items) {
			const set = {
				id: exerciseItem.id,
				name: exerciseItem.name,
				sets: session.items
					.filter(item => item.exerciseId === exerciseItem.id)
					.map(item => extractParam(item, 'weight')),
			};
			sets.push(set);
		}

		return sets;
	}, [exercise, session]);

	return (
		<View style={styles.container}>
			<View style={styles.circleNumber}>
				<Text style={styles.circleText}>{name}</Text>
			</View>

			<View style={styles.statsWrapper}>
				<Text style={styles.title}>Статистика</Text>
				{setsData.map((setItem, setItemCount) => (
					<View
						style={[
							styles.statsCard,
							setItemCount && styles.statsCardOther,
						]}
						key={setItem.id}
					>
						<Text style={styles.cardItemExerciseName}>{setItem.name}</Text>
						<View style={styles.statsData}>
							{setItem.sets.map((weight, setCount) => (
								<View style={styles.statItem} key={setCount}>
									<View style={styles.statInput}>
										<Text style={styles.inputText}>{weight}</Text>
										<Text style={styles.sufix}>кг</Text>
									</View>
									<Text style={styles.subTitle}>{setCount + 1}-й{'\n'} подход</Text>
								</View>
							))}
						</View>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: 'white',
		width: '100%',
		overflow: 'hidden',
	},
	circleNumber: {
		borderTopLeftRadius: 16,
		borderBottomLeftRadius: 16,
		width: 40,
		justifyContent: 'center',
		alignItems: 'center',
		opacity: 1,
		backgroundColor: 'rgba(13, 28, 113, 0.06);',
	},
	circleText: {
		transform: [{rotate: '-90deg'}],
		fontSize: 16,
		width: 200,
		textAlign: 'center',
		fontFamily: 'FuturaPT-Bold',
		fontWeight: 'bold',
		color: '#0E1D7A',
		marginLeft: -15,
	},

	statsWrapper: {
		flex: 1,
		marginLeft: -10,
		backgroundColor: 'white',
		justifyContent: 'space-between',
		zIndex: 33,
		borderTopLeftRadius: 16,
		borderBottomLeftRadius: 16,
		padding: 8,
	},
	title: {
		fontSize: 22,
		fontFamily: 'FuturaPT-Medium',
		fontWeight: '500',
		color: '#000',
	},
	statsCard: {
	},
	statsCardOther: {
		borderTopWidth: 1,
		borderTopColor: 'rgba(0, 0, 0, 0.14)',
		marginTop: 4,
		paddingTop: 4,
	},
	cardItemExerciseName: {
		color: '#696969',
		fontSize: 15,
		fontFamily: 'FuturaPT-Medium',
	},
	statsData: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	statsItem: {
		borderBottomWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.14)',
	},
	statItem: {
		minWidth: 20,
		marginTop: 15,
		marginRight: 8,
	},
	statInput: {
		paddingLeft: 8,
		paddingRight: 8,
		borderWidth: 1,
		borderColor: '#DBDBDB',
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#000',
		height: 38,

	},
	inputText: {
		fontSize: 16,
		lineHeight: 21,
		textAlign: 'center',
		fontFamily: 'FuturaPT-Medium',
		fontWeight: 'bold',
	},
	subTitle: {
		textAlign: 'center',
		color: '#0C0C0C',
		opacity: 0.6,
		fontSize: 10,
		marginTop: 6,
	},
	statsEdit: {
	},
	sufix: {
		marginLeft: 5,
	},
});

export default CardItem;

