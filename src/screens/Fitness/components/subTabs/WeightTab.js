import React, {useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import CardItem from './CardItem';
import WeightCard from './WeightCard';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const TabbedComponent = ({
	item,
	trainingDay,
	trainingCycle,
	withStats,
	setWeightInput,
}) => {
	if (item.type === 'active') {
		return (
			<WeightCard
				name={item.name}
				item={item}
				trainingDay={trainingDay}
				trainingCycle={trainingCycle}
				withStats={withStats}
				setWeightInput={setWeightInput}
			/>
		);
	} else {
		return <CardItem {...item} firstTrain={[]} secondTrain={[]}/>;
	}
};

export default function({
	exercise,
	trainingDay,
	trainingCycle,
	setWeightInput,
}) {
	const navigation = useNavigation();
	const allSessions = useSelector(state => state.training.sessions || []); // useProfiledData('training.sessions');

	const previousSessions = useMemo(() => {
		return [];
	}, []);

	const [listData, setListData] = useState(
		Array(1)
			.fill('')
			.map((_, i) => ({key: `${i}`, text: '1-й круг'})),
	);

	const [statOpen, setStatOpen] = useState(false);
	const [firstTrain, setFirstTrain] = useState([0, 0, 0, 0]);
	const [secondTrain, setSecondTrain] = useState([0, 0, 0, 0]);

	const onChangeNumber = (approach, number) => {
		const newTrain = [...firstTrain];
		newTrain[approach] = number;
		setFirstTrain(newTrain);
		navigation.goBack();
	};

	const onChangeSecondNumber = (approach, number) => {
		const newTrain = [...secondTrain];
		newTrain[approach] = number;
		setSecondTrain(newTrain);
		navigation.goBack();
	};

	const navigatorOptions = ({route, navigation}) => {
		navigation.addListener('state', e => {
			const {index} = e.data.state;
			// if (typeof index !== 'undefined') setActiveTab(index);
		});
		return {tabBar: () => null};
	};

	const screens = useMemo(() => {
		const screens = [];

		screens.push({
			type: 'active',
			name: 'Упражнение',
			exercise,
		});

		if (allSessions) {
			allSessions
				.filter(session => session.dayId === trainingDay.id)
				.sort((a, b) => (a.cycle < b.cycle ? -1 : 1))
				.forEach(session => {
					screens.push({
						type: 'history',
						name: `${session.cycle}-й круг`,
						exercise,
						session,
					});
				});
		}

		return screens;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allSessions, trainingDay]);

	const exercises = exercise.superset ? exercise.exercises : [exercise];

	return (
		<Swiper showsPagination={false} height={exercises.length > 1 ? 430 : 320}>
			{screens.map((screenItem, index) => (
				<TabbedComponent
					key={screenItem.id || screenItem.name}
					item={screenItem}
					trainingDay={trainingDay}
					trainingCycle={trainingCycle}
					count={index + 1}
					withStats={screens.length > 1}
					setWeightInput={setWeightInput}
				/>
			))}
		</Swiper>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		marginLeft: 0,
	},
	itemWrapper: {
		flexDirection: 'row',
		marginBottom: 40,
		backgroundColor: '#fff',
	},
});
