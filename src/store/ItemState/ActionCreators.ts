import { IState } from '../IState';
import { ItemDispatchType, ItemActionType } from './Actions';

type GetState = () => IState;
type ItemThunk<T = void> = (dispatch: ItemDispatchType, getState: GetState) => T;

export interface ItemEndpointList {
	load: string;
}

export class ItemActionCreators {
	private readonly store: keyof IState;
	private readonly endpoints: ItemEndpointList;

	constructor(store: keyof IState, endpoints: ItemEndpointList) {
		this.store = store;
		this.endpoints = endpoints;
	}

	public load(): ItemThunk {
		return (dispatch: ItemDispatchType) => {
			dispatch({ type: ItemActionType.Load, store: this.store, payload: null });

			// Make load request here
		};
	}

	public clear(): ItemThunk {
		return (dispatch: ItemDispatchType) => {
			dispatch({ type: ItemActionType.Set, store: this.store, payload: null });
		};
	}
}
