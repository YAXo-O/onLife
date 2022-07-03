import React from 'react';
import {
	SafeAreaView,
	ScrollView,
	Text,
	StatusBar,
} from 'react-native';

const App = () => {
	return (
		<SafeAreaView>
			<StatusBar />
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
			>
				<Text>Hello, World!</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

export default App;
