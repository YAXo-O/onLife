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
import {Picker} from '@react-native-community/picker';
import MainBG from '../../assets/formTab/background.png'
import Logo from '../../assets/logotype.svg'
import SelectArr from '../../assets/formTab/select-arr.svg'

const { height, width } = Dimensions.get('window');

const FitnesDashboard = ({ navigation }) => {
   const [trainName, setTrainName] = useState('1')
   const [trainNumber, setTraintNumber] = useState('№1 грудь')

    return (
        <View style={styles.container} >
            <ImageBackground source={MainBG} style={styles.image}>
                    <Logo />
                    <View style={{ flex : 0.7, alignItems: 'center',borderRadius: 14, padding: 20, justifyContent: 'space-between' }}>
                        <View style={styles.inputWrapper}>
                        <View style={styles.inputBlock}>
                            <Text style={styles.selectlabel}>Номер круга</Text>
                            <Picker
                                selectedValue={trainName}
                                style={styles.picker}
                                onValueChange={(itemValue, itemIndex) =>
                                    setTrainName(itemValue)
                                }>
                                <Picker.Item label="№1" value="1" />
                                <Picker.Item label="№2" value="2" />
                                <Picker.Item label="№3" value="3" />
                            </Picker>
                            <SelectArr style={styles.selectArr}/>
                        </View>

                        <View style={styles.inputBlockBottom}>
                            <Text style={styles.selectlabel} >Тренировка</Text>
                            <Picker
                                selectedValue={trainNumber}
                                style={styles.picker}
                                onValueChange={(itemValue, itemIndex) =>
                                    setTraintNumber(itemValue)
                                }>
                                <Picker.Item label="№1 грудь" value="№1 грудь" />
                                <Picker.Item label="№2 руки" value="№2 руки" />
                                <Picker.Item label="№3 ноги" value="№3 ноги" />
                            </Picker>
                            <SelectArr style={styles.selectArr}/>
                        </View>
                    </View>
                        <View style={styles.startWrapper}>
                        <TouchableOpacity style={styles.startBtn}
                                          onPress={() => navigation.navigate('TrainFitnes', {trainName: trainName, trainNumber: trainNumber })}>
                        <Text style={styles.startBtnText}>Start</Text>
                        </TouchableOpacity>
                        <Text style={styles. startText}>Начать тренировку</Text>
                        </View>
                    </View>
            </ImageBackground>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    image: {
        flex: 1,
        paddingTop: 10,
        resizeMode: "center",
        justifyContent: "center",
        alignItems: 'center'
    },
    selectArr: {
        position: 'absolute',
        right: 20,
        top: 35,
        opacity: .4,
    },
    inputWrapper: {
        paddingBottom: 15,
        width: width - 80,
        backgroundColor: '#000B2C',
        borderRadius: 14,
        top: 70,
    },
    inputBlock: {
        paddingTop: 15,
        paddingLeft: 14,
        paddingRight: 20,
        paddingBottom: 15,
    },
    inputBlockBottom: {
        borderTopWidth: 1,
        color: '#fff',
        paddingTop: 13,
        borderColor: 'rgba(255, 255, 255, 0.13)',
        paddingLeft: 14 ,
        paddingRight: 20,
    },
    selectlabel: {
        color: '#fff',
        opacity: .3,
        marginLeft: 6,
        fontFamily: 'FuturaPT-Book',
        fontSize: 15,
    },
    picker: {
        width: '100%',
        height: 35,
        color: '#fff',
        fontFamily: 'FuturaPT-Book',
        backgroundColor: '#000B2C',
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 23,
    },
    startWrapper: {
        top: -20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startBtn: {
        width: 95,
        height: 95,
        backgroundColor: '#1317CE',
        alignItems: 'center',
        borderRadius: 100,
        justifyContent: 'center',
        marginBottom: 20,
    },
    startBtnText: {
        fontSize: 20,
        fontFamily: 'Jost-Bold',
        fontStyle: 'italic',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: 0.04,
        color: '#fff',
    },
    startText: {
        fontSize: 12,
        fontFamily: 'Jost-Bold',
        fontStyle: 'italic',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: 0.04,
        color: '#fff',
    },

});

export default FitnesDashboard;

