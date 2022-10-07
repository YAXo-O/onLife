import * as React from 'react';
import { Animated, Easing } from 'react-native';

import { useKeyboard } from '../../hooks/useKeyboard';

/**
 * Keyboard spacer is used as a dummy view that changes its height to fit
 * Virtual keyboard height
 * You can use this view to compensate for keyboard height
 * (In case using KeyboardAvoidingView is impossible)
 */
export const KeyboardSpacer: React.FC = () => {
	const keyboard = useKeyboard();
	if (keyboard === null) return null;

	const value = React.useRef(new Animated.Value(0)).current;
	React.useEffect(() => {
		if (keyboard.height > 0) {
			Animated.timing(value, {
				toValue: keyboard.height,
				duration: keyboard.duration,
				easing: Easing.inOut(Easing.ease),
				useNativeDriver: false,
			}).start()
		} else {
			Animated.timing(value, {
				toValue: 0,
				duration: keyboard.duration,
				easing: Easing.inOut(Easing.ease),
				useNativeDriver: false,
			}).start()
		}
	}, [keyboard.height]);

	return <Animated.View style={{ height: value, }} />;
};
