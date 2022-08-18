import { Action } from 'redux';

import { Nullable } from '../../objects/utility/Nullable';
import { IState } from '../IState';

export enum ItemActionType {
	Load = 'IA_LOAD',
	Set = 'IA_SET',
	Fail = 'IA_FAIL',
}

export interface ItemAction<Type extends ItemActionType = ItemActionType, Payload = null> {
	type: Type;
	payload: Payload;
	store: keyof IState;
}

export type LoadItemAction = ItemAction<ItemActionType.Load>;
export type SetItemAction<T> = ItemAction<ItemActionType.Set, Nullable<T>>;
export type FailItemAction = ItemAction<ItemActionType.Fail, string>;

export type AvailableItemAction<T> = LoadItemAction | SetItemAction<T> | FailItemAction;
export type ItemDispatchType<T> = (action: AvailableItemAction<T>) => AvailableItemAction<T>;

export function isItemAction(action: Action): action is ItemAction {
	if (typeof action.type !== 'string') return false;

	return [
		ItemActionType.Set.toString(),
		ItemActionType.Load.toString(),
		ItemActionType.Fail.toString(),
	].includes(action.type);
}
