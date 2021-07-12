import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

const apiVersion = '';
const apiUrl = (point, version = apiVersion) =>
  `https://powertrain.app/api/app/${version ? `${version}/` : ''}${point}`;
const apiHeaders = token => ({headers: {Authorization: `Bearer ${token}`}});

export const loginPhone = async ({phone}) => {
  const {data} = await axios.post(apiUrl('login-phone', null), {phone});
  return data;
};

export const getLists = async ({token}) => {
  const {data} = await axios.get(apiUrl('lists', null), apiHeaders(token));
  return data;
};

export const registerToken = async ({os, pushToken, token, app = 'onlife'}) => {
  const {data} = await axios.post(apiUrl('register-push-token', null), {
    os,
    pushToken,
    token,
    app,
  });
  return data;
};

export const confirmPhone = async ({challenge, code}) => {
  const {data} = await axios.post(apiUrl('confirm-phone', null), {
    challenge,
    code,
  });
  return data;
};

export const getUser = async ({token}) => {
  const {data} = await axios.get(apiUrl('user', null), apiHeaders(token));
  return data;
};

export const getProfile = async ({profile_id, token}) => {
  const {data} = await axios.get(
    apiUrl(`profile${profile_id ? `/${profile_id}` : ''}`, null),
    apiHeaders(token),
  );
  return data;
};

export const uploadProfileValues = async ({profile_id, token, values}) => {
  const {data} = await axios.put(
    apiUrl(`profile/${profile_id}`, null),
    {values},
    apiHeaders(token),
  );
  return data;
};

export const getNotifications = async ({token, profile_id}) => {
  const {data} = await axios.get(
    apiUrl(`profile/${profile_id}/notifications`, null),
    apiHeaders(token),
  );
  return data;
};

export const uploadNotifications = async ({
  token,
  notifications,
  profile_id,
}) => {
  const {data} = await axios.post(
    apiUrl(`profile/${profile_id}/notifications`, null),
    {notifications},
    apiHeaders(token),
  );
  return data;
};

export const getTrainingPrograms = async ({token, profile_id}) => {
  const {data} = await axios.get(
    apiUrl(`profile/${profile_id}/programs`, null),
    apiHeaders(token),
  );
  return data;
};

export const getNutritionProgram = async ({token, profile_id}) => {
  const {data} = await axios.get(
    apiUrl(`profile/${profile_id}/nutrition`, null),
    apiHeaders(token),
  );
  return data;
};

export const getTrainingSessions = async ({token, profile_id}) => {
  console.log(`getting sessions for ${profile_id}`);
  const {data} = await axios.get(
    apiUrl(`profile/${profile_id}/sessions`, null),
    apiHeaders(token),
  );
  return data;
};

export const uploadTrainingSessions = async ({token, sessions, profile_id}) => {
  const {data} = await axios.post(
    apiUrl(`profile/${profile_id}/sessions`, null),
    {sessions},
    apiHeaders(token),
  );
  return data;
};

export const getPhotos = async ({token, profile_id}) => {
  const {data} = await axios.get(
    apiUrl(`profile/${profile_id}/photos`, null),
    apiHeaders(token),
  );
  return data;
};

export const getMeasurements = async ({token, profile_id}) => {
  const {data} = await axios.get(
    apiUrl(`profile/${profile_id}/measurements`, null),
    apiHeaders(token),
  );
  return data;
};

export const uploadMeasurements = async ({token, measurements, profile_id}) => {
  const {data} = await axios.post(
    apiUrl(`profile/${profile_id}/measurements`, null),
    {measurements},
    apiHeaders(token),
  );
  return data;
};

export const uploadPhotos = async ({token, photos, profile_id}) => {
  const {data} = await axios.post(
    apiUrl(`profile/${profile_id}/photos`, null),
    {photos},
    apiHeaders(token),
  );
  return data;
};

export const deletePhoto = async ({token, profile_id, id}) => {
  const {data} = await axios.delete(
    apiUrl(`profile/${profile_id}/photos/${id}`, null),
    apiHeaders(token),
  );
  return data;
};

export const uploadFile = async ({token, file}) => {
  try {
    const res = await RNFetchBlob.fetch(
      'POST',
      apiUrl('upload-file'),
      {
        ...apiHeaders(token).headers,
        'Content-Type': 'multipart/form-data', // 'application/octet-stream',
      },
      [
        {
          name: 'file',
          filename: 'photo.jpg',
          type: 'image/jpeg',
          data: RNFetchBlob.wrap(file),
        },
      ],
    );

    if (res.respInfo && res.respInfo.status == 200) {
      return JSON.parse(res.data);
    } else {
      throw {
        response: {
          status: res.respInfo ? res.respInfo.status : 422,
          data: JSON.parse(res.data),
        },
      };
    }
  } catch (e) {
    if (e.response) {
      throw e;
    } else {
      throw {
        response: {
          status: 422,
          data: {},
        },
      };
    }
  }
};
