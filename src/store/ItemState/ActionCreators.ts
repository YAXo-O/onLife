import { RequestManager } from '@app/services/Requests/RequestService';
import { IState } from '@app/store/IState';
import { ItemDispatchType, ItemActionType, SetItemAction, LoadItemAction, FailItemAction } from '@app/store/ItemState/Actions';
import { Nullable } from '@app/objects/utility/Nullable';
import {  User, Client } from '@app/objects/User';
import { UserAdaptor } from '@app/objects/adaptors/UserAdaptor';

type GetState = () => IState;
type ItemThunk<T, TResult = void> = (dispatch: ItemDispatchType<T>, getState: GetState) => TResult;

export interface ItemEndpointList {
	load: string;
	save: string;
	update: string;
}

export function setAction<T>(item: Nullable<T>, store: keyof IState): SetItemAction<T> {
	return {
		type: ItemActionType.Set,
		store,
		payload: item,
	};
}

function loadAction(store: keyof IState): LoadItemAction {
	return {
		type: ItemActionType.Load,
		store,
		payload: null,
	};
}

function failAction(message: string, store: keyof IState): FailItemAction {
	return {
		type: ItemActionType.Fail,
		store,
		payload: message,
	};
}


export class UserActionCreators {
	private readonly store: keyof IState;
	private readonly endpoints: ItemEndpointList = {
		load: 'user',
		save: '',
		update: '',
	};

	constructor(store: keyof IState) {
		this.store = store;
	}

	public load(): ItemThunk<User> {
		return (dispatch: ItemDispatchType<User>) => {
			dispatch(loadAction(this.store));

			new RequestManager(this.endpoints.load)
				.get<Client>()
				.then((item: Client) => dispatch(setAction<User>(new UserAdaptor(item), this.store)))
				.catch((error: string) => dispatch(failAction(error, this.store)));
		};
	}

	public clear(): ItemThunk<Client> {
		return (dispatch: ItemDispatchType<Client>) => {
			dispatch({ type: ItemActionType.Set, store: this.store, payload: null });
		};
	}
}
