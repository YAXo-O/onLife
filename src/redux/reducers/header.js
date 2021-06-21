import * as Actions from '../actions';
import produce from 'immer';

const INITIAL_STATE = {
  button: null,
  title: null,
  section: null,
  menu: null,
};

const headerReducer = produce((draft, action) => {
  switch (action.type) {
    case Actions.SET_HEADER_BUTTON:
      draft.button = action.button;
      break;

    case Actions.SET_HEADER_TITLE:
      draft.title = action.title;
      break;

    case Actions.SET_HEADER_SECTION:
      draft.section = action.section;
      break;

    case Actions.SET_HEADER_MENU:
      draft.menu = action.menu;
      break;
  }
}, INITIAL_STATE);

export default headerReducer;