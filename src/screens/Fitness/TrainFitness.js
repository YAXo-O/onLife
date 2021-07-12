import React, {useMemo, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Tab from './components/Tab';
import {useNavigation} from '@react-navigation/native';
import useProfiledData from '../../hooks/useProfiledData';
import {useDispatch} from 'react-redux';
import {saveSession} from '../../redux/action-creators';
import WeightInputModal from './components/WeightInputModal';

const TrainFitness = props => {
  const {trainingDay, trainingCycle} = props.route.params;
  const session = useProfiledData('training.currentSession');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [weightInput, setWeightInput] = useState(null);

  const exercises = useMemo(() => {
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
          .map(exercise => exercise.name)
          .join(', ');
        exercises.push(supersetBlock);
      } else {
        exercises.push(e);
      }
    }

    return exercises;
  }, [trainingDay]);

  const canIFinish = useMemo(
    () => session && trainingDay.id === session.dayId && session.items.length,
    [trainingDay, session],
  );

  const handleCancelFinish = () => {};

  const handleReallyFinish = async () => {
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Тренировка</Text>
        {trainingDay ? (
          <Text style={styles.headerName}>{trainingDay.name}</Text>
        ) : null}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabsWrapper}>
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
        {canIFinish ? (
          <View style={styles.successButtons}>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleFinishSession}>
              <Text style={styles.successButtonText}>Завершить тренировку</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <WeightInputModal
        weightInput={weightInput}
        onClose={() => setWeightInput(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingTop: 35,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: 'FuturaPT-Book',
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  headerName: {
    fontFamily: 'FuturaPT-Book',
    fontSize: 16,
    opacity: 0.52,
    fontWeight: 'normal',
    color: '#000000',
  },
  tabsWrapper: {
    paddingBottom: 100,
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
