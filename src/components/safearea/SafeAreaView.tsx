import * as React from 'react';
import {
	Edge,
	SafeAreaView as CoreView,
	SafeAreaViewProps,
} from 'react-native-safe-area-context';

type OwnProps = Omit<SafeAreaViewProps, 'edges'>;

export const SafeAreaView: React.FC<OwnProps> = (props: OwnProps) => {
	// Could use headerHeight here to track if 'top' should be added
	const edges: Array<Edge> = ['left', 'right', 'bottom'];

	return (
		<CoreView {...props} edges={edges}>
			{props.children}
		</CoreView>
	);
};
