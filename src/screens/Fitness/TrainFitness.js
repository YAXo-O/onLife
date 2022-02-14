import * as React from 'react';
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { useNavigation } from '@react-navigation/native';

import Tab from '@app/screens/Fitness/components/Tab';
import { WeightInputModal } from '@app/screens/Fitness/components/WeightInputModal';

import useProfiledData from '@app/hooks/useProfiledData';
import { saveSession } from '@app/redux/action-creators';
import { Header } from '@app/screens/Fitness/components/Header';

const TrainFitness = props => {
	const { trainingDay, trainingCycle } = props.route.params;
	const session = useProfiledData('training.currentSession');
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const [weightInput, setWeightInput] = React.useState(null);

	const exercises = React.useMemo(() => {
		const exercises = [];
		const source = trainingDay.exercises.concat();
		for (let i = 0; i < source.length; ++i) {
			const e = source[i];
			if (e.superset) {
				const supersetBlock = {
					id: e.id,
					name: 'Суперсет',
					superset: e.superset,
					intro: '',
					exercises: [],
				};
				while (i < source.length) {
					supersetBlock.exercises.push(source[i]);
					if (!source[i].superset) break;
					++i;
				}
				supersetBlock.intro = supersetBlock.exercises
					.map(exercise => exercise.name);
				exercises.push(supersetBlock);
			} else {
				exercises.push(e);
			}
		}

		return exercises;
	}, [trainingDay]);

	const canIFinish = React.useMemo(
		() => session && trainingDay.id === session.dayId && session.items.length,
		[trainingDay, session],
	);

	const handleCancelFinish = () => {};

	const handleReallyFinish = async() => {
		try {
			await dispatch(saveSession(session));
			navigation.navigate('ViewScreen');
		} catch (e) {}
	};

	const handleFinishSession = () => {
		Alert.alert(
			'Всё на сегодня?',
			'Вы хотите завершить текущую тренировку и сохранить результат?',
			[
				{text: 'Отмена', style: 'cancel', onPress: handleCancelFinish},
				{text: 'Завершить', onPress: handleReallyFinish},
			],
		);
	};

	return (
		<View style={styles.container}>
			<Header
				title="Тренировка"
				subtitle={trainingDay.name}
			/>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.tabsWrapper}
			>
				{exercises.map((exercise, count) => (
					<Tab
						name={exercise.name}
						desc={exercise.intro}
						trainingDay={trainingDay}
						trainingCycle={trainingCycle}
						exercise={exercise}
						key={exercise.id}
						count={count + 1}
						setWeightInput={setWeightInput}
					/>
				))}
				{
					canIFinish ? (
						<View style={styles.successButtons}>
							<TouchableOpacity
								style={styles.successButton}
								onPress={handleFinishSession}>
								<Text style={styles.successButtonText}>Завершить тренировку</Text>
							</TouchableOpacity>
						</View>
					) : null
				}
			</ScrollView>
			{
				weightInput ? (
					<WeightInputModal
						weightInput={weightInput}
						onClose={() => setWeightInput(null)}
					/>
				) : null
			}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#fff',
	},
	tabsWrapper: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	successButtons: {
		marginTop: 30,
		flexDirection: 'row',
		alignItems: 'center',
	},
	successButton: {
		width: 200,
		height: 60,
		elevation: 10,
		borderRadius: 8,
		backgroundColor: '#0B2266',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	successButtonText: {
		fontSize: 18,
		fontFamily: 'FuturaPT-Book',
		color: 'white',
	},
});

export default TrainFitness;
