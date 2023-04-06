import { Action } from 'redux';

import { IState, initialState } from '@app/store/IState';
import { isLocalAction, AvailableLocalAction, LocalActionType } from '@app/store/LocalState/Actions';

type Reducer<T extends keyof IState> = (state: IState[T] | undefined, action: Action) => IState[T];

function merge<T>(source: T, update: T): T {
	if (typeof source === 'object' && typeof update === 'object') return { ...source, ...update };

	return update;
}

export function localReducer<T extends keyof IState>(state: IState[T] | undefined, action: Action, store: T): IState[T] {
	if (state === undefined) return initialState[store];
	if (!isLocalAction(action) || action.store !== store) return state;

	const localAction: AvailableLocalAction<unknown> = action as AvailableLocalAction<unknown>;
	switch (localAction.type) {
		case LocalActionType.Set: {
			return {
				...state,
				item: merge(state.item, action.payload),
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
