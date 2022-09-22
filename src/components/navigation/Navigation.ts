import { ReactNode } from 'react';

interface ScreenOptions {
	headerTitleAlign?: 'center';
	gestureEnabled?: boolean;
	headerTransparent?: boolean;
	headerStyle?: {
		backgroundColor?: string;
	},
	headerTintColor?: string;
	headerLeft?: () => ReactNode;
}

export const options: ScreenOptions = {
	headerTitleAlign: 'center',
	gestureEnabled: false,
	headerTransparent: false,
	headerStyle: {
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
	},
	headerTintColor: 'rgba(255, 255, 255, 0.6)',
	headerLeft: () => null,
};
