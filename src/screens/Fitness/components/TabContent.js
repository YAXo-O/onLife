import React, {useState} from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	Dimensions,
} from 'react-native';
import {WebView} from 'react-native-webview';
import subTabBg from '../../../assets/formTab/subTabbg.png';
import VideoBg from '../../../assets/formTab/video.png';
import SubIconAbout from '../../../assets/formTab/subtab1.svg';
import SubIconweight from '../../../assets/formTab/subtab2.svg';
import SubIconlessons from '../../../assets/formTab/subtab3.svg';
import AboutTab from './subTabs/AboutTab';
import WeightTab from './subTabs/WeightTab';
import LessonTab from './subTabs/LessonTab';

const {height, width} = Dimensions.get('window');

const TabContent = ({name, exercise, trainingDay, trainingCycle, setWeightInput}) => {
	const [activeTab, setActiveTab] = useState(2);

	const onTabChange = tabNumber => {
		setActiveTab(tabNumber);
	};

	return (
		<View style={styles.mainWrapper}>
			<View style={styles.subTabs}>
				<TouchableOpacity
					style={activeTab === 1 ? styles.subTabActive : styles.subTab}
					onPress={() => onTabChange(1)}>
					<ImageBackground
						source={subTabBg}
						style={activeTab === 1 ? styles.imageBg : styles.imageBgEmpt}>
						<SubIconAbout/>
						<Text style={styles.subTabTitle}>Краткое описание</Text>
					</ImageBackground>
				</TouchableOpacity>
				<TouchableOpacity
					style={activeTab === 2 ? styles.subTabActive : styles.subTab}
					onPress={() => onTabChange(2)}>
					<ImageBackground
						source={subTabBg}
						style={activeTab === 2 ? styles.imageBg : styles.imageBgEmpt}>
						<SubIconweight/>
						<Text style={styles.subTabTitle}>Тренировка</Text>
					</ImageBackground>
				</TouchableOpacity>
				<TouchableOpacity
					style={activeTab === 3 ? styles.subTabActive : styles.subTab}
					onPress={() => onTabChange(3)}>
					<ImageBackground
						source={subTabBg}
						style={activeTab === 3 ? styles.imageBg : styles.imageBgEmpt}>
						<SubIconlessons/>
						<Text style={styles.subTabTitle}>Учебный материал</Text>
					</ImageBackground>
				</TouchableOpacity>
			</View>

			{activeTab === 1 && <AboutTab exercise={exercise}/>}
			{activeTab === 2 && (
				<WeightTab
					name={name}
					exercise={exercise}
					trainingDay={trainingDay}
					trainingCycle={trainingCycle}
					setWeightInput={setWeightInput}
				/>
			)}
			{activeTab === 3 && <LessonTab exercise={exercise}/>}
		</View>
	);
};
const styles = StyleSheet.create({
	mainWrapper: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		top: 30,
	},
	subTabs: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 13,
		paddingTop: 0,
	},

	subTab: {
		width: '30%',
		height: 95,
		borderRadius: 11,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.03)',
	},
	subTabActive: {
		width: '30%',
		height: 105,
		borderRadius: 11,
	},
	imageBg: {
		resizeMode: 'stretch',
		flexDirection: 'column',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 105,
		padding: 10,
		paddingTop: 20,
		borderRadius: 11,
	},
	imageBgEmpt: {
		resizeMode: 'stretch',
		flexDirection: 'column',
		flex: 1,
		height: 0,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		paddingTop: 20,
		borderRadius: 11,
	},
	subTabTitle: {
		marginTop: 10,
		textAlign: 'center',
		textTransform: 'uppercase',
		fontSize: 10,
		paddingBottom: 20,
	},
	aboutList: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	aboutItem: {
		width: width - 50,
		paddingTop: 20,
		paddingBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.14)',
	},
	aboutTitle: {
		color: '#0C0C0C',
		opacity: 0.6,
		fontFamily: 'FuturaPT-Book',
		fontSize: 15,
	},
	aboutDesc: {
		textAlign: 'right',
		fontSize: 15,
		width: '50%',
		color: '#0C0C0C',
		fontFamily: 'FuturaPT-Book',
	},
	aboutText: {
		width: width,
		padding: 35,
		fontFamily: 'FuturaPT-Book',
		fontSize: 15,
		color: '#0C0C0C',
		lineHeight: 20,
	},
	videoBg: {
		width: 200,
		height: 200,
		resizeMode: 'stretch',
	},
});

export default TabContent;
