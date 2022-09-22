import { Nullable } from '../../objects/utility/Nullable';

export enum State {
	Ok = 0,
	Loading = 1,
	Failure = 2,
}

export interface ItemState<T> {
	item: Nullable<T>;
	state: State;
	message: Nullable<string>;
}

export function initItemState<T>(): ItemState<T> {
	return {
		item: null,
		state: State.Ok,
		message: null,
	};
}
