import * as React from 'react';
import { Image, ImageProps, ImageURISource } from 'react-native';

export const ImageFit: React.FC<ImageProps> = (props: ImageProps) => {
	const [ratio, setRatio] = React.useState<number>(() => 1);

	React.useEffect(() => {
		const uri = (props.source as ImageURISource)?.uri;
		if (typeof uri !== 'string') return;

		Image.getSize(uri, (width: number, height: number) => setRatio(width / height));
	}, [props.source]);

	return (
		<Image {...props} style={[props.style, { aspectRatio: ratio, }]} />
	);
};
