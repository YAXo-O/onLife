import React from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
} from 'react-native';

import tabBg from '../../../assets/formTab/tab_bg.png';
import tabBgClose from '../../../assets/formTab/tabBgClose.png';
import OpenArr from '../../../assets/formTab/Expand.svg';
import CloseArr from '../../../assets/formTab/ExpandClose.svg';
import TabContent from './TabContent';

import { isArray } from '@app/utils/array';

/** Max number of lines in total per description */
const maxLines = 1;

const TabDescription = ({ text, visible }) => {
	if (!visible) return null;
	if (!text) return null;

	const lines = isArray(text) ? text : [text];

	return (
		<>
			{lines.map((line, index) => (
				<Text
					key={index}
					style={index === 0 ? [styles.desc, styles.descFirst] : styles.desc}
					numberOfLines={maxLines}
				>
					{line}
				</Text>
			))}
		</>
	);
};

const Tab = ({
	name, count, exercise, trainingDay,
	trainingCycle, desc, setWeightInput,
}) => {
	const [openTab, setOpenTab] = React.useState(false);

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={{ height: openTab ? 80 : 105 }}
				activeOpacity={0.8}
				onPress={() => setOpenTab(!openTab)}
			>
				<ImageBackground
					source={openTab ? tabBg : tabBgClose}
					style={styles.image}
				>
					<View style={styles.tabWrapper}>
						<View style={styles.leftTitle}>
							<View style={styles.header}>
								<View style={styles.tabNumber}>
									<Text>{count}</Text>
								</View>
								<Text style={styles.tabText} numberOfLines={3}>
									{name}
								</Text>
							</View>
							<TabDescription text={desc} visible={!openTab} />
						</View>
						{openTab ? <OpenArr/> : <CloseArr/>}
					</View>
				</ImageBackground>
			</TouchableOpacity>

			{openTab && (
				<TabContent
					name={name}
					trainingDay={trainingDay}
					trainingCycle={trainingCycle}
					exercise={exercise}
					setWeightInput={setWeightInput}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		paddingLeft: 8,
		paddingRight: 8,
	},
	image: {
		marginBottom: 0,
		resizeMode: 'contain',
		alignItems: 'center',
	},

	tabWrapper: {
		paddingLeft: 20,
		paddingRight: 20,
		height: 112,

		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	leftTitle: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexGrow: 1,
		flexShrink: 1,
		paddingRight: 10,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	tabNumber: {
		width: 20,
		height: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		borderRadius: 100,
		fontSize: 8,
		color: '#0B2266',
	},

	tabText: {
		fontFamily: 'FuturaPT-Medium',
		fontWeight: '500',
		marginLeft: 10,
		fontSize: 20,
		color: '#fff',
		flexGrow: 1,
		flexShrink: 1,
	},
	desc: {
		fontFamily: 'FuturaPT-Medium',
		fontWeight: '400',
		color: '#fff',
		fontSize: 14,
	},
	descFirst: {
		paddingTop: 7,
	}
});

export default Tab;
