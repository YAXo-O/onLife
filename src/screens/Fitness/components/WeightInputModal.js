import React, { useEffect, useState } from 'react'
import {Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import CloseIcon from '../../../assets/formTab/closemdpi.svg';
import UpArr from '../../../assets/formTab/up.svg';
import DownArr from '../../../assets/formTab/down.svg';
import DoneIcon from '../../../assets/formTab/done.svg';

const {width} = Dimensions.get('window');

export default function ({weightInput, onClose}) {
  const [value, setValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (weightInput) {
      setValue(weightInput.value);
    }
    setIsVisible(!!weightInput);
  }, [weightInput]);

  const handleSubmit = () => {
    weightInput.onSubmit(value);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.topTouchable}>
          <View style={styles.closeIcon}>
            <CloseIcon />
          </View>
        </TouchableOpacity>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Выполнен вес</Text>
          {weightInput?.name ? (
            <Text style={styles.modalSubtitle}>{weightInput.name}</Text>
          ) : null}
          <View style={styles.inputView}>
            <TouchableOpacity
              style={styles.modalArrUp}
              onPress={() => setValue(value + 0.5)}>
              <UpArr />
            </TouchableOpacity>
            <TextInput
              style={styles.lastItem}
              onChangeText={value => setValue(Number(value))}
              value={value ? value.toString() : ''}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.modalArrDown}
              onPress={() => setValue(value - 0.5)}>
              <DownArr />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.doneBtn}>
            <DoneIcon />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: width,
    padding: 20,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputView: {
    width: width,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalArrUp: {
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
  },
  modalArrDown: {
    justifyContent: 'center',
    alignItems: 'center',
    left: 20,
  },
  doneBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#1317CE',
    width: width,
  },
  lastItem: {
    width: '35%',
    height: 50,
    fontSize: 27,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.13)   ',
    color: '#1010FE',
    textAlign: 'center',
    borderRadius: 9,
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0, .7)',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 0,
  },
  topTouchable: {
    flexGrow: 1,
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
  },
  closeIcon: {
    position: 'absolute',
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    bottom: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'FuturaPT-Medium',
    fontWeight: '500',
    lineHeight: 25,
  },
  modalSubtitle: {
    fontSize: 22,
    fontFamily: 'FuturaPT-Medium',
    fontWeight: '500',
    lineHeight: 25,
  },
});
