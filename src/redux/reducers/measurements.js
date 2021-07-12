import * as Actions from '../actions';
import produce from 'immer';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_STATE = {
  measurements: null,
  myMeasurements: null,
  loading: false,
  loadingErrors: {},
  loadingMessage: null,
};

const measurementsReducer = produce((draft, action) => {
  switch (action.type) {
    case Actions.request(Actions.GET_MEASUREMENTS):
      break;

    case Actions.fail(Actions.GET_MEASUREMENTS):
      console.log('FAILURE MEASURE');
      break;
    case Actions.response(Actions.GET_MEASUREMENTS):
      if (action.result.measurements) {
        draft.myMeasurements = action.result.measurements;
      }
      break;

    case Actions.response(Actions.GET_LISTS):
      if (action.result.measurements) {
        draft.measurements = action.result.measurements;
      }
      break;

    case Actions.ADD_MEASUREMENT:
      const measurement = {...action.measurement, synced: false};

      const pos = draft.myMeasurements.findIndex((m) => m.code == measurement.code && m.created == measurement.created);
      if (pos === -1) {
        draft.myMeasurements.push({...measurement, id: uuidv4()});
      } else {
        draft.myMeasurements.splice(pos, 1, {...draft.myMeasurements[pos], ...measurement});
      }
      break;

    case Actions.response(Actions.SYNC_MEASUREMENTS):
      draft.myMeasurements = action.measurements;
      break;

    case Actions.SET_INITIAL_STATE:
      console.log('init MEASUREMENTS!');
      // draft.measurements = null;
      // if (action.state.myMeasurements) draft.myMeasurements = action.state.myMeasurements;
      break;
  }

}, INITIAL_STATE);

export default measurementsReducer;
