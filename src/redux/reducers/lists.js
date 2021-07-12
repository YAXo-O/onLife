import * as Actions from '../actions';
import produce from 'immer';

const INITIAL_STATE = {
  muscles: null,
  exerciseParams: null,
  loading: false,
  loadingErrors: {},
  loadingMessage: null,
};

const listsReducer = produce((draft, action) => {
  switch (action.type) {
    case Actions.response(Actions.GET_LISTS):
      Object.keys(INITIAL_STATE).forEach(key => {
        if (action.result[key]) {
          draft[key] = action.result[key];
        }
      });
      break;
  }
}, INITIAL_STATE);

export default listsReducer;
