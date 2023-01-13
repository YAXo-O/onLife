import { Action } from 'redux';

import { IState, initialState } from '../IState';
import { isItemAction, AvailableItemAction, ItemActionType } from './Actions';

type Reducer<T extends keyof IState> = (state: IState[T] | undefined, action: Action) => IState[T];

export function itemReducer<T extends keyof IState>(state: IState[T] | undefined, action: Action, store: T): IState[T] {
	if (state === undefined) return initialState[store];
	if (!isItemAction(action) || action.store !== store) return state;

	const itemAction: AvailableItemAction<unknown> = action as AvailableItemAction<unknown>;
	switch (itemAction.type) {
		case ItemActionType.Load:
			return {
				...state,
				loading: true,
				error: null,
			};

		case ItemActionType.Set: {
			return {
				...state,
				item: action.payload,
				loading: false,
				error: null,
			};
		}

		case ItemActionType.Fail: {
			return {
				...state,
				loading: false,
				error: null,
			};
		}

		default:
			return state;
	}
}

export function getItemReducer<TStore extends keyof IState>(store: TStore): Reducer<TStore> {
	return (state: IState[TStore] | undefined, action: Action) => itemReducer(state, action, store);
}
