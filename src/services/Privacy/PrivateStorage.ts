import EncryptedStorage from 'react-native-encrypted-storage';

import { PrivateKeys } from './PrivateKeys';
import { Nullable } from '../../objects/utility/Nullable';

// This storage is for sensitive data only
// It is not reactive
export abstract class PrivateStorage {
	private static _cache: Record<PrivateKeys, string | null | undefined> = {
		[PrivateKeys.Session]: undefined,
	};

	private static saveCache(key: PrivateKeys, value: Nullable<string>): Nullable<string> {
		this._cache[key] = value;

		return value;
	}

	static get(key: PrivateKeys): Promise<Nullable<string>> {
		const cached = this._cache[key];
		if (cached !== undefined) return Promise<Nullable<string>>.resolve(cached);

		return EncryptedStorage.getItem(key)
			.then((value: Nullable<string>) => {
				this._cache[key] = value;

				return value;
			});
	}

	static set(key: PrivateKeys, value: string): Promise<void> {
		return EncryptedStorage.setItem(key, value)
			.then(() => {
				this._cache[key] = value;
			});
	}

	static clear(key: PrivateKeys): Promise<void> {
		return EncryptedStorage.removeItem(key)
			.then(() => {
				this._cache[key] = null;
			});
	}
}
