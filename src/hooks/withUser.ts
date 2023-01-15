import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { User } from '@app/objects/User';
import { Nullable } from '@app/objects/utility/Nullable';
import { usePrivateStorage } from '@app/hooks/usePrivateStorage';
import { PrivateKeys } from '@app/services/Privacy/PrivateKeys';
import { IState } from '@app/store/IState';
import { UserState, State } from '@app/store/ItemState/State';
import { UserActionCreators } from '@app/store/ItemState/ActionCreators';
import { PrivateStorage } from '@app/services/Privacy/PrivateStorage';
import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';
import { UserAdaptor } from '@app/objects/adaptors/UserAdaptor';

interface UserInfo {
	id: Nullable<string>;
	user: Nullable<User>;
	session: Nullable<string>;
	loading: boolean;

	logOut: () => void;
}

export function withUser(): UserInfo {
	const session = usePrivateStorage(PrivateKeys.Session);
	const client = useSelector<IState, UserState<User>>((state: IState) => state.user);

	const dispatch = useDispatch();
	const user = React.useMemo(() => client?.item ? new UserAdaptor(client?.item) : null, [client?.item]);

	const logOut = () => {
		PrivateStorage.clear(PrivateKeys.Session)
			.then(() => {
				const user = new UserActionCreators('user');
				const training = new LocalActionCreators('training');
				const session = new LocalActionCreators('session');

				dispatch(user.clear());
				dispatch(training.clear());
				dispatch(session.clear());
			})
			.catch((error) => console.log('Failed to log out: ', error));
	};

	const [info, setInfo] = React.useState<UserInfo>(() => ({
		id: user?.id ?? null,
		user: user,
		session: session.item,
		loading: client.state === State.Loading || session.loading,
		logOut,
	}));

	React.useEffect(() => {
		if (session.loading) {
			setInfo({
				id: user?.id ?? null,
				user: user,
				session: session.item,
				loading: true,
				logOut,
			});
		} else if (!session.item) {
			setInfo({
				id: user?.id ?? null,
				user: null,
				session: null,
				loading: false,
				logOut,
			});
		} else if (client.state === State.Loading) {
			setInfo({
				id: user?.id ?? null,
				user: null,
				session: session.item,
				loading: true,
				logOut,
			});
		} else if (client.item === null) {
			const creator = new UserActionCreators('user');
			dispatch(creator.load());
		} else {
			setInfo({
				id: user?.id ?? null,
				user: user,
				session: session.item,
				loading: session.loading || client.state === State.Loading,
				logOut,
			});
		}
	}, [session.item, session.loading, user, client.state, dispatch]);

	return info;
}
