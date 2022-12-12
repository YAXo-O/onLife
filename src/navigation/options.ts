import { palette } from '@app/styles/palette';

const headerNoBack = {
	headerLeft: null,
	gestureEnabled: false,
	headerBackVisible: false,
};

function getHeaderBase(background: string, color: string): Record<string, unknown> {
	return {
		headerStyle: {
			backgroundColor: background,
			elevation: 0,
			borderBottomWidth: 0,
			shadowOpacity: 0,
		},
		headerTitleStyle: {
			fontFamily: 'Inter',
			fontSize: 18,
			lineHeight: 24,
		},
		headerTintColor: color,
		headerShadowVisible: false,
		headerTitleAlign: 'left',
		headerBackTitle: '',
	};
}

export function getOptions(title: string, withGoBack: boolean = true, background: string = palette.cyan['40'], color: string = 'white'): Record<string, unknown> {
	return {
		...getHeaderBase(background, color),
		...(withGoBack ? undefined : headerNoBack),
		title,
	};
}
