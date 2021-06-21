import * as Actions from '../actions';
import produce from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { TRAINING_SESSION_ACTIVE } from '../../constants/statuses';

const start = Math.floor((new Date()).getTime() / 1000) - 7 * 60;

const INITIAL_STATE = {
  programs: [],
  currentProgram: {},
  currentSession: {},
  currentDay: null,
  programId: 1,
  requestLoading: false,
  requestErrors: {},
  requestMessage: null,
  sessions: [],
};

const trainingReducer = produce((draft, action) => {
  switch (action.type) {
    case Actions.response(Actions.GET_PROFILE):
      if (action.result.programs) draft.programs = action.result.programs;
      break;

    case Actions.SET_INITIAL_STATE:
      if (action.state.programs) draft.programs = action.state.programs;
      if (action.state.session) {
        console.log(`we are setting initial ${action.state.session.id}`);
        draft.session = action.state.session;
      }
      break;

    case Actions.response(Actions.GET_TRAINING_PROGRAMS):
      if (action.result.programs) {
        draft.programs[action.profile_id] = action.result.programs;
      }
      break;

    case Actions.ADD_TRAINING_SESSION_ITEM:
      const p = draft.currentSession[action.profile_id].items.findIndex(item => item.id === action.sessionItem.id);
      if (p === -1) {
        draft.currentSession[action.profile_id].items.push(action.sessionItem);
      } else {
        draft.currentSession[action.profile_id].items.splice(p, 1, action.sessionItem);
      }
      break;

    case Actions.SAVE_TRAINING_SESSION:
      console.log(`here we reset session`);
      if (!draft.sessions) {
        draft.sessions = [];
      }
      const session = draft.currentSession[action.profile_id];
      draft.sessions.push({...session, synced: false});
      // draft.session = null;
      delete draft.currentSession[action.profile_id];
      console.log('reset completed');
      break;

    case Actions.response(Actions.SYNC_TRAINING_SESSIONS):
      draft.sessions = action.sessions;
      break;

    case Actions.SET_CURRENT_TRAINING_PROGRAM: {
      console.log(`got here to set program ${action.programId} for profile ${action.profile_id}`);
      if (typeof draft.currentProgram === 'undefined') draft.currentProgram = {};
      draft.currentProgram[action.profile_id] = action.programId;
      break;
    }

    case Actions.ADD_TRAINING_SESSION:
      console.log(`HERE WE ADD TRAINING SESSIONG`);
      if (!draft.currentSession) draft.currentSession = {};

      draft.currentSession[action.profile_id] = {
        id: uuidv4(),
        start: Math.round((new Date()).getTime() / 1000),
        status: TRAINING_SESSION_ACTIVE,
        profile_id: action.profile_id,
        items: [],
        ...action.session,
      }
      break;
  }
}, INITIAL_STATE);

export default trainingReducer;
