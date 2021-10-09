import React, {useMemo} from 'react';
import {Alert, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useProfiledData from '../../../../hooks/useProfiledData';
import {useDispatch, useSelector} from 'react-redux';
import {
	addTrainingSession,
	addTrainingSessionItem,
	setCurrentTrainingDay,
	updateTrainingSessionItem,
} from '@app/redux/action-creators';
import useCurrentProgram from '../../../../hooks/useCurrentProgram';
import {extractParam} from '@app/utils';
import {v4 as uuidv4} from 'uuid';

const fixRest = rest => {
	if (isNaN(rest)) {
		const parts = (rest + '').split(':');
		return parts[0] * 60 + parts[1] * 1;
	} else {
		return rest * 1;
	}
};

const WeightCard = ({
	item,
	trainingDay,
	trainingCycle,
	withStats,
	setWeightInput,
}) => {
	const {exercise} = item;
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const currentSession = useProfiledData('training.currentSession');
	const program = useCurrentProgram();
	const sessions = useSelector(state => state.training.sessions || []);

	const existingSession = useMemo(() => {
		return sessions.find(
			item => item.dayId === trainingDay.id && item.cycle === trainingCycle,
		);
	}, [sessions, trainingCycle, trainingDay]);

	const session = existingSession || currentSession;

	const startSession = async action => {
		if (session) {
			if (session.dayId !== trainingDay.id) {
				Alert.alert(
					'Новая сессия?',
					'Вы уже начали тренироваться по программе другого дня. Хотите начать новую по программе этого дня, или же продолжить ту тренировку?',
					[
						{
							text: 'Продолжить',
							style: 'cancel',
							onPress: () => {
								dispatch(
									setCurrentTrainingDay(session.dayId, session.cycle || 1),
								);
							},
						},
						{
							text: 'Начать новую',
							onPress: async () => {
								await dispatch(
									addTrainingSession({
										programId: program.id,
										dayId: trainingDay.id,
										cycle: trainingCycle,
									}),
								);
								action();
							},
						},
					],
				);
				return;
			}
		} else {
			await dispatch(
				addTrainingSession({
					programId: program.id,
					dayId: trainingDay.id,
					cycle: trainingCycle,
				}),
			);
		}

		action();
	};

	const handleEditSetStats = async () => {
		startSession(() => {
			navigation.navigate('EditStats', {exercises, trainingDay, trainingCycle});
		});
	};

	const exercises = useMemo(() => {
		// надо бы переписать, слишком здоровенная TODO
		let items;
		let setsCount = 0;
		let restDefault = 120;

		if (exercise.exercises) {
			items = exercise.exercises.concat();
			setsCount = exercise.superset ? exercise.superset.sets || 0 : 0;
			if (exercise.superset && exercise.superset.rest) {
				restDefault = exercise.superset.rest;
			}
		} else {
			items = [exercise];
			restDefault = extractParam(exercise, 'rest', 'number') || restDefault;
		}

		const doneSets = {};
		if (session) {
			items.forEach(exercise => {
				doneSets[exercise.id] = {
					active: true,
					sets: session.items
						.filter(item => item.exerciseId === exercise.id)
						.sort((a, b) => (a.setId < b.setId ? -1 : 1)),
				};
			});
		}

		return items.map(exerciseItem => {
			if (!setsCount) {
				const setsParam = exerciseItem.params.find(
					param => param.code === 'sets',
				);
				setsCount = setsParam ? setsParam.number : 4;
			}

			const repsDefault = extractParam(exerciseItem, 'reps', 'number');
			const sets = [];
			const reps = [];
			const rest = [];
			let repsNow = null;
			const extendedParams = exerciseItem.extendedParams || {};
			for (let i = 0; i < setsCount; ++i) {
				sets.push({
					weight:
						extractParam(doneSets[exerciseItem.id]?.sets[i], 'weight') || 0,
					id: doneSets[exerciseItem.id]?.sets[i]?.id,
				});
				if (extendedParams[i] && extendedParams[i].reps) {
					reps.push(extendedParams[i].reps.number);
				} else {
					reps.push(repsDefault);
				}
				if (extendedParams[i] && extendedParams[i].rest) {
					rest.push(fixRest(extendedParams[i].rest.number));
				} else {
					rest.push(restDefault);
				}
				if (repsNow === null && !sets[i].weight) {
					repsNow = reps[i];
				}
			}

			return {
				...exerciseItem,
				sets,
				reps,
				repsNow,
				rest: rest.map(fixRest),
			};
		});
	}, [exercise, session]);

	const handleAddWeight = () => {
		// Давайте попробуем понять, что именно мы сейчас добавляем
		let foundCandidate = null;
		let potentialWeight = 0;

		for (let i = 0; foundCandidate === null; ++i) {
			for (const exerciseItem of exercises) {
				if (i >= exerciseItem.sets.length) {
					foundCandidate = false;
					break;
				}
				if (!exerciseItem.sets[i].weight) {
					foundCandidate = {
						exercise: exerciseItem,
						setId: i,
					};
					if (i) {
						potentialWeight = exerciseItem.sets[i - 1].weight;
					}
					break;
				}
			}
		}

		if (!foundCandidate) {
			return;
		}
		startSession(() => {
			setWeightInput({
				value: potentialWeight,
				name: foundCandidate.exercise.name,
				onSubmit: async value => {
					await dispatch(
						addTrainingSessionItem({
							id: uuidv4(),
							exerciseId: foundCandidate.exercise.id,
							setId: foundCandidate.setId,
							start: Math.round(new Date().getTime() / 1000),
							comment: false,
							params: [{code: 'weight', value}],
						}),
					);
					setWeightInput(null);
				},
			});
		});
	};

	const handleEditSet = setId => () => {
		const set = session.items.find(item => item.id === setId);
		if (!set) {
			return;
		}
		setWeightInput({
			value: extractParam(set, 'weight'),
			onSubmit: async value => {
				if (existingSession) {
					await dispatch(
						updateTrainingSessionItem(existingSession.id, {
							...set,
							params: [{code: 'weight', value}],
						}),
					);
				} else {
					await dispatch(
						addTrainingSessionItem({
							...set,
							params: [{code: 'weight', value}],
						}),
					);
				}
				setWeightInput(null);
			},
		});
	};

	return (
		<View style={styles.container}>
			{exercises.map((exercise, exerciseCount) => (
				<View
					style={[
						styles.statsWrapperClose,
						exerciseCount ? styles.cardContainerSecond : null,
					]}
					key={exercise.id}>
					<View style={styles.cardContainer}>
						<View style={styles.cardSetsContainer}>
							<View style={styles.cardNameRepsContainer}>
								<Text style={styles.cardSetsText}>{exercise.name}</Text>
								<Text style={styles.cardWeightText}>
									{exercise.repsNow ? `${exercise.repsNow} повторений` : ''}
								</Text>
							</View>

							<View style={styles.cardWeightsContainer}>
								<View style={styles.cardSetsList}>
									{exercise.sets.map((set, setIndex) => {
										if (set.weight) {
											return (
												<TouchableOpacity
													style={styles.cardSetsSetWeight}
													key={setIndex}
													onPress={handleEditSet(set.id)}>
													<Text style={styles.cardSetsSetWeightText}>
														{set.weight}
														<Text style={styles.cardSetsSetKgText}> кг</Text>
													</Text>
												</TouchableOpacity>
											);
										} else {
											return (
												<View
													style={styles.cardSetsSetEmptyWeight}
													key={setIndex}>
													<Text style={styles.cardSetsSetEmptyWeightText}>
														—
													</Text>
												</View>
											);
										}
									})}
								</View>

								<TouchableOpacity
									style={styles.cardWeightDoneContainer}
									onPress={handleAddWeight}>
									<Text style={styles.cardWeightDoneText}>Выполненный вес</Text>
								</TouchableOpacity>
							</View>
							{withStats ? (
								<View style={styles.cardStatsContainer}>
									<Text style={styles.cardStatsText}>
										Статистика — свайп влево
									</Text>
								</View>
							) : null}
						</View>
					</View>
				</View>
			))}

			<View style={styles.successButtons}>
				<TouchableOpacity
					style={styles.successButton}
					onPress={handleEditSetStats}>
					<Text style={styles.successButtonText}>Начать упражнение</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	swipeWrapper: {
		flexDirection: 'row',
		width: '100%',
		zIndex: 1,
		backgroundColor: '#fff',
		justifyContent: 'space-between',
	},
	statsWrapper: {
		width: '90%',
		paddingRight: 10,
		paddingBottom: 100,
	},
	statsWrapperClose: {
		width: '100%',
		paddingBottom: 15,
	},
	playIcon: {
		position: 'absolute',
		top: 5,
		left: -35,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		top: 20,
	},

	container: {
		width: '100%',
	},
	cardContainer: {
		flexDirection: 'row',
		width: '100%',
		paddingLeft: 15,
		paddingRight: 15,
	},
	cardContainerSecond: {
		borderTopColor: 'rgba(0, 0, 0, 0.14)',
		borderTopWidth: 1,
		paddingTop: 20,
	},
	cardIconContainer: {
		width: 30,
	},
	cardPlayIcon: {},
	cardSetsContainer: {
		flexGrow: 1,
		flexShrink: 1,
	},
	cardSetsText: {
		color: '#0C0C0C',
		fontSize: 13,
		minHeight: 40,
		paddingRight: 10,
		flexGrow: 1,
		flexShrink: 1,
	},
	cardNameRepsContainer: {
		flexDirection: 'row',
		marginBottom: 20,
	},
	cardWeightsContainer: {
		flexDirection: 'row',
	},
	cardWeightContainer: {
		width: 110,
	},
	cardWeightText: {
		color: '#0C0C0C',
		fontSize: 13,
		textAlign: 'right',
		width: 80,
	},
	cardWeightDoneContainer: {
		borderBottomColor: '#0000FE',
		borderBottomWidth: 2,
		paddingBottom: 8,
		height: 30,
	},
	cardWeightDoneText: {
		color: '#9d9d9d',
		fontSize: 12,
	},
	cardStatsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 10,
	},
	cardStatsText: {
		color: '#9d9d9d',
		fontSize: 12,
	},
	cardSetsList: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		flexGrow: 1,
		flexShrink: 1,
	},
	cardSetsSetWeight: {
		marginRight: 10,
		marginBottom: 12,
	},
	cardSetsSetWeightText: {
		textAlign: 'center',
		fontFamily: 'FuturaPT-Medium',
		fontWeight: '700',
		color: '#0000FE',
		fontSize: 20,
		lineHeight: 20,
	},
	cardSetsSetKgText: {
		textAlign: 'center',
		fontFamily: 'FuturaPT-Medium',
		fontWeight: '500',
		color: '#0000FE',
		fontSize: 14,
	},
	cardSetsSetEmptyWeight: {
		marginRight: 10,
		marginBottom: 10,
	},
	cardSetsSetEmptyWeightText: {
		textAlign: 'center',
		fontFamily: 'FuturaPT-Medium',
		fontWeight: '700',
		color: '#0c0c0c',
		fontSize: 17,
		lineHeight: 18,
	},
	cardItemFirst: {
		height: 130,
		marginLeft: 14,
		marginRight: 14,
		paddingLeft: 45,
		paddingRight: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.14)',
	},
	cardItemSecond: {
		height: 100,
		marginLeft: 14,
		marginRight: 14,
		paddingLeft: 45,
		paddingRight: 10,
	},
	statsData: {
		width: '100%',
		paddingBottom: 30,
		top: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	statsData2: {
		width: '100%',
		paddingBottom: 30,
		top: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	statItem: {
		width: '10%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
	},
	statInput: {
		borderWidth: 1,
		borderColor: '#DBDBDB',
		borderRadius: 8,
		fontFamily: 'FuturaPT-Bold',
		color: '#000',
		fontSize: 16,
		lineHeight: 21,
		height: 38,
		textAlign: 'center',
	},
	subTitle: {
		textAlign: 'center',
		fontFamily: 'FuturaPT-Medium',
		fontWeight: '500',
		color: '#0000FE',
		fontSize: 15,
	},
	lastTitleSum: {
		fontSize: 20,
		color: '#0000FE',
		fontFamily: 'FuturaPT-Medium',
		fontWeight: '500',
		textAlign: 'center',
	},
	sufix: {
		textAlign: 'center',
		fontFamily: 'FuturaPT-Medium',
		color: '#0000FE',
		fontSize: 13,
		left: 4,
	},
	lastItem: {
		width: '33%',
		borderBottomWidth: 2,
		borderBottomColor: '#1010FE',
	},
	lastTitle: {
		color: '#000',
		textAlign: 'center',
		fontSize: 13,
		fontFamily: 'FuturaPT-Book',
		opacity: 0.5,
	},
	statsEdit: {},
	helpText: {
		fontSize: 11,
		color: '#9D9D9D',
		textAlign: 'right',
		paddingRight: 25,
	},
	circleNumber: {
		borderTopLeftRadius: 17,
		borderBottomLeftRadius: 17,
		width: 30,
		justifyContent: 'center',
		alignItems: 'center',
		opacity: 1,
		backgroundColor: 'rgba(13, 28, 113, 0.06);',
	},
	circleNumberClose: {
		borderTopLeftRadius: 17,
		borderBottomLeftRadius: 17,
		display: 'none',
		width: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(13, 28, 113, 0.06);',
		opacity: 0,
	},
	circleText: {
		transform: [{rotate: '-90deg'}],
		fontSize: 16,
		width: 200,
		textAlign: 'center',
		fontFamily: 'FuturaPT-Bold',
		fontWeight: 'bold',
		color: '#0E1D7A',
	},
	successButtons: {
		marginTop: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
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

export default WeightCard;
