import { Optional } from '@app/objects/utility/Nullable';

export function hasValue<T>(value: Optional<T>): boolean {
	return value !== null && value !== undefined;
}
