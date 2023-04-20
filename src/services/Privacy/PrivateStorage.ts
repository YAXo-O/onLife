import EncryptedStorage from 'react-native-encrypted-storage';

import uuid from 'react-native-uuid';

import { PrivateKeys } from './PrivateKeys';
import { Nullable } from '../../objects/utility/Nullable';

type Notification = (key: string, value: Nullable<string>) => void;

// This storage is for sensitive data only
// It is not reactive
export abstract class PrivateStorage {
	private static _cache: Record<PrivateKeys, string | null | undefined> = {
		[PrivateKeys.Session]: undefined,
	};
	private static _subscribers: Record<string, Notification> = {};

	private static saveCache(key: PrivateKeys, value: Nullable<string>): Nullable<string> {
		this._cache[key] = value;
		Object.keys(this._subscribers).forEach((sub: string) => this._subscribers[sub](key, value));

		return value;
	}

	static get(key: PrivateKeys): Promise<Nullable<string>> {
		const cached = this._cache[key];
		if (cached !== undefined) return Promise.resolve(cached);

		return EncryptedStorage.getItem(key)
			.then((value: Nullable<string>) => {
				this._cache[key] = value ?? null;

				return value ?? null;
			});
	}

	static set(key: PrivateKeys, value: string): Promise<void> {
		return EncryptedStorage.setItem(key, value)
			.then(() => {
				this.saveCache(key, value);
			});
	}

	static clear(key: PrivateKeys): Promise<void> {
		return EncryptedStorage.removeItem(key)
			.then(() => {
				this.saveCache(key, null);
			});
	}

	static subscribe(handler: Notification): string {
		const id: string = uuid.v4().toString();
		this._subscribers[id] = handler;

		return id;
	}

	static unsubscribe(id: string): void {
		delete this._subscribers[id];
	}
}
