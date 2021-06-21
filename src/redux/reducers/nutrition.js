import * as Actions from '../actions';
import produce from 'immer';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_STATE = {
  programs: null,
  preferences: { diet_type: '' },
  preferencesSynced: true,
  loading: false,
  loadingErrors: {},
  loadingMessage: null,
};

const nutritionReducer = produce((draft, action) => {
  console.log(`event:: ${action.type}`);

  switch (action.type) {
    case Actions.request(Actions.GET_NUTRITION_PROGRAM):
      break;

    case Actions.fail(Actions.GET_NUTRITION_PROGRAM):
      console.log('FAILURE NUTRITION');
      break;

    case Actions.response(Actions.GET_NUTRITION_PROGRAM):
      if (action.result.programs) {
        draft.programs = action.result.programs;
      }
      break;

    case Actions.UPDATE_NUTRITION_PREFERENCE:
      if (!draft.preferences) draft.preferences = {};
      draft.preferences[action.code] = action.value;
      draft.preferencesSynced = false;
      break;
  }
}, INITIAL_STATE);

export default nutritionReducer;