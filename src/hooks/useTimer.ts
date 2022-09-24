import * as React from 'react';

type Callback = () => void;

export function useTimer(ms: number, callback: Callback): void {
	const _callback = React.useRef<Callback>(callback);
	React.useEffect(() => {
		_callback.current = callback;
	}, [callback]);

	React.useEffect(() => {
		const id = setInterval(() => _callback.current?.(), ms);

		return () => clearTimeout(id);
	}, [ms]);
}
