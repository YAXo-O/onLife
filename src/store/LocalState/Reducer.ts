import { Action } from 'redux';

import { IState, initialState } from '../IState';
import { isLocalAction, AvailableLocalAction, LocalActionType } from './Actions';

type Reducer<T extends keyof IState> = (state: IState[T] | undefined, action: Action) => IState[T];

export function localReducer<T extends keyof IState>(state: IState[T] | undefined, action: Action, store: T): IState[T] {
	if (state === undefined) return initialState[store];
	if (!isLocalAction(action) || action.store !== store) return state;

	const localAction: AvailableLocalAction<unknown> = action as AvailableLocalAction<unknown>;
	switch (localAction.type) {
		case LocalActionType.Set: {
			let payload = action.payload
			if (typeof payload === 'object' && typeof (state as { item: unknown }).item === 'object') {
				payload = {
					...state.item,
					...payload,
				};
			}

			return {
				...state,
				item: payload,
			};
		}

		case LocalActionType.Clear: {
			return {
				...state,
				item: null,
			};
		}

		default:
			return state;
	}
}

export function getLocalReducer<TStore extends keyof IState>(store: TStore): Reducer<TStore> {
	return (state: IState[TStore] | undefined, action: Action) => localReducer(state, action, store);
}
