import { Action } from 'redux';

import { CounterState } from './State';
import { isCounterAction, CounterActionType } from './Actions';

export function counterReducer(state: CounterState | undefined, action: Action): CounterState {
	if (state === undefined) return { counter: 0 };
	if (!isCounterAction(action)) return state;

	switch (action.type) {
		case CounterActionType.Set:
			return {
				counter: action.payload,
			};

		case CounterActionType.Increment:
			return {
				counter: state.counter + 1,
			};

		default:
			return state;
	}
}
