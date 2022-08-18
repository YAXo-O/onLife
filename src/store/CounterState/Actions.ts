import { Action } from 'redux';

export enum CounterActionType {
	Set = 'CA_SET',
	Increment = 'CA_INCREMENT',
}

export type CounterAction<Type extends CounterActionType, Payload = never> = {
	type: Type;
	payload: Payload;
}

export type SetCounterAction = CounterAction<CounterActionType.Set, number>;
export type IncrementCounterAction = CounterAction<CounterActionType.Increment, undefined>;

export type AvailableCounterAction = SetCounterAction | IncrementCounterAction;
export type CounterDispatchType = (action: AvailableCounterAction) => AvailableCounterAction;

export function isCounterAction(action: Action): action is AvailableCounterAction {
	if (typeof action.type !== 'string') return false;

	return [
		CounterActionType.Set.toString(),
		CounterActionType.Increment.toString(),
	].includes(action.type);
}
