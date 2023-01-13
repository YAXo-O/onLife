import * as React from 'react';

import { Nullable } from '../objects/utility/Nullable';
import { PrivateKeys } from '../services/Privacy/PrivateKeys';
import { PrivateStorage } from '../services/Privacy/PrivateStorage';

interface StorageState {
	loading: boolean;
	error: Nullable<string>;
	item: Nullable<string>;
}

export function usePrivateStorage(key: PrivateKeys): StorageState {
	const [loading, setLoading] = React.useState<boolean>(() => false);
	const [item, setItem] = React.useState<Nullable<string>>(() => null);
	const [error, setError] = React.useState<Nullable<string>>(() => null);

	React.useEffect(() => {
		setLoading(true);
		PrivateStorage.get(key)
			.then((item: Nullable<string>) => setItem(item))
			.catch((error: string) => setError(error))
			.finally(() => setLoading(false));

		const id = PrivateStorage.subscribe((key: string, value: Nullable<string>) => {
			if (key === PrivateKeys.Session) {
				setItem(value);
			}
		});

		return () => PrivateStorage.unsubscribe(id);
	}, [key]);

	React.useEffect(() => console.log('Item has changed: ', item), [item]);

	return {
		item,
		loading,
		error,
	};
}
