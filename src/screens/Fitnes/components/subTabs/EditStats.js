import React, {useState, useEffect} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    ImageBackground,
    Dimensions,
    ScrollView,
    Modal,
    Image,
    TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoBack from '../../../../assets/formTab/goback.svg';
import UpArr from '../../../../assets/formTab/up.svg';
import DownArr from '../../../../assets/formTab/down.svg';
import DoneIcon from '../../../../assets/formTab/done.svg';
import CloseIcon from '../../../../assets/formTab/closemdpi.svg'
import TimerIcon from '../../../../assets/formTab/Timer.svg'

const {height, width} = Dimensions.get('window');

const EditStats = props => {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false)
    const [index, setIndex] = useState(null)
    const [valueIndex, setValueIndex] = useState(null)
    const [value, setValue] = useState(0)
    const {name,firstTrain,secondTrain, onChangeNumber, onChangeSecondNumber} = props.route.params

    const onVisibleModal = (index, value, valueIndex) => {
        setValueIndex(valueIndex)
,         setIndex(index)
        setValue(Number(value))
        setModalVisible(true)

    }
    const changeValue = () => {
        index == 0 ?   onChangeNumber(valueIndex,value) : onChangeSecondNumber(valueIndex, value)
        setModalVisible(false)
    }
    useEffect(() => {
        console.log(firstTrain, 'props')
    }, [firstTrain])


    return (
        <View style={styles.wrapper}>
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.header}>
                   <GoBack width={50} height={25}/>
                   <Text style={styles.headerTitle}>{name}</Text>
               </TouchableOpacity>
            <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabsWrapper}>
                {firstTrain.map((item,index) => {
                    console.log(item, 'item')
                  return   <View style={styles.editItem}>
                        <Text style={styles.title}>{index + 1}-й подход</Text>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardTitle}>
                                <Text style={{width: '65%',color: '#0C0C0C', fontSize: 13,textAlign: 'left'}}>Жим гантелей лёжа на наклонной скамье 45 градусов</Text>
                                <Text style={{width: '30%',color: '#0C0C0C', fontSize: 13,textAlign: 'right'}}>12-15  повторений</Text>
                            </View>

                                <TouchableOpacity style={styles.defaultBtn} onPress={() => onVisibleModal(0, firstTrain[index], index )}>
                                    <Text  style={styles.defaultText}>{firstTrain[index]}</Text>
                                </TouchableOpacity>
                        </View>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardTitle}>
                                <Text style={{width: '65%',color: '#0C0C0C', fontSize: 13,textAlign: 'left'}}>Разведение гателей на горизонтальной скамье</Text>
                                <Text style={{width: '30%',color: '#0C0C0C', fontSize: 13,textAlign: 'right'}}>12-15  повторений</Text>
                            </View>
                            <TouchableOpacity style={styles.defaultBtn} onPress={() => onVisibleModal(1, secondTrain[index], index )}>
                                <Text  style={styles.defaultText}>{secondTrain[index]}</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.rest}>
                            <Text style={styles.restText}>Отдых</Text>
                            <View style={styles.restTime}>
                                <TimerIcon />
                                <Text style={styles.timerText}>2:00</Text>
                            </View>
              </View>
                    </View>
                })}

            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {setModalVisible(!modalVisible)}}
            >
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.centeredView}>
                    <View style={styles.closeIcon} >
                        <CloseIcon />
                    </View>

                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Выполнен вес</Text>
                        <View style={styles.inputView}>
                         <TouchableOpacity style={styles.modalArrUp} onPress={() => setValue(value + 0.5)} >
                             <UpArr     />
                         </TouchableOpacity>
                            <TextInput
                                style={styles.lastItem}
                                onChangeText={(value) => setValue(Number(value))}
                                value={value.toString()}
                                defaultValue={0}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={styles.modalArrDown} onPress={() => setValue(value - 0.5)}>
                                <DownArr  />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => changeValue()} style={styles.doneBtn} >
                            <DoneIcon />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    wrapper: {
       flex: 1,
       flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 15,
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'FuturaPT-Medium',
        fontWeight: '500',
        lineHeight: 25,
    },
    centeredView: {
        backgroundColor: 'rgba(0,0,0, .7)',
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 0,
    },
    closeIcon: {
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        bottom: 15,
        right: 15,
    },

    modalView: {
        backgroundColor: "white",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        width: width,
        padding: 20,
        paddingBottom: 0,
        alignItems: "center",
        justifyContent: 'flex-end',
        flexDirection:  'column',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    inputView: {
        width: width,
        paddingTop: 10,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
    tabsWrapper: {
        flexDirection: 'column',
        marginTop: 60,
        alignItems: 'center',
        paddingBottom: 145,
    },
    header: {
        height: 60,
        position: 'absolute',
        width: width,
        zIndex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        top: 10,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 21,
        fontFamily: 'FuturaPT-Medium',
        fontWeight: '500',
        color: '#000'
    },
    editItem: {
        top: 20,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: 350,
    },
    title: {
        fontSize: 21,
        lineHeight: 25,
        color: '#000',
        fontFamily: 'FuturaPT-Medium',
        fontWeight: '600',
    },
    cardHeader: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
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
    defaultText: {
        fontSize: 27,
        fontFamily: 'FuturaPT-Book',
        fontWeight: 'bold',
        color: '#1010FE',
        textAlign: 'center'
    },
    defaultBtn: {
        top: 30,
        width: '30%',
        borderBottomWidth: 1,
        borderBottomColor: '#1010FE',
    },
    lastTitle: {
        color: '#000',
        fontSize: 13,
        fontFamily: 'FuturaPT-Book',
        opacity: .5,
    },

    cardTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: 20,
    },
    rest: {
        top: 60,
      backgroundColor: '#6B1E57',
        height: 45,
        borderRadius: 12,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    restTime: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    restText: {
        color: '#fff',
        width: 100,
        fontSize: 18,
        lineHeight: 25,
        fontFamily: 'FuturaPT-Medium',
        fontWeight: '500',
    },
    timerText: {
        color: '#fff',
        fontFamily: 'FuturaPT-Medium',
        fontWeight: '500',
        fontSize: 15,
        marginLeft: 10,
        lineHeight: 25,
    },
});

export default EditStats;
