import * as React from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import useCurrentProgram from '@app/hooks/useCurrentProgram';
import { setCurrentTrainingDay } from '@app/redux/action-creators';

import MainBG from '@app/assets/formTab/background.png';
import Logo from '@app/assets/logotype.svg';

const {height, width} = Dimensions.get('window');

const FitnesDashboard = ({navigation}) => {
	const dispatch = useDispatch();
	const [trainingCycle, setTrainingCycle] = React.useState('1');
	const [trainingDayId, setTrainingDayId] = React.useState(null);
	const program = useCurrentProgram();
	const {sessions} = useSelector(state => state.training);
	const {token} = useSelector(state => state.auth);

	const trainingCycles = React.useMemo(() => {
		const cycles = [];

		if (program) {
			const totalCycles = program.program.cycles || 4;
			for (let i = 0; i < totalCycles; ++i) {
				cycles.push({
					id: i + 1,
					name: `№${i + 1}`,
				});
			}
		}

		return cycles;
	}, [program]);

	const trainingDays = React.useMemo(() => {
		if (!program) {
			return [];
		}
		return (program.program.trainingDays || []).map((day, index) => {
			return {
				id: day.id,
				name: day.name || `День №${index + 1}`,
			};
		});
	}, [program]);

	const pickerNames = React.useMemo(() => {
		const names = {cycles: [], days: []};
		const finished = {};
		if (sessions) {
			for (const session of sessions) {
				finished[`${session.dayId}|${session.cycle}`] = true;
			}
		}

		for (const cycle of trainingCycles) {
			names.cycles.push({
				...cycle,
				name: finished[`${trainingDayId}|${cycle.id}`]
					? `${cycle.name} ✔`
					: cycle.name,
			});
		}

		for (const day of trainingDays) {
			names.days.push({
				...day,
				name: finished[`${day.id}|${trainingCycle}`]
					? `${day.name} ✔`
					: day.name,
			});
		}

		return names;
	}, [sessions, trainingCycle, trainingDayId, trainingCycles, trainingDays]);

	React.useEffect(() => {
		if (!trainingDays || trainingDays.length === 0) {
			return;
		}
		if (trainingDayId) {
			if (trainingDays.find(day => day.id === trainingDayId)) {
				return;
			}
		}
		setTrainingDayId(trainingDays[0].id);
	}, [trainingDays, trainingDayId]);

	const handleStartTraining = () => {
		if (!trainingDayId) {
			return;
		}

		dispatch(setCurrentTrainingDay(trainingDayId, trainingCycle));
	};

	const handleRefresh = () => {
		dispatch({type: 'SYNC_TRAINING_SESSIONS'});
		// dispatch(logout());
		// dispatch(getTrainingPrograms());
	};

	return (
		<View style={styles.container}>
			<ImageBackground source={MainBG} style={styles.image}>
				<View style={styles.mainContainer}>
					<TouchableOpacity onPress={handleRefresh}>
						<Logo/>
					</TouchableOpacity>
					<View style={styles.inputWrapper}>
						<Text style={styles.soonText}>Скоро этот раздел{'\n'}будет заполнен</Text>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	mainContainer: {
		flex: 0.7,
		alignItems: 'center',
		borderRadius: 14,
		padding: 20,
		flexDirection: 'column',
		top: '-5%',
	},
	image: {
		flex: 1,
		paddingTop: 10,
		resizeMode: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	selectArr: {
		position: 'absolute',
		right: 20,
		top: 35,
		opacity: .4,
	},
	inputWrapper: {
		marginTop: 20,
		marginBottom: 20,
		paddingTop: 100,
		paddingBottom: 15,
		width: width - 80,
		borderColor: 'white',
	},
	soonText: {
		fontSize: 14,
		fontFamily: 'Jost-Bold',
		textTransform: 'uppercase',
		fontWeight: 'bold',
		color: '#fff',
		textAlign: 'center',
		lineHeight: 20,
	},
});

export default FitnesDashboard;

