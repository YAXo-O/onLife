import { WithId } from '../../objects/utility/WithId';
import { Nullable } from '../../objects/utility/Nullable';

enum State {
	Ok = 0,
	Loading = 1,
	Failure = 2,
}

export interface ItemState<T extends WithId> {
	item: Nullable<T>;
	state: State;
	message: Nullable<string>;
}

export function initState<T extends WithId>(): ItemState<T> {
	return {
		item: null,
		state: State.Ok,
		message: null,
	};
}
