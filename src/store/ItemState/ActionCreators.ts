import { RequestManager } from '../../services/Requests/RequestService';
import { IState } from '../IState';
import { ItemDispatchType, ItemActionType, SetItemAction, LoadItemAction, FailItemAction } from './Actions';
import { Nullable } from '../../objects/utility/Nullable';

type GetState = () => IState;
type ItemThunk<T, TResult = void> = (dispatch: ItemDispatchType<T>, getState: GetState) => TResult;

export interface ItemEndpointList {
	load: string;
	save: string;
	update: string;
}

function setAction<T>(item: Nullable<T>, store: keyof IState): SetItemAction<T> {
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

export class ItemActionCreators<T> {
	private readonly store: keyof IState;
	private readonly endpoints: ItemEndpointList;

	constructor(store: keyof IState, endpoints: ItemEndpointList) {
		this.store = store;
		this.endpoints = endpoints;
	}

	public load(): ItemThunk<T> {
		return (dispatch: ItemDispatchType<T>) => {
			dispatch(loadAction(this.store));

			new RequestManager(this.endpoints.load)
				.get<T>()
				.then((item: T) => dispatch(setAction<T>(item, this.store)))
				.catch((error: string) => dispatch(failAction(error, this.store)));
		};
	}

	public save(item: T): ItemThunk<T> {
		return (dispatch: ItemDispatchType<T>) => {
			dispatch(loadAction(this.store));

			new RequestManager(this.endpoints.save)
				.withBody<T>(item)
				.post<T>()
				.then((item: T) => dispatch(setAction<T>(item, this.store)))
				.catch((error: string) => dispatch(failAction(error, this.store)));
		};
	}

	public update(item: Partial<T>): ItemThunk<T> {
		return (dispatch: ItemDispatchType<T>) => {
			dispatch(loadAction(this.store));

			new RequestManager(this.endpoints.update)
				.withBody<T>(item)
				.patch<T>()
				.then((item: T) => dispatch(setAction<T>(item, this.store)))
				.catch((error: string) => dispatch(failAction(error, this.store)));
		};
	}

	public clear(): ItemThunk<T> {
		return (dispatch: ItemDispatchType<T>) => {
			dispatch({ type: ItemActionType.Set, store: this.store, payload: null });
		};
	}
}
