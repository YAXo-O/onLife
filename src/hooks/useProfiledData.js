import { useSelector } from 'react-redux';

export default function(path) {
	const pathItems = typeof path === 'string' ? path.split('.') : path;

	return useSelector(state => {
		const profile = state.profile.profile;

		if (!profile) return null;

		const item = pathItems.reduce((acc, key) => (acc && acc[key] ? acc[key] : null), state,);
		if (item && typeof item[profile.id] !== 'undefined') return item[profile.id];

		return undefined;
	});
}
