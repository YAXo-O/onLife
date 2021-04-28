import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Image,
} from 'react-native';
import { WebView } from 'react-native-webview'


const { height, width } = Dimensions.get('window');

const  AboutTab = (props) => {
    const [activeTab, setActiveTab] = useState(1)

    const  onTabChange = (tabNumber) => {
        setActiveTab(tabNumber)
    }

    return (
        <View style={{flex: 0.27}}>
            <View style={styles.aboutList}>
                <View style={styles.aboutItem}>
                    <Text style={styles.aboutTitle}>Упражнение</Text>
                    <Text style={styles.aboutDesc}>Жим гантелей лёжа на наклонной скамье 45 градусов</Text>
                </View>
                <View style={styles.aboutItem}>
                    <Text style={styles.aboutTitle}>Целевая мышца</Text>
                    <Text style={styles.aboutDesc}>Грудная</Text>
                </View>
                <View style={styles.aboutItem}>
                    <Text style={styles.aboutTitle}>Количество подходов</Text>
                    <Text style={styles.aboutDesc}>4</Text>
                </View>
                <View style={styles.aboutItem}>
                    <Text style={styles.aboutTitle}>Количество повторений</Text>
                    <Text style={styles.aboutDesc}>12</Text>
                </View>
            </View>

            <Text style={styles.aboutText}>
                Суперсет – это сочетание двух упражнений, рассчитанных на работу одной и той же мышцы либо мышц антагонистов.
                Наиболее распространенный способ применения суперсетов – это тренировка как раз разных по функциям мышечных групп.
            </Text>

            <View style={{width: width - 40,  borderRadius: 20, overflow: 'hidden',height: 200,backgroundColor: 'red',marginLeft: 20, marginRight: 20}}>
                <WebView
                    style={ {marginTop: (Platform.OS == 'ios') ? 20 : 0,} }
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{uri: 'https://www.youtube.com/embed/CRqFdjZOCBI'}}
                />
                {/*<Image style={styles.videoBg} resizeMode={'contain'} source={videoBg} />*/}
            </View>

        </View>
    );
};
const styles = StyleSheet.create({
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
        width: width ,
        padding: 35,
        fontFamily: 'FuturaPT-Book',
        fontSize: 15,
        color: '#0C0C0C',
        lineHeight: 20,
    },

});

export default AboutTab;

