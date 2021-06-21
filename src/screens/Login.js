import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TextInputMask from 'react-native-text-input-mask';
import {loginPhone} from '../redux/action-creators';
import MainBG from '../assets/formTab/background.png';
import Logo from '../assets/logotype.svg';

const {height, width} = Dimensions.get('window');

const Login = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('+79');
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const {
    loginLoading: loading,
    loginErrors: errors,
    loginMessage: message,
    challenge,
    token,
  } = useSelector(state => state.auth);

  const phoneValidate = value => {
    setPhoneNumber(value);
  };

  const registerUser = async () => {
    const result = await dispatch(loginPhone(phoneNumber));
    if (result.challenge) {
      console.log(`token: ${result.token}`);
      navigation.navigate('CodeScreen', {challenge: result.challenge});
    }
  };

  useEffect(() => {
    if (errors) {
      let reason = (error => {
        switch (error) {
          case 'invalid token':
            return 'Некорректный токен авторизации';

          case 'invalid code':
            return 'Неправильный код';

          case 'max attempts':
            return 'Превышено число попыток';

          default:
            return null;
        }
      })(errors.error);
      if (reason) {
        Alert.alert('Ошибка авторизации', reason);
      }
    }
  }, [errors]);

  useEffect(() => {
    if (message) {
      Alert.alert('Ошибка авторизации', message);
    }
  }, [message]);

  return (
    <View style={styles.container}>
      <ImageBackground source={MainBG} style={styles.image}>
        <Logo />
        <View style={{flex: 0.7, padding: 20, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
          <TextInputMask
            style={styles.input}
            onChangeText={phoneValidate}
            value={phoneNumber}
            keyboardType="phone-pad"
            mask="+7 ([000]) [000]-[00]-[00]"
            affineFormats={[]}
            customNotations={null}
            affinityCalculationStrategy={null}
          />
          {error && <Text>Введите корректный номер</Text>}
          <TouchableOpacity style={styles.btn} onPress={() => registerUser()}>
            <Text style={styles.btnText}>Register</Text>
          </TouchableOpacity>
        </View>


      </ImageBackground>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    paddingTop: 40,
    resizeMode: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
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
