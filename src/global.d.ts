declare module '*.png' {
	const value: import('react-native').ImageSourcePropType;
	export default value;
}

declare module '*.svg' {
	import { SvgProps } from 'react-native-svg';
	interface OwnProps {
		fillPrimary?: string;
	}

	const content: React.FC<SvgProps & OwnProps>;
	export default content;
}
