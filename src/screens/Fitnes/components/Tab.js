import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Platform,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';

import tabBg from '../../../assets/formTab/tab_bg.png'
import tabBgClose from '../../../assets/formTab/tabBgClose.png'
import OpenArr from '../../../assets/formTab/Expand.svg'
import CloseArr from '../../../assets/formTab/ExpandClose.svg'
import TabContent from './TabContent';

const { height, width } = Dimensions.get('window');

const Tab = (props) => {
    const [openTab, setOpenTab] = useState(false)
    return (
           <View style={{flex: 1,}}>
               <TouchableOpacity
                   style={{height: openTab  ? 80 : 105 ,}}
                   activeOpacity={.8} onPress={() => openTab ? setOpenTab(false) : setOpenTab(true)}>
               <ImageBackground source={openTab ? tabBg : tabBgClose} style={styles.image}>
                   <View style={styles.tabWrapper}>
                       <View style={styles.leftTitle}>
                           <View style={styles.header} >
                               <View style={styles.tabNumber} ><Text>1</Text></View>
                               <Text style={styles.tabText}>{props.name}</Text>
                           </View>
                           {openTab ?  null : <Text style={styles.desc}>{props.desc}</Text> }
                       </View>
                       {openTab ?  <OpenArr /> :  <CloseArr />}
                   </View>
               </ImageBackground>
               </TouchableOpacity>
               {openTab && <TabContent name={props.name} />}
           </View>
    );
};
const styles = StyleSheet.create({
    image: {
        marginBottom: 0,
        resizeMode: "contain",
        alignItems: 'center',
        width: width,
    },
    tabWrapper: {
        paddingLeft: 20,
        paddingRight: 20,
        height: 112,
        flexDirection: 'row',
        width: width,
        justifyContent: "space-between",
        alignItems: 'center',
    },
    leftTitle: {
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',

    },
    tabNumber: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 100,
        fontSize: 8,
        color: '#0B2266'
    },
    tabText: {
        fontFamily: 'FuturaPT-Medium',
        fontWeight: '500',
        marginLeft: 10,
        fontSize: 20,
        color: '#fff',
    },
    desc: {
        paddingTop: 7,
        fontFamily: 'FuturaPT-Medium',
        fontWeight: '400',
        color: '#fff',
        fontSize: 14,
    },
});

export default Tab;

