import { Action } from 'redux';

import { IState, initialState } from '../IState';
import { isItemAction, AvailableItemAction, ItemActionType } from './Actions';

export function itemReducer(state: IState = initialState, action: Action): IState {
	if (!isItemAction(action)) return state;

	const itemAction: AvailableItemAction<unknown> = action as AvailableItemAction<unknown>;
	switch (itemAction.type) {
		case ItemActionType.Load:
			return {
				...state,
				[action.store]: {
					...state[action.store],
					loading: true,
					error: null,
				}
			};

		case ItemActionType.Set: {
			return {
				...state,
				[action.store]: {
					item: action.payload,
					loading: false,
					error: null,
				}
			};
		}

		case ItemActionType.Fail: {
			return {
				...state,
				[action.store]: {
					...state[action.store],
					loading: false,
					error: null,
				}
			};
		}
	}
}
