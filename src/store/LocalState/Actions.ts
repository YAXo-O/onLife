import { Action } from 'redux';

import { IState } from '../IState';

export enum LocalActionType {
	Set = 'LA_SET',
}

export interface LocalAction<Type extends LocalActionType = LocalActionType, Payload = null> {
	type: Type;
	payload: Payload;
	store: keyof IState;
}

export type SetLocalAction<T> = LocalAction<LocalActionType.Set, T>;

export type AvailableLocalAction<T> = SetLocalAction<T>;
export type LocalDispatchType<T> = (action: AvailableLocalAction<T>) => AvailableLocalAction<T>;

export function isLocalAction(action: Action): action is LocalAction {
	if (typeof action.type !== 'string') return false;

	return [
		LocalActionType.Set.toString(),
	].includes(action.type);
}
