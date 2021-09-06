import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getLists } from '@app/redux/action-creators';

export default function(path, type = 'list') {
	const dispatch = useDispatch();

	const data = useSelector(state => {
		const lists = state.lists;
		return lists[path];
	});

	useEffect(() => {
		if (data === null || typeof data === 'undefined') {
			dispatch(getLists());
		}
	}, [data, dispatch]);

	if (type === 'map') {
		const map = {};
		for (const item of data || []) {
			map[item.id || item.code] = item;
		}
		return map;
	} else {
		return data;
	}
}
