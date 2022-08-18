import * as React from 'react';
import { Text } from 'react-native';

import { format } from '../../utils/datetime';

interface OwnProps {
	value: number;
}

export const DateView: React.FC<OwnProps> = (props: OwnProps) => {
	return <Text>{format(props.value)}</Text>;
}
