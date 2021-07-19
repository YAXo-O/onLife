import React from 'react'
import { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TouchableHighlight,
    Dimensions,
    Image,
} from 'react-native';


const Timer = (props) => {
    const {initialMinute ,initialSeconds } = props;
    const [ minutes, setMinutes ] = useState(initialMinute);
    const [seconds, setSeconds ] =  useState(initialSeconds);

    useEffect(()=>{
        if(props.startTimer) {
            let myInterval = setInterval(() => {

                if (seconds > 0) {

                    setSeconds(seconds - 1);
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(myInterval)
                        setSeconds(initialSeconds)
                        props.setStartTimer(false)
                        props.setCurrentPosition(0)
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                }
                props.setCurrentPosition(initialSeconds - seconds)
            }, 1000)
            return ()=> {
                clearInterval(myInterval);
            };
        }
    },);
    useEffect(() => {

        if(props.onTrackClick !== null) {
            setSeconds( initialSeconds - props.onTrackClick)
        }
    }, [props.onTrackClick])

    return (
        <View>
            <Text style={styles.soundDuration}> {minutes < 10 ?  `0${minutes}` : minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    soundDuration: {
        top: 4,
        fontSize: 12,
        color: '#fff',
        opacity: .5,
    },
})
export default Timer;
