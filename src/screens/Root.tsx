import * as React from 'react';

import { Navigation } from '@app/navigation/Navigation';

// This is the root view - it picks either inner or outer view for the ap
export const RootScreen: React.FC = () => {
	return <Navigation />;
};

