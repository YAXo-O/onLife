import * as React from 'react';

type Callback = () => void;

export function useUpdate(action: Callback, deps: Array<unknown>) {
	const ref = React.useRef<boolean>(false);

	React.useEffect(() => {
		if (ref.current) {
			action();
		}

		ref.current = true;

		return () => {
			ref.current = false;
		};
	}, deps);
}
