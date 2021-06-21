import { useSelector } from 'react-redux';

export default function (path) {
  const pathItems = typeof path === 'string' ? path.split('.') : path;
  return useSelector((state) => {
    const profile = state.profile.profile;
    if (!profile) return null;
    const item = pathItems.reduce((acc, item) => acc && acc[item] ? acc[item] : null, state);
    return item && typeof item[profile.id] !== 'undefined' ? item[profile.id] : undefined;
  })
}
