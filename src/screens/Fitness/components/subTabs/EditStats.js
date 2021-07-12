import React, {useMemo, useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Dimensions,
  ScrollView,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {useNavigation} from '@react-navigation/native';
import GoBack from '../../../../assets/formTab/goback.svg';
import UpArr from '../../../../assets/formTab/up.svg';
import DownArr from '../../../../assets/formTab/down.svg';
import DoneIcon from '../../../../assets/formTab/done.svg';
import CloseIcon from '../../../../assets/formTab/closemdpi.svg';
import TimerIcon from '../../../../assets/formTab/Timer.svg';
import useProfiledData from '../../../../hooks/useProfiledData';
import { useDispatch, useSelector } from 'react-redux'
import { addTrainingSessionItem, updateTrainingSessionItem } from '../../../../redux/action-creators'
import {extractParam, timer} from '../../../../utils';

const {width} = Dimensions.get('window');
const getTimeLeft = timerSettings => {
  return timerSettings.time;
};

const Timer = props => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(props));

  useEffect(() => {
    setTimeLeft(getTimeLeft(props));
    if (props.type === 'active') {
      const interval = setInterval(() => {
        setTimeLeft(
          Math.round(
            props.startTime + props.time - new Date().getTime() / 1000,
          ),
        );
      }, 500);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.type]);

  return (
    <View style={styles.rest}>
      <Text style={styles.restText}>Отдых</Text>
      <View style={styles.restTime}>
        <TimerIcon />
        <Text style={styles.timerText}>
          {timeLeft < -600 ? 'давно' : timer(timeLeft)}
        </Text>
      </View>
    </View>
  );
};

