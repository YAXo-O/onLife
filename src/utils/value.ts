import { Optional } from '@app/objects/utility/Nullable';

export function hasValue<T>(value: Optional<T>): value is T {
	return value !== null && value !== undefined;
}
