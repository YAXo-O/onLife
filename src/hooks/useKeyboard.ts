import * as React from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';
import { Nullable } from '../objects/utility/Nullable';

interface Keyboard {
	width: number;
	height: number;
	duration: number;
}

export function useKeyboard(): Nullable<Keyboard> {
	// In general - you should never do that (as hooks might change their order)
	// But in this case - it is not possible to have OS changed in runtime
	if (Platform.OS !== 'ios') return null;

	const [height, setHeight] = React.useState<number>(() => 0);
	const [width, setWidth] = React.useState<number>(() => 0);
	const [duration, setDuration] = React.useState<number>(() => 0);

	const onShow = (event: KeyboardEvent) => {
		setHeight(event.endCoordinates.height);
		setWidth(event.endCoordinates.width);
		setDuration(event.duration);
	};
	const onHide = () => setHeight(0);

	React.useEffect(() => {
		const show = Keyboard.addListener('keyboardWillShow', onShow);
		const hide = Keyboard.addListener('keyboardWillHide', onHide);

		return () => {
			show.remove();
			hide.remove();
		};
	}, []);

	return {
		width,
		height,
		duration,
	};
}
