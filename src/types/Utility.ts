export type ByValue<T extends object, TValue> = {
	[Key in keyof T as T[Key] extends TValue ? Key : never]: T[Key];
}

export type KeysByValue<T extends object, TValue> = keyof ByValue<T, TValue>;
