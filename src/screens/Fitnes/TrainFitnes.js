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

import Tab from './components/Tab';

const { height, width } = Dimensions.get('window');

const TrainFitnes = (props) => {

    const {trainName, trainNumber} = props.route.params
    console.log(props.route.params, 'props.trainName')
    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Тренировка</Text>
                <Text style={styles.headerName}>{trainNumber}</Text>
            </View>
            <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabsWrapper}>
                <Tab name={'Суперсет'} desc={'Жим ногами'} />
                <Tab name={'Обычное упражнения'} desc={'Тренировка корпуса и мышцы'}/>
            </ScrollView>

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#fff',
        paddingTop: 35,
    },
    header: {
        justifyContent: "center",
        alignItems: 'center'
    },
    headerTitle: {
        fontFamily: 'FuturaPT-BookObl',
        fontSize: 21,
        fontWeight: '500',
        color: '#000000'
    },
    headerName: {
        fontFamily: 'FuturaPT-Book',
        fontSize: 15,
        opacity: 0.52,
        fontWeight: 'normal',
        color: '#000000'
    },
    tabsWrapper: {
        paddingBottom: 300,
        flexDirection: 'column',
        marginTop: 15,
        alignItems: 'center'
    },

});

export default TrainFitnes;

