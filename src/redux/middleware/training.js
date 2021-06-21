import * as Actions from '../actions';
import * as RootNavigation from '../../navigation/RootNavigation';
import useCurrentProgram from '../../hooks/useCurrentProgram';
import {useSelector} from 'react-redux';
import useProfiledData from '../../hooks/useProfiledData';

const getProfiledData = (state, path) => {
  const pathItems = typeof path === 'string' ? path.split('.') : path;
  const profile = state.profile.profile;
  if (!profile) {
    return null;
  }
  const item = pathItems.reduce(
    (acc, pathItem) => (acc && acc[pathItem] ? acc[pathItem] : null),
    state,
  );
  return item && typeof item[profile.id] !== 'undefined'
    ? item[profile.id]
    : undefined;
};

const getCurrentProgram = state => {
  const programs = getProfiledData(state, 'training.programs');
  const currentProgram = getProfiledData(state, 'training.currentProgram');

  if (typeof programs === 'undefined') {
    return undefined;
  }

  if (currentProgram) {
    const program = programs.find(
      trainingProgram => trainingProgram.id === currentProgram,
    );
    if (program) {
      return program;
    }
  }

  if (programs && programs.length) {
    return programs[0];
  }

  return null;
};

const switchTrainingDay = (store, action) => {
  // RootNavigation.navigate('TrainFitness');
  const {trainingDayId, trainingCycle} = action;
  const state = store.getState();
  const program = getCurrentProgram(state);

  const trainingDayData = program.program.trainingDays.find(
    day => day.id === trainingDayId,
  );

  if (trainingDayData) {
    const trainingDay = {
      ...trainingDayData,
      exercises: trainingDayData.exercises.map(exercise => {
        const programExercise =
          program.program.exercises[exercise.exercise_id] || {};
        return {
          ...programExercise,
          ...exercise,
        };
      }),
    };

    console.log('got training day');
    console.log(trainingDay);
    RootNavigation.navigate('TrainFitness', {trainingCycle, trainingDay});
  }
};

const training = store => next => async action => {
  const processed = next(action);

  switch (action.type) {
    case Actions.SET_CURRENT_TRAINING_DAY:
      switchTrainingDay(store, action);
      break;
  }

  return processed;
};

export default training;