const EditStats = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentSession = useProfiledData('training.currentSession');
  const {exercises, trainingDay, trainingCycle} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(0);
  const [setData, setSetData] = useState(null);
  const sessions = useSelector(state => state.training.sessions || []);

  const existingSession = useMemo(() => {
    return sessions.find(
      item => item.dayId === trainingDay.id && item.cycle == trainingCycle,
    );
  }, [sessions, trainingCycle, trainingDay]);
  const session = existingSession || currentSession;

  const doneSets = useMemo(() => {
    const doneSets = {};

    if (session) {
      exercises.forEach(exercise => {
        doneSets[exercise.id] = {
          active: true,
          sets: session.items
            .filter(item => item.exerciseId === exercise.id)
            .sort((a, b) => (a.setId < b.setId ? -1 : 1)),
        };
      });
    }

    return doneSets;
  }, [exercises, session]);

  const sets = useMemo(() => {
    const sets = [];
    const totalSets = exercises[0].sets.length;

    for (let setIndex = 0; setIndex < totalSets; ++setIndex) {
      const set = {
        values: {},
        startTime: null,
        endTime: null,
      };

      let totalDone = 0;
      for (const exercise of exercises) {
        set.values[exercise.id] = extractParam(
          doneSets[exercise.id].sets[setIndex],
          'weight',
        );
        if (set.values[exercise.id]) {
          ++totalDone;
        }
        if (doneSets[exercise.id].sets[setIndex]?.start) {
          set.startTime = Math.min(
            set.startTime || Number.MAX_SAFE_INTEGER,
            doneSets[exercise.id].sets[setIndex].start,
          );
          set.endTime = Math.max(
            set.endTime || 0,
            doneSets[exercise.id].sets[setIndex].start,
          );
        }
      }

      if (totalDone) {
        if (totalDone === exercises.length) {
          set.done = 'all';
        } else {
          set.done = 'some';
        }
      } else {
        set.done = 'none';
      }

      let timer = null;
      // const timerTime = exercises[0].rest[setIndex];
      const timerTime =
        exercises[0].rest && exercises[0].rest[setIndex]
          ? exercises[0].rest[setIndex]
          : 180;

      if (setIndex !== totalSets - 1) {
        timer = {
          type: 'normal',
          time: timerTime,
        };
      }
      if (set.done === 'none') {
        if (setIndex) {
          const lastSet = sets[setIndex - 1];
          if (lastSet.done === 'all') {
            // ага! вот где у нас активный таймер!
            sets[setIndex - 1].timer = {
              type: 'active',
              time: timerTime,
              startTime: lastSet.endTime,
            };
          }
        }
      } else {
        if (setIndex) {
          const lastSet = sets[setIndex - 1];
          if (lastSet.done === 'all') {
            // ага! вот где у нас активный таймер!
            sets[setIndex - 1].timer = {
              type: 'done',
              time: set.startTime - lastSet.endTime,
            };
          }
        }
      }

      set.timer = timer;
      sets.push(set);
    }

    return sets;
  }, [exercises, doneSets]);

  const handleEditSet = (exercise, setId) => () => {
    let value = extractParam(doneSets[exercise.id].sets[setId], 'weight');
    if (!value && setId) {
      // если это не первый сет - посмотрим в предыдущий сет, может, удастся отжать оттуда значение
      value = extractParam(doneSets[exercise.id].sets[setId - 1], 'weight');
    }

    setSetData({
      exercise,
      setId,
      value,
      id: doneSets[exercise.id].sets[setId]
        ? doneSets[exercise.id].sets[setId].id
        : null,
    });
    setValue(value);
    setModalVisible(true);
    // onVisibleModal(0, value, setId);
  };

  const handleSetDone = async () => {
    if (existingSession) {
      await dispatch(
        updateTrainingSessionItem(existingSession.id, {
          id: setData.id || uuidv4(),
          exerciseId: setData.exercise.id,
          setId: setData.setId,
          start: Math.round(new Date().getTime() / 1000),
          comment: false,
          params: [
            {code: 'weight', value},
          ],
        }),
      );
    } else {
      await dispatch(
        addTrainingSessionItem({
          id: setData.id || uuidv4(),
          exerciseId: setData.exercise.id,
          setId: setData.setId,
          start: Math.round(new Date().getTime() / 1000),
          comment: false,
          params: [
            // {code: 'reps', value: repsDone},
            {code: 'weight', value},
          ],
        }),
      );
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.header}>
        <GoBack width={50} height={25} />
        <Text style={styles.headerTitle}>{trainingDay.name}</Text>
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabsWrapper}>
        {sets.map((item, index) => {
          return (
            <View style={styles.editItem} key={`set${index}`}>
              <Text style={styles.title}>{index + 1}-й подход</Text>

              {exercises.map((exercise, exerciseIndex) => (
                <View
                  style={[
                    styles.cardHeader,
                    exerciseIndex ? styles.cardHeaderSecond : null,
                  ]}
                  key={exercise.id}>
                  <View style={styles.cardTitle}>
                    <Text style={styles.cardExerciseName}>{exercise.name}</Text>
                    <Text style={styles.cardExerciseReps}>
                      {exercise.reps[index]} повторений
                    </Text>
                  </View>
                  <View style={styles.cardButtons}>
                    <TouchableOpacity
                      style={styles.defaultBtn}
                      onPress={handleEditSet(exercise, index)}>
                      <Text style={styles.defaultText}>
                        {extractParam(
                          doneSets[exercise.id].sets[index],
                          'weight',
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {item.timer ? <Timer {...item.timer} /> : null}
            </View>
          );
        })}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.topTouchable}>
            <View style={styles.closeIcon}>
              <CloseIcon />
            </View>
          </TouchableOpacity>

          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Выполнен вес</Text>
            <View style={styles.inputView}>
              <TouchableOpacity
                style={styles.modalArrUp}
                onPress={() => setValue(value + 0.5)}>
                <UpArr />
              </TouchableOpacity>
              <TextInput
                style={styles.lastItem}
                onChangeText={value => setValue(Number(value))}
                value={value ? value.toString() : ''}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.modalArrDown}
                onPress={() => setValue(value - 0.5)}>
                <DownArr />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSetDone} style={styles.doneBtn}>
              <DoneIcon />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 15,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'FuturaPT-Medium',
    fontWeight: '500',
    lineHeight: 25,
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0, .7)',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 0,
  },
  topTouchable: {
    flexGrow: 1,
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
  },
  closeIcon: {
    position: 'absolute',
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    bottom: 15,
    right: 15,
  },

  modalView: {
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: width,
    padding: 20,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputView: {
    width: width,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalArrUp: {
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
  },
  modalArrDown: {
    justifyContent: 'center',
    alignItems: 'center',
    left: 20,
  },
  doneBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#1317CE',
    width: width,
  },
  tabsWrapper: {
    flexDirection: 'column',
    marginTop: 60,
    alignItems: 'center',
    paddingBottom: 145,
  },
  header: {
    height: 60,
    position: 'absolute',
    width: width,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 21,
    fontFamily: 'FuturaPT-Medium',
    fontWeight: '500',
    color: '#000',
  },
  editItem: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 21,
    lineHeight: 25,
    color: '#000',
    fontFamily: 'FuturaPT-Medium',
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  cardHeaderSecond: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.13)',
  },
  cardExerciseName: {
    width: '65%',
    color: '#0C0C0C',
    fontSize: 13,
    textAlign: 'left',
  },
  cardExerciseReps: {
    width: '30%',
    color: '#0C0C0C',
    fontSize: 13,
    textAlign: 'right',
  },
  lastItem: {
    width: '35%',
    height: 50,
    fontSize: 27,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.13)   ',
    color: '#1010FE',
    textAlign: 'center',
    borderRadius: 9,
  },
  defaultText: {
    fontSize: 27,
    fontFamily: 'FuturaPT-Book',
    fontWeight: 'bold',
    color: '#1010FE',
    textAlign: 'center',
  },
  defaultBtn: {
    width: '30%',
    borderBottomWidth: 1,
    borderBottomColor: '#1010FE',
  },
  cardButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  lastTitle: {
    color: '#000',
    fontSize: 13,
    fontFamily: 'FuturaPT-Book',
    opacity: 0.5,
  },

  cardTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  rest: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#6B1E57',
    height: 45,
    borderRadius: 12,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restTime: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  restText: {
    color: '#fff',
    width: 100,
    fontSize: 18,
    lineHeight: 25,
    fontFamily: 'FuturaPT-Medium',
    fontWeight: '500',
  },
  timerText: {
    color: '#fff',
    fontFamily: 'FuturaPT-Medium',
    fontWeight: '500',
    fontSize: 15,
    marginLeft: 10,
    lineHeight: 25,
  },
});

export default EditStats;
