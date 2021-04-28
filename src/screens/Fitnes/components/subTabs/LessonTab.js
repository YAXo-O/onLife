import React, {useState, useEffect} from 'react';
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
import { WebView } from 'react-native-webview';

import WarningIcon from '../../../../assets/formTab/danger.svg';

import PlayIcon from '../../../../assets/formTab/play.svg'
import PauseIcon from '../../../../assets/formTab/pause.svg'
import Timer from './components/Timer';
import SeekBar from './components/SeekBar';


const Sound = require('react-native-sound');
// Enable playback in silence mode
Sound.setCategory('Playback');
const sound = new Sound('fileexample.mp3', Sound.MAIN_BUNDLE, (error) => {
  console.log(error, 'error')
});
const {height, width} = Dimensions.get('window');

const LessonTab = props => {
  const [startTimer, setStartTimer] = useState(false)
  const [soundMin, setSoundMin] = useState(null)
  const [soundSec, setSoundSec] = useState(null)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [onTrackClick, setOnTrackclick] = useState(null)
  const [trackLength, setTrackLength] = useState(null)


  useEffect(() => {
    secondsToTime(sound.getDuration())
    setTrackLength(Math.round(sound.getDuration()))
    setCurrentPosition(-Math.round(sound.getDuration()))

  }, [])

  useEffect(() => {
      if(currentPosition == 0 ) {
        setCurrentPosition(-Math.round(sound.getDuration()))

      }
  }, [currentPosition])

const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.round(divisor_for_seconds);

    setSoundMin(minutes)
    setSoundSec(seconds)

  };

  const Play = () => {
      console.log(sound.getDuration(), 'duration')
    setTimeout(() => {

      if(startTimer) {
        sound.pause()
        sound.setCurrentTime(3)
        setStartTimer(false)
      } else {
        sound.play((success) => {
        });
        setStartTimer(true)
      }

    }, 100);
  }

  const onSlideСlick = (value) => {
    console.log(value)
    const newValue = sound.getDuration() - value
    sound.setCurrentTime(soundSec - newValue);

    setOnTrackclick(Math.round(value))
    setCurrentPosition(Math.round(value))
    console.log('fffft', currentPosition, value)
  }
  return (
    <View style={styles.lessonTab}>
      <View style={styles.flexView}>
        <Text style={styles.title}>Аудио</Text>
        <WarningIcon />
      </View>

      <View style={styles.soundBlock}>
      <TouchableOpacity style={styles.playBtn} onPress={() => Play()}>
        { startTimer ? <PauseIcon width={20} height={20}/> : <PlayIcon />}
      </TouchableOpacity>
        <View style={styles.rightContent}>
        <Text style={styles.soundText}>Жим гантелей лёжа на наклонной скамье 45 градусов</Text>
          {soundSec !== null && <Timer onTrackClick={onTrackClick}
                                       setTrackLength={setTrackLength}
                                       setCurrentPosition={setCurrentPosition}
                                       setStartTimer={setStartTimer}
                                       startTimer={startTimer}
                                       initialMinute={soundMin}
                                       initialSeconds={soundSec} />}

          <SeekBar
              trackLength={trackLength}
              currentPosition={currentPosition}
              onSlideСlick ={onSlideСlick}
          />
      </View>
      </View>
      <Text style={styles.videoTitle}>Видеоматериалы</Text>

      <View style={styles.videoWrapper}>

          <WebView
              style={ {width: '100%',marginTop: (Platform.OS == 'ios') ? 20 : 0,} }
              javaScriptEnabled={true}
              allowsFullscreenVideo={true}
              domStorageEnabled={true}
              source={{uri: 'https://www.youtube.com/embed/cwDvV262dRU'}}
          />
          {/*<Image style={styles.videoBg} resizeMode={'contain'} source={videoBg} />*/}

      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  lessonTab: {
    margin: 14,
    paddingBottom: 150,
  },
  videoWrapper: {
    backgroundColor: 'red',
    borderRadius: 20,
    overflow: 'hidden',
    top: 80,
    height: 200,
    width: width - 30,
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    marginRight: 10,
    lineHeight: 26,
    fontFamily: 'FuturaPT-Medium',
    fontWeight: 'bold',
  },
  videoTitle: {
    top: 50,
    fontSize: 22,
    marginRight: 10,
    lineHeight: 26,
    fontFamily: 'FuturaPT-Medium',
    fontWeight: 'bold',
  },

  soundBlock: {
    width: '100%',
    backgroundColor: '#0E1878',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 100,
    paddingLeft: 20,
    paddingRight: 20,
    top: 20,
  },
  playBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    top: 30,
  },
  rightContent: {
    paddingTop: 15,
    left: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '80%',
    color: '#fff',
  },
  soundText: {
    color: '#fff',
    fontSize: 14,
  },
  soundDuration: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.5,
  },
});

export default LessonTab;
