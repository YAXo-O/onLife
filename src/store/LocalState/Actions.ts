import { Action } from 'redux';

import { IState } from '@app/store/IState';

export enum LocalActionType {
	Set = 'LA_SET',
	Clear = 'LA_CLEAR',
}

type EntityType<TKey extends keyof IState> = IState[TKey]['item'];

export interface LocalAction<Type extends LocalActionType = LocalActionType, Payload = null> {
	type: Type;
	payload: Payload;
	store: keyof IState;
}

export type SetLocalAction<T> = LocalAction<LocalActionType.Set, T>;
export type ClearLocalAction = Omit<LocalAction<LocalActionType.Clear, never>, 'payload'>;

export type AvailableLocalAction<T> = SetLocalAction<T> | ClearLocalAction;
export type LocalDispatchType<TKey extends keyof IState> = (action: AvailableLocalAction<EntityType<TKey>>) => AvailableLocalAction<EntityType<TKey>>;

export function isLocalAction(action: Action): action is LocalAction {
	if (typeof action.type !== 'string') return false;

	return [
		LocalActionType.Set.toString(),
		LocalActionType.Clear.toString(),
	].includes(action.type);
}
