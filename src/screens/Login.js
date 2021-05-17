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

import MainBG from "../assets/formTab/background.png";
import Logo from "../assets/logotype.svg";

const { height, width } = Dimensions.get('window');

const Login = ({navigation}) => {

    const [phoneNumber, setPhoneNumber] = useState('+79')
    const [error, setError] = useState(false)

    const  phoneValidate = (value) => {
            setPhoneNumber(value)

    }

    const  registerUser = async () => {
        try {
            let response = await fetch(`https://powertrain.app/api/app/login-phone`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "phone": phoneNumber
                })
            });
            let responseJson = await response.json();
            console.log(responseJson.challenge, 'tt')
            navigation.navigate('CodeScreen', {challenge: responseJson.challenge})
        } catch (error) {
            console.log(error);
            setTimeout(() => Alert.alert('Oops', 'Something went wrong, please try again later'), 850);
        }
    }
    return (
        <View style={styles.container} >
            <ImageBackground source={MainBG} style={styles.image}>
                <Logo />
                <View style={{ flex : 0.7, padding: 20, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <TextInput
                style={styles.input}
                onChangeText={phoneValidate}
                value={phoneNumber}
                keyboardType="numeric"
            />
                    {error && <Text>Введите корректный номер</Text>}
                    <TouchableOpacity style={styles.btn} onPress={() => registerUser()}>
                        <Text style={styles.btnText} >Register</Text>
                    </TouchableOpacity>
                </View>


            </ImageBackground>

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#fff',
    },
    image: {
        flex: 1,
        paddingTop: 40,
        resizeMode: "center",
        justifyContent: "center",
        alignItems: 'center'
    },
    input: {
        marginTop: 50,
        borderRadius: 10,
        width: width - 70,
        padding: 15,
        color: '#fff',
        fontFamily: 'FuturaPT-Book',
        backgroundColor: '#000B2C',
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 23,
    },
    btn: {
        marginTop: 20,
        width: width - 70,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 10,
    },
    btnText: {
        color: '#fff',
    },

});

export default Login;

