import { palette } from '@app/styles/palette';

const headerNoBack = {
	headerLeft: null,
	gestureEnabled: false,
	headerBackVisible: false,
};

function getHeaderBase(background: string): Record<string, unknown> {
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
		headerTintColor: 'white',
		headerShadowVisible: false,
		headerTitleAlign: 'left',
	};
}

export function getOptions(title: string, withGoBack: boolean = true, background: string = palette.cyan['40']): Record<string, unknown> {
	return {
		...getHeaderBase(background),
		...(withGoBack ? undefined : headerNoBack),
		title,
	};
}
