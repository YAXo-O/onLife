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


const { height, width } = Dimensions.get('window');

const  CardItem = (props) => {


    const onChangeInput = () => {};


    return (
        <View style={styles.statsWrapper}>
            <Text style={styles.title}>Статистика</Text>
            <View style={styles.cardItemFirst}>
                <Text style={{color: '#0C0C0C', fontSize: 15, fontFamily: 'FuturaPT-Medium',}}>Жим гантелей лёжа на наклонной {'\n'}скамье 45 градусов</Text>
                <View style={styles.statsData}>
                    <View style={styles.statItem}>
                        <View style={styles.statInput}>
                            <Text style={styles.inputText}>{props.firstTrain[0] ? props.firstTrain[0] : ''}</Text>
                            <Text style={styles.sufix}>кг</Text>
                        </View>
                        <Text style={styles.subTitle}>1-й{'\n'} подход</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.statInput}>
                            <Text style={styles.inputText}>{props.firstTrain[1] ? props.firstTrain[1] : ''}</Text>
                            <Text style={styles.sufix}>кг</Text>
                        </View>
                        <Text style={styles.subTitle}>2-й{'\n'} подход</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.statInput}>
                            <Text style={styles.inputText}>{props.firstTrain[2] ? props.firstTrain[2] : ''}</Text>
                            <Text style={styles.sufix}>кг</Text>
                        </View>
                        <Text style={styles.subTitle}>3-й{'\n'} подход</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.statInput}>
                            <Text style={styles.inputText}>{props.firstTrain[3] ? props.firstTrain[3] : ''}</Text>
                            <Text style={styles.sufix}>кг</Text>
                        </View>
                        <Text style={styles.subTitle}>4-й{'\n'} подход</Text>
                    </View>
                </View>
            </View>
            <View style={styles.cardItemSecond}>
                <Text style={{color: '#0C0C0C', fontSize: 15, fontWeight: '400', fontFamily: 'FuturaPT-Medium',}}>Жим гантелей лёжа на наклонной {'\n'}скамье 45 градусов</Text>
                <View style={styles.statsData}>
                    <View style={styles.statItem}>
                        <View style={styles.statInput}>
                            <Text style={styles.inputText}>{props.secondTrain[0] ? props.secondTrain[0] : ''}</Text>
                            <Text style={styles.sufix}>кг</Text>
                        </View>
                        <Text style={styles.subTitle}>1-й{'\n'} подход</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.statInput}>
                            <Text style={styles.inputText}>{props.secondTrain[1] ? props.secondTrain[1] : ''}</Text>
                            <Text style={styles.sufix}>кг</Text>
                        </View>
                        <Text style={styles.subTitle}>2-й{'\n'} подход</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.statInput}>
                            <Text style={styles.inputText}>{props.secondTrain[2] ? props.secondTrain[2] : ''}</Text>
                            <Text style={styles.sufix}>кг</Text>
                        </View>
                        <Text style={styles.subTitle}>3-й{'\n'} подход</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={styles.statInput}>
                            <Text style={styles.inputText}>{props.secondTrain[3] ? props.secondTrain[3] : ''}</Text>
                            <Text style={styles.sufix}>кг</Text>
                        </View>
                        <Text style={styles.subTitle}>4-й{'\n'} подход</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    statsWrapper: {
        justifyContent: 'space-between',
        width: width-25,
        left: 30,
        zIndex: 33,
        borderTopLeftRadius: 17,
        borderTopRightRadius: 17,
    },
    title: {
        fontSize: 22,
        fontFamily: 'FuturaPT-Medium',
        fontWeight: '500',
        color: '#000',
        paddingLeft: 13,
    },
    cardItemFirst: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        height: 130,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.14)',
    },
    cardItemSecond: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        height: 130,
    },
    statsData: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsItem: {
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.14)',
    },
    statItem: {
        width: '24%',
        top: 16,
    },
    statInput: {
        borderWidth: 1,
        borderColor: '#DBDBDB',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
        height: 38,

    },
    inputText: {
        fontSize: 16,
        lineHeight: 21,
        textAlign: 'center',
        fontFamily: 'FuturaPT-Medium',
        fontWeight: 'bold',
    },
    subTitle: {
        textAlign: 'center',
        color: '#0C0C0C',
        opacity: 0.6,
        fontSize: 10,
        top: 10,
    },
    statsEdit: {},
    sufix: {
        marginLeft: 5,
    },
});

export default CardItem;

