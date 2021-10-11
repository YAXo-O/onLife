import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	ActionSheetIOS,
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	Dimensions,
	Platform,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import MainBG from '@app/assets/formTab/background.png';
import Logo from '@app/assets/logotype.svg';
import SelectArr from '@app/assets/formTab/select-arr.svg';
import useCurrentProgram from '@app/hooks/useCurrentProgram';
import {logout, setCurrentTrainingDay} from '@app/redux/action-creators';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

const PickMe = ({ name, values, value, style, onSelect }) => {
	const valueText = React.useMemo(() => {
		// 'id' and 'value' might be long or uuid
		// and 'id' values come as number from server
		return values.find(item => String(item.id) === String(value))?.name ?? '';
	}, [ value, values ]);

	if (Platform.OS === 'ios') {
		const handleOpenSelect = () => {
			ActionSheetIOS.showActionSheetWithOptions(
				{
					options: values.map(item => item.name),
				},
				buttonIndex => {
					onSelect(values[buttonIndex].id);
				},
			);
		};

		return (
			<TouchableOpacity style={style} onPress={handleOpenSelect}>
				<Text style={styles.selectlabel}>{name}</Text>
				<Text style={styles.selectedOption}>{valueText}</Text>
				<SelectArr style={styles.selectArr} />
			</TouchableOpacity>
		);
	} else {
		return (
			<View style={style}>
				<Text style={styles.selectlabel}>{name}</Text>
				<Picker
					selectedValue={value}
					style={styles.picker}
					onValueChange={(itemValue, itemIndex) =>
						onSelect(itemValue)
					}>
					{values.map(day => (
						<Picker.Item
							label={day.name}
							value={day.id}
							key={day.id}
						/>
					))}
				</Picker>
				<SelectArr style={styles.selectArr} />
			</View>
		);
	}
};

const FitnesDashboard = () => {
	const dispatch = useDispatch();
	const [trainingCycle, setTrainingCycle] = React.useState('1');
	const [trainingDayId, setTrainingDayId] = React.useState(null);
	const program = useCurrentProgram();
	const { sessions } = useSelector(state => state.training);

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
	};

	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		<View style={styles.container}>
			<ImageBackground source={MainBG} style={styles.image}>
				<View style={styles.headerBar}>
					<TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
						<FontAwesome5 style={styles.logout} name="chevron-left" />
						<Text style={[styles.logout]}>Сменить пользователя</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.mainContainer}>
					<View style={[styles.cell, styles.cellTop]}>
						<TouchableOpacity onPress={handleRefresh}>
							<Logo />
						</TouchableOpacity>
					</View>
					<View style={styles.cell}>
						<View style={styles.inputWrapper}>
							<PickMe
								name="Номер круга"
								style={styles.inputBlock}
								values={pickerNames.cycles}
								value={trainingCycle}
								onSelect={value => setTrainingCycle(value)}
							/>
							<PickMe
								name="Тренировка"
								style={styles.inputBlockBottom}
								values={pickerNames.days}
								value={trainingDayId}
								onSelect={value => setTrainingDayId(value)}
							/>
						</View>
					</View>
					<View style={[styles.cell, styles.cellBottom]}>
						<View style={styles.startWrapper}>
							<TouchableOpacity
								style={styles.startBtn}
								onPress={handleStartTraining}>
								<Text style={styles.startBtnText}>Start</Text>
							</TouchableOpacity>
							<Text style={styles.startText}>Начать тренировку</Text>
						</View>
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
		marginTop: 'auto',
		marginBottom: 'auto',
		alignItems: 'center',
		flexDirection: 'column',
	},
	cell: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	cellTop: {
		alignItems: 'flex-end',
		paddingBottom: 8,
	},
	cellBottom: {
		paddingTop: 8,
		alignItems: 'flex-start',
	},
	image: {
		flex: 1,
		resizeMode: 'center',
		alignItems: 'center',
	},
	selectArr: {
		position: 'absolute',
		right: 20,
		top: 35,
		opacity: 0.4,
	},
	inputWrapper: {
		marginTop: 20,
		marginBottom: 20,
		paddingBottom: 15,
		width: width - 80,
		backgroundColor: '#000B2C',
		borderRadius: 14,
	},
	inputBlock: {
		paddingTop: 15,
		paddingLeft: 14,
		paddingRight: 20,
		paddingBottom: 15,
	},
	inputBlockBottom: {
		borderTopWidth: 1,
		color: '#fff',
		paddingTop: 13,
		borderColor: 'rgba(255, 255, 255, 0.13)',
		paddingLeft: 14,
		paddingRight: 20,
		zIndex: 1,
	},
	selectlabel: {
		color: '#fff',
		opacity: 0.3,
		marginLeft: 6,
		fontFamily: 'FuturaPT-Book',
		fontSize: 15,
	},
	selectedOption: {
		color: '#fff',
		marginLeft: 6,
		fontFamily: 'FuturaPT-Book',
		fontSize: 18,
	},
	picker: {
		width: '100%',
		height: 35,
		color: '#fff',
		fontFamily: 'FuturaPT-Book',
		backgroundColor: '#000B2C',
		fontSize: 18,
		fontWeight: '600',
		lineHeight: 23,
		zIndex: 0,
	},
	startWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	startBtn: {
		width: 95,
		height: 95,
		backgroundColor: '#1317CE',
		alignItems: 'center',
		borderRadius: 100,
		justifyContent: 'center',
		marginBottom: 20,
	},
	startBtnText: {
		fontSize: 20,
		fontFamily: 'Jost-Bold',
		fontStyle: 'italic',
		textTransform: 'uppercase',
		fontWeight: 'bold',
		letterSpacing: 0.04,
		color: '#fff',
	},
	startText: {
		fontSize: 12,
		fontFamily: 'Jost-Bold',
		fontStyle: 'italic',
		textTransform: 'uppercase',
		fontWeight: 'bold',
		letterSpacing: 0.04,
		color: '#fff',
	},
	headerBar: {
		flexDirection: 'row',
		backgroundColor: '#E8E8E840',
		padding: 8,
		minHeight: 50,
		width: '100%',
	},
	logoutContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	logout: {
		fontFamily: 'FuturaPT-Book',
		fontSize: 16,
		paddingRight: 4,
		fontWeight: 'normal',
		color: '#007bff',
	},
});

export default FitnesDashboard;

