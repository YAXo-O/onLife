import { Nullable } from '../../objects/utility/Nullable';

export interface LocalState<T> {
	item: Nullable<T>;
}

export function initLocalState<T>(): LocalState<T> {
	return {
		item: null,
	};
}
