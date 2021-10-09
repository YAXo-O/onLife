import React from 'react';
import { useSelector } from 'react-redux';

import Swiper from 'react-native-swiper';
import CardItem from './CardItem';
import WeightCard from './WeightCard';

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
	const allSessions = useSelector(state => state.training.sessions || []);

	const screens = React.useMemo(() => {
		const items = [];

		items.push({
			type: 'active',
			name: 'Упражнение',
			exercise,
		});

		if (allSessions) {
			allSessions
				.filter(session => session.dayId === trainingDay.id)
				.sort((a, b) => (a.cycle < b.cycle ? -1 : 1))
				.forEach(session => {
					items.push({
						type: 'history',
						name: `${session.cycle}-й круг`,
						exercise,
						session,
					});
				});
		}

		return items;
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
