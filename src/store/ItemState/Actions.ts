import { IState } from '../IState';
import { WithId } from '../../objects/utility/WithId';
import { Action } from 'redux';

export enum ItemActionType {
	Load = 'IA_LOAD',
	Set = 'IA_SET',
	Fail = 'IA_FAIL',
}

export interface ItemAction<Type extends ItemActionType = ItemActionType, Payload = null> {
	type: Type;
	payload: Payload;
	store: keyof IState; // Should be keyof IStore where typeof IStore[keyof IStore] === 'ItemState<T>'
}

export type LoadItemAction = ItemAction<ItemActionType.Load>;
export type SetItemAction<T extends WithId> = ItemAction<ItemActionType.Set, T>;
export type FailItemAction = ItemAction<ItemActionType.Fail, string>;

export type ItemDispatchType = (action: ItemAction) => ItemAction;

export function isItemAction(action: Action): action is ItemAction {
	if (typeof action.type !== 'string') return false;

	return [
		ItemActionType.Set.toString(),
		ItemActionType.Load.toString(),
		ItemActionType.Fail.toString(),
	].includes(action.type);
}
