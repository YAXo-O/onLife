import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Image, TextInput,
} from 'react-native';
import { WebView } from 'react-native-webview'
import PlayIcon from '../../../../assets/formTab/open.svg'
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const  WeightCard  = (props) => {
    const navigation = useNavigation()
    const onChangeInput = () => {};
    const firsSum = props.firstTrain.reduce(function(a, b) { return a + b; }, 0)
    const secondSum = props.secondTrain.reduce(function(a, b) { return a + b; }, 0)

    console.log()
    return (
        <View style={styles.swipeWrapper}>
        <TouchableOpacity
            onPress={() => navigation.navigate('EditStats', {name: props.name,firstTrain: props.firstTrain,secondTrain: props.secondTrain, onChangeSecondNumber: props.onChangeSecondNumber, onChangeNumber: props.onChangeNumber })}
            style={props.statOpen ? styles.statsWrapper :  styles.statsWrapperClose}>
            <View style={styles.cardItemFirst}>
                <View style={styles.cardHeader}>
                    <PlayIcon style={styles.playIcon} />
                    <Text style={{width: '60%',color: '#0C0C0C', fontSize: 13,textAlign: 'left'}}>Жим гантелей лёжа на наклонной скамье 45 градусов</Text>
                    <Text style={{width: '30%',color: '#0C0C0C', fontSize: 13,textAlign: 'right'}}>12-15  повторений</Text>
                </View>
                <View style={styles.statsData}>

                    {props.firstTrain.map(item => {
                        return <View style={styles.statItem}>
                            <Text style={styles.subTitle}>{item !== 0 ? item : '_'}</Text>
                            <Text style={styles.sufix}>{item !== 0 ? 'кг' : ''}</Text>
                        </View>
                    })}
                    <View style={styles.lastItem}>
                        {firsSum == 0  ?    <Text style={styles.lastTitle}>Выполненный вес</Text>
                            :  <Text style={styles.lastTitleSum}>{ firsSum + ' кг' }  </Text> }
                    </View>
                </View>
            </View>
            <View style={styles.cardItemSecond}>
                <View style={styles.cardHeader}>
                    <Text style={{width: '60%',color: '#0C0C0C', fontSize: 13,textAlign: 'left'}}>Разведение гателей на горизонтальной скамье</Text>
                    <Text style={{width: '30%',color: '#0C0C0C', fontSize: 13,textAlign: 'right'}}>12-15  повторений</Text>
                </View>
                <View style={styles.statsData2}>

                    {props.secondTrain.map(item => {
                        return <View style={styles.statItem}>
                            <Text style={styles.subTitle}>{item !== 0 ? item : '_'}</Text>
                            <Text style={styles.sufix}>{item !== 0 ? 'кг' : ''}</Text>
                        </View>
                    })}
                    <View style={styles.lastItem}>
                        {secondSum == 0  ?    <Text style={styles.lastTitle}>Выполненный вес</Text>
                            :  <Text style={styles.lastTitleSum}>{ secondSum + ' кг' }  </Text> }
                    </View>
                </View>
            </View>
            <Text style={styles.helpText}>Cтатистика-свайп влево</Text>
        </TouchableOpacity>
            <View style={ props.statOpen ?  styles.circleNumber : styles.circleNumberClose }>
                <Text style={styles.circleText}>1-й круг</Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    swipeWrapper: {
        flexDirection: 'row',
        width: '100%',
        zIndex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    statsWrapper: {
        width: '90%',
        paddingRight: 10,
        paddingBottom: 100,
    },
    statsWrapperClose: {
        width: '100%',
        paddingBottom: 100,

    },
    playIcon: {
        position: 'absolute',
        top: 5,
        left: -35,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: 20,
    },
    cardItemFirst: {
        height: 130,
        marginLeft: 14,
        marginRight: 14,
        paddingLeft: 45,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.14)',
    },
    cardItemSecond: {
        height: 100,
        marginLeft: 14,
        marginRight: 14,
        paddingLeft: 45,
        paddingRight: 10,
    },
    statsData: {
        width: '100%',
        paddingBottom: 30,
        top: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsData2: {
        width: '100%',
        paddingBottom: 30,
        top: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '10%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    },
    statInput: {
        borderWidth: 1,
        borderColor: '#DBDBDB',
        borderRadius: 8,
        fontFamily: 'FuturaPT-Bold',
        color: '#000',
        fontSize: 16,
        lineHeight: 21,
        height: 38,
        textAlign: 'center',
    },
    subTitle: {
        textAlign: 'center',
        fontFamily: 'FuturaPT-Medium',
        fontWeight: '500',
        color: '#0000FE',
        fontSize: 15,
    },
    lastTitleSum: {
        fontSize: 20,
        color: '#0000FE',
        fontFamily: 'FuturaPT-Medium',
        fontWeight: '500',
        textAlign: 'center',
    },
    sufix: {
        textAlign: 'center',
        fontFamily: 'FuturaPT-Medium',
        color: '#0000FE',
        fontSize: 13,
        left: 4,
    },
    lastItem: {
        width: '33%',
        borderBottomWidth: 2,
        borderBottomColor: '#1010FE',

    },
    lastTitle: {
        color: '#000',
        textAlign: 'center',
        fontSize: 13,
        fontFamily: 'FuturaPT-Book',
        opacity: .5,
    },
    statsEdit: {},
    helpText: {
        fontSize: 11,
        color: '#9D9D9D',
        textAlign: 'right',
        paddingRight: 25,
    },

    circleNumber: {
        borderTopLeftRadius: 17,
        borderBottomLeftRadius: 17,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
        backgroundColor: 'rgba(13, 28, 113, 0.06);',
    },
    circleNumberClose: {
        borderTopLeftRadius: 17,
        borderBottomLeftRadius: 17,
        display: 'none',
        width: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(13, 28, 113, 0.06);',
        opacity: 0,
    },
    circleText: {
        transform: [{ rotate: '-90deg'}],
        fontSize: 16,
        width: 200,
        textAlign: 'center',
        fontFamily: 'FuturaPT-Bold',
        fontWeight: 'bold',
        color: '#0E1D7A',
    },

});

export default WeightCard ;

