import * as React from 'react';
import {
	Dimensions,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import useList from '@app/hooks/useList';

const {width} = Dimensions.get('window');

const AboutTab = ({exercise}) => {
	const muscles = useList('muscles', 'map');
	const exerciseParams = useList('exerciseParams', 'map');

	const aboutItems = React.useMemo(() => {
		const aboutItems = [];

		if (exercise.exercises) {
			aboutItems.push({name: 'Тип упражнения', text: 'Суперсет'});
		} else {
			aboutItems.push({name: 'Упражнение', text: exercise.name});
			if (exercise.muscles) {
				const musclesInvolved = exercise.muscles
					.map(muscleId => {
						const muscle = muscles[muscleId + ''];
						return muscle ? muscle.name : null;
					})
					.filter(item => !!item);
				if (musclesInvolved.length) {
					aboutItems.push({
						name: 'Целевая мышца',
						text: musclesInvolved.join(', '),
					});
				}
			}

			exercise.params.forEach(param => {
				const exerciseParam = exerciseParams[param.code];
				if (exerciseParam) {
					aboutItems.push({
						name: exerciseParam.name,
						text: param.number,
					});
				}
			});
		}

		return aboutItems;
	}, [exercise, muscles, exerciseParams]);

	return (
		<View style={styles.container}>
			<View style={styles.aboutList}>
				{aboutItems.map(item => (
					<View style={styles.aboutItem} key={item.name}>
						<Text style={styles.aboutTitle}>{item.name}</Text>
						<Text style={styles.aboutDesc}>{item.text}</Text>
					</View>
				))}
			</View>

			{exercise.intro && <Text style={styles.aboutText}>{exercise.intro}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 0.27,
		marginBottom: 20,
	},
	aboutList: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	aboutItem: {
		width: width - 50,
		paddingTop: 20,
		paddingBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.14)',
	},
	aboutTitle: {
		color: '#0C0C0C',
		opacity: 0.6,
		fontFamily: 'FuturaPT-Book',
		fontSize: 15,
	},
	aboutDesc: {
		textAlign: 'right',
		fontSize: 15,
		width: '50%',
		color: '#0C0C0C',
		fontFamily: 'FuturaPT-Book',
	},
	aboutText: {
		width: width,
		padding: 25,
		fontFamily: 'FuturaPT-Book',
		fontSize: 15,
		color: '#0C0C0C',
		lineHeight: 20,
	},
});

export default AboutTab;
