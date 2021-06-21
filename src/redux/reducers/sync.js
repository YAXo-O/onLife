import * as Actions from '../actions';
import produce from 'immer';

const INITIAL_STATE = {
  synced: null,
};

const syncReducer = produce((draft, action) => {
  switch (action.type) {
    case Actions.LOAD_INITITAL_STATE:
      draft.synced = false;
      break;
  }
}, INITIAL_STATE);

export default syncReducer;