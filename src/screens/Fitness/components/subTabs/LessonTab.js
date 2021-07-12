import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {WebView} from 'react-native-webview';

import WarningIcon from '../../../../assets/formTab/danger.svg';
import PlayIcon from '../../../../assets/formTab/play.svg';
import PauseIcon from '../../../../assets/formTab/pause.svg';
import Timer from './components/Timer';
import SeekBar from './components/SeekBar';
import HtmlView from '../HtmlView';
import {asset} from '../../../../utils';

const Sound = require('react-native-sound');
// Enable playback in silence mode
Sound.setCategory('Playback');
const sound = new Sound('fileexample.mp3', Sound.MAIN_BUNDLE, error => {
  console.log(error, 'error');
});
const {width} = Dimensions.get('window');

const Video = ({video}) => {
  if (!video.key) {
    return null;
  }

  return (
    <View style={styles.videoWrapper}>
      <WebView
        style={{width: '100%', marginTop: Platform.OS == 'ios' ? 20 : 0}}
        javaScriptEnabled={true}
        allowsFullscreenVideo={true}
        domStorageEnabled={true}
        source={{uri: `https://www.youtube.com/embed/${video.key}`}}
      />
      {/*<Image style={styles.videoBg} resizeMode={'contain'} source={videoBg} />*/}
    </View>
  );
}

const renderExerciseHTML = (exercise) => {
  let coverImage = '';
  if (exercise.photo) {
    coverImage = `<img src="${asset(exercise.photo)}" />`;
  }

  let howToDo = '';
  if (exercise.text) {
    howToDo = `<div class="header">Как выполнять</div>
        <div class="text">${exercise.text.replace(/&nbsp;/g, ' ')}</div>`;
  }

  let scheme = '';
  if (exercise.scheme) {
    scheme = `<div class="header">Схема</div>
      <img class="scheme" src="${asset(exercise.scheme)}">`;
  }

  return `<html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>

html {
    font-size: 14px;
    padding: 0;
    margin: 0;
}

body { 
    padding: 0;
    margin: 0;
    font-family: ${Platform.select({ ios: 'Arial', android: 'Roboto' })};
    background-color: #ededed;
}

h1 {
    font-size: 18px;
}

p {
    font-weight: 400;    
    font-size: 15px;
    line-height: 20px;
    margin-bottom: 15px;
}

img {
    max-width: 100%;
}

.header {
    background-color: #ededed;
    padding: 15px;
    font-size: 16px;
    font-weight: 500;
    text-align: center;    
}

.text {
  padding: 15px;
  background-color: white;
  border-bottom: 1px solid #d5d5d5;
}
.text ul {
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

.text ol {
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-left: 15px;
}

.text ol li {
  margin-bottom: 10px;
}


.text ul li {
  list-style: disc;
}

</style>
${coverImage}
${howToDo}
${scheme}
</html>`;
}


const LessonTab = ({exercise}) => {
  const [startTimer, setStartTimer] = useState(false);
  const [soundMin, setSoundMin] = useState(null);
  const [soundSec, setSoundSec] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [onTrackClick, setOnTrackclick] = useState(null);
  const [trackLength, setTrackLength] = useState(null);

  useEffect(() => {
    secondsToTime(sound.getDuration());
    setTrackLength(Math.round(sound.getDuration()));
    setCurrentPosition(-Math.round(sound.getDuration()));
  }, []);

  useEffect(() => {
    if (currentPosition == 0) {
      setCurrentPosition(-Math.round(sound.getDuration()));
    }
  }, [currentPosition]);

  const secondsToTime = secs => {
    let hours = Math.floor(secs / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.round(divisor_for_seconds);

    setSoundMin(minutes);
    setSoundSec(seconds);
  };

  const Play = () => {
    setTimeout(() => {
      if (startTimer) {
        sound.pause();
        sound.setCurrentTime(3);
        setStartTimer(false);
      } else {
        sound.play(success => {});
        setStartTimer(true);
      }
    }, 100);
  };

  const onSlideСlick = value => {
    console.log(value);
    const newValue = sound.getDuration() - value;
    sound.setCurrentTime(soundSec - newValue);

    setOnTrackclick(Math.round(value));
    setCurrentPosition(Math.round(value));
  };
  return (
    <View style={styles.lessonTab}>
      {exercise.audio ? (
        <React.Fragment>
          <View style={styles.flexView}>
            <Text style={styles.title}>Аудио</Text>
            <WarningIcon />
          </View>
          <View style={styles.soundBlock}>
            <TouchableOpacity style={styles.playBtn} onPress={() => Play()}>
              {startTimer ? <PauseIcon width={20} height={20} /> : <PlayIcon />}
            </TouchableOpacity>
            <View style={styles.rightContent}>
              <Text style={styles.soundText}>
                Жим гантелей лёжа на наклонной скамье 45 градусов
              </Text>
              {soundSec !== null && (
                <Timer
                  onTrackClick={onTrackClick}
                  setTrackLength={setTrackLength}
                  setCurrentPosition={setCurrentPosition}
                  setStartTimer={setStartTimer}
                  startTimer={startTimer}
                  initialMinute={soundMin}
                  initialSeconds={soundSec}
                />
              )}
              <SeekBar
                trackLength={trackLength}
                currentPosition={currentPosition}
                onSlideСlick={onSlideСlick}
              />
            </View>
          </View>
        </React.Fragment>
      ) : null}

      {exercise.video ? (
        <React.Fragment>
          <Text style={styles.videoTitle}>Видеоматериалы</Text>
          <Video video={exercise.video} />
        </React.Fragment>
      ) : null}

      {exercise.text ? <HtmlView html={renderExerciseHTML(exercise)} autoHeight={true} /> : null}
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
    height: 200,
    width: width - 30,
    marginTop: 15,
    marginBottom: 30,
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
    marginBottom: 50,
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
