import React, {useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {changePhone, confirmPhone} from '../redux/action-creators';
import MainBG from '../assets/formTab/background.png';
import Logo from '../assets/logotype.svg';

const {height, width} = Dimensions.get('window');

const CodeScreen = ({navigation, route}) => {
  const [codeNumber, setCodeNumber] = useState('');
  const [error, setError] = useState(false);
  const challenge = route.params ? route.params.challenge : '';
  const dispatch = useDispatch();

  console.log(`challenge: ${challenge}`);

  const handleSubmit = async () => {
    if (codeNumber === '') return;
    const result = await dispatch(confirmPhone(challenge, codeNumber));
  };

  const handleChangePhone = async () => {
    await dispatch(changePhone());
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={MainBG} style={styles.image}>
        <Logo />
        <View style={{flex: 0.7, padding: 20, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
          <TextInput
            style={styles.input}
            onChangeText={setCodeNumber}
            value={codeNumber}
            keyboardType="numeric"
          />
          {error && <Text>Введите корректный номер</Text>}
          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={handleChangePhone}>
            <Text style={styles.backButtonText}>Другой номер телефона</Text>
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
  backButton: {
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,

  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'FuturaPT-Book',
    width: width - 70,
    textAlign: 'center',
  },
});

export default CodeScreen;

