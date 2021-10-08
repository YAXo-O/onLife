import axios from 'axios';
import ReactNativeBlobUtil from 'react-native-blob-util';

const apiVersion = '';
const apiUrl = (point, version = apiVersion) =>
	`https://powertrain.app/api/app/${version ? `${version}/` : ''}${point}`;
const apiHeaders = token => ({
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

export async function loginPhone({ phone }) {
	const { data } = await axios.post(apiUrl('login-phone', null), { phone });
	return data;
}

export async function getLists({ token }) {
	const { data } = await axios.get(apiUrl('lists', null), apiHeaders(token));
	return data;
}

export async function registerToken({ os, pushToken, token, app = 'onlife' }) {
	const { data } = await axios.post(apiUrl('register-push-token', null), {
		os,
		pushToken,
		token,
		app,
	});
	return data;
}

export async function confirmPhone({ challenge, code }) {
	const { data } = await axios.post(apiUrl('confirm-phone', null), {
		challenge,
		code,
	});
	return data;
}

export async function getUser({ token }) {
	const { data } = await axios.get(apiUrl('user', null), apiHeaders(token));
	return data;
}

export async function getProfile({ profile_id, token }) {
	const { data } = await axios.get(
		apiUrl(`profile${profile_id ? `/${profile_id}` : ''}`, null),
		apiHeaders(token),
	);
	return data;
};

export async function uploadProfileValues ({profile_id, token, values}) {
	const { data } = await axios.put(
		apiUrl(`profile/${profile_id}`, null),
		{values},
		apiHeaders(token),
	);
	return data;
};

export async function getNotifications({token, profile_id}) {
	const { data } = await axios.get(
		apiUrl(`profile/${profile_id}/notifications`, null),
		apiHeaders(token),
	);
	return data;
};

export async function uploadNotifications({ token, notifications, profile_id }) {
	const { data } = await axios.post(
		apiUrl(`profile/${profile_id}/notifications`, null),
		{notifications},
		apiHeaders(token),
	);
	return data;
}

export async function getTrainingPrograms({ token, profile_id }) {
	const { data } = await axios.get(
		apiUrl(`profile/${profile_id}/programs`, null),
		apiHeaders(token),
	);
	return data;
}

export async function getNutritionProgram({ token, profile_id }) {
	const { data } = await axios.get(
		apiUrl(`profile/${profile_id}/nutrition`, null),
		apiHeaders(token),
	);
	return data;
}

export async function getTrainingSessions({ token, profile_id }) {
	const { data } = await axios.get(
		apiUrl(`profile/${profile_id}/sessions`, null),
		apiHeaders(token),
	);
	return data;
};

export async function uploadTrainingSessions({ token, sessions, profile_id }) {
	const { data } = await axios.post(
		apiUrl(`profile/${profile_id}/sessions`, null),
		{sessions},
		apiHeaders(token),
	);
	return data;
};

export async function getPhotos({token, profile_id}) {
	const { data } = await axios.get(
		apiUrl(`profile/${profile_id}/photos`, null),
		apiHeaders(token),
	);
	return data;
};

export async function getMeasurements({token, profile_id}) {
	const {data} = await axios.get(
		apiUrl(`profile/${profile_id}/measurements`, null),
		apiHeaders(token),
	);
	return data;
};

export async function uploadMeasurements({token, measurements, profile_id}) {
	const {data} = await axios.post(
		apiUrl(`profile/${profile_id}/measurements`, null),
		{measurements},
		apiHeaders(token),
	);
	return data;
};

export async function uploadPhotos({token, photos, profile_id}) {
	const {data} = await axios.post(
		apiUrl(`profile/${profile_id}/photos`, null),
		{photos},
		apiHeaders(token),
	);
	return data;
};

export async function deletePhoto({token, profile_id, id}) {
	const {data} = await axios.delete(
		apiUrl(`profile/${profile_id}/photos/${id}`, null),
		apiHeaders(token),
	);
	return data;
};

export async function uploadFile({token, file}) {
	try {
		const res = await ReactNativeBlobUtil.fetch(
			'POST',
			apiUrl('upload-file'),
			{
				...apiHeaders(token).headers,
				'Content-Type': 'multipart/form-data',
			},
			[
				{
					name: 'file',
					filename: 'photo.jpg',
					type: 'image/jpeg',
					data: ReactNativeBlobUtil.wrap(file),
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
}
