import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { User } from '../objects/User';
import { Nullable } from '../objects/utility/Nullable';
import { usePrivateStorage } from './usePrivateStorage';
import { PrivateKeys } from '../services/Privacy/PrivateKeys';
import { IState } from '../store/IState';
import { ItemState, State } from '../store/ItemState/State';
import { ItemActionCreators, ItemEndpointList } from '../store/ItemState/ActionCreators';
import { bindActionCreators } from 'redux';
import { PrivateStorage } from '../services/Privacy/PrivateStorage';

interface UserInfo {
	user: Nullable<User>;
	session: Nullable<string>;
	loading: boolean;

	logOut: () => void;
}

const endpoints: ItemEndpointList = {
	load: '/app/login',
	save: '',
	update: '',
};

export function withUser(): UserInfo {
	const session = usePrivateStorage(PrivateKeys.Session);
	const user = useSelector<IState, ItemState<User>>((state: IState) => state.user);
	const dispatch = useDispatch();

	const logOut = () => {
		PrivateStorage.clear(PrivateKeys.Session)
			.then(() => {
				const creator = new ItemActionCreators<User>('user', endpoints);
				const bound = bindActionCreators(creator, dispatch);
				bound.clear();
			});
	};
	const [info, setInfo] = React.useState<UserInfo>(() => ({
		user: user.item,
		session: session.item,
		loading: user.state === State.Loading || session.loading,
		logOut,
	}));

	React.useEffect(() => {
		if (session.loading) {
			setInfo({
				user: user.item,
				session: session.item,
				loading: true,
				logOut,
			});
		} else if (!session.item) {
			setInfo({
				user: null,
				session: null,
				loading: false,
				logOut,
			});
		} else if (user.state === State.Loading) {
			setInfo({
				user: null,
				session: session.item,
				loading: true,
				logOut,
			});
		} else if (user.item === null) {
			const creator = new ItemActionCreators<User>('user', endpoints);
			const bound = bindActionCreators(creator, dispatch);
			bound.load();
		} else {
			setInfo({
				user: user.item,
				session: session.item,
				loading: session.loading || user.state === State.Loading,
				logOut,
			});
		}
	}, [session.item, session.loading, user.item, user.state, dispatch]);

	return info;
}
