import * as Actions from '../actions';
import produce from 'immer';

const INITIAL_STATE = {
  synced: null,
  syncItems: {},
};

const syncReducer = produce((draft, action) => {
  switch (action.type) {
    case Actions.LOAD_INITITAL_STATE:
      draft.synced = false;
      break;

    case Actions.SYNC_TRAINING_PROGRAMS:
      if (!draft.syncItems) {
        draft.syncItems = {};
      }
      draft.syncItems.trainingPrograms = true;
      break;

    case Actions.response(Actions.GET_TRAINING_PROGRAMS):
      if (draft.syncItems?.trainingPrograms) {
        delete draft.syncItems?.trainingPrograms;
      }
      break;
  }
}, INITIAL_STATE);

export default syncReducer;
