import * as Actions from '../actions';
import produce from 'immer';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_STATE = {
  sendApproved: false,
  photos: [],
  loading: false,
  loadingErrors: {},
  loadingMessage: null,
};

const photosReducer = produce((draft, action) => {
  switch (action.type) {
    case Actions.ADD_PHOTO:
      draft.photos.push({
        id: uuidv4(),
        ...action.photo,
      })
      break;

    case Actions.DELETE_PHOTO:
      draft.photos = draft.photos.filter((item) => item.id !== action.id);
      break;

    case Actions.request(Actions.UPLOAD_PHOTOS):
      draft.loading = true;
      draft.loadingErrors = {};
      draft.loadingMessage = null;
      break;

    case Actions.DELETE_PHOTOS:
      draft.photos = [];
      break;

    case Actions.fail(Actions.UPLOAD_PHOTOS):
      draft.loading = false;
      draft.loadingErrors = action.data.errors || {};
      draft.loadingMessage = action.data.message;
      break;

    case Actions.response(Actions.UPLOAD_PHOTOS):
      draft.photos = [];
      break;

    case Actions.request(Actions.UPLOAD_FILE):
      draft.loading = true;
      draft.loadingErrors = {};
      draft.loadingMessage = null;
      break;

    case Actions.fail(Actions.UPLOAD_FILE):
      draft.loading = false;
      draft.loadingErrors = action.data.errors || {};
      draft.loadingMessage = action.data.message;
      break;
    case Actions.response(Actions.UPLOAD_FILE):
      draft.loading = false;
      break;

    case Actions.SET_INITIAL_STATE:
      if (action.state.photos) draft.photos = action.state.photos;
      break;
  }

}, INITIAL_STATE);

export default photosReducer;
