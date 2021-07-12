import React, {useEffect, useMemo, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-community/picker';
import MainBG from '../../assets/formTab/background.png';
import Logo from '../../assets/logotype.svg';
import SelectArr from '../../assets/formTab/select-arr.svg';
import useCurrentProgram from '../../hooks/useCurrentProgram';
import {useDispatch, useSelector} from 'react-redux'
import { getTrainingPrograms, getTrainingSessions, logout, setCurrentTrainingDay } from '../../redux/action-creators'

const {height, width} = Dimensions.get('window');

const FitnesDashboard = ({navigation}) => {
  const dispatch = useDispatch();
  const [trainingCycle, setTrainingCycle] = useState('1');
  const [trainingDayId, setTrainingDayId] = useState(null);
  const program = useCurrentProgram();
  const {sessions} = useSelector(state => state.training);
  const {token} = useSelector(state => state.auth);

  const trainingCycles = useMemo(() => {
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

  const trainingDays = useMemo(() => {
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

  const pickerNames = useMemo(() => {
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

  useEffect(() => {
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
            <Logo />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <View style={styles.inputBlock}>
              <Text style={styles.selectlabel}>Номер круга</Text>
              <Picker
                selectedValue={trainingCycle}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  setTrainingCycle(itemValue)
                }>
                {pickerNames.cycles.map(cycle => <Picker.Item label={cycle.name} value={cycle.id} key={cycle.id} />)}
              </Picker>
              <SelectArr style={styles.selectArr} />
            </View>

            <View style={styles.inputBlockBottom}>
              <Text style={styles.selectlabel}>Тренировка</Text>
              <Picker
                selectedValue={trainingDayId}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  setTrainingDayId(itemValue)
                }>
                {pickerNames.days.map(day => (
                  <Picker.Item
                    label={day.name}
                    value={day.id}
                    key={day.id}
                  />
                ))}
              </Picker>
              <SelectArr style={styles.selectArr} />
            </View>
          </View>
          <View style={styles.startWrapper}>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={handleStartTraining}>
              <Text style={styles.startBtnText}>Start</Text>
            </TouchableOpacity>
            <Text style={styles.startText}>Начать тренировку</Text>
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
    justifyContent: 'space-between',
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
  },
  selectlabel: {
    color: '#fff',
    opacity: 0.3,
    marginLeft: 6,
    fontFamily: 'FuturaPT-Book',
    fontSize: 15,
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
});

export default FitnesDashboard;

