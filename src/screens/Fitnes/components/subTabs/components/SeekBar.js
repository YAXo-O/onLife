import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    Slider,
    TouchableOpacity,
} from 'react-native';

function pad(n, width, z = 0) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = (position) => ([
    pad(Math.floor(position / 60), 2),
    pad(position % 60, 2),
]);

const SeekBar = ({
                     trackLength,
                     currentPosition,
                     onSeek,
                     onSlideСlick,
                 }) => {

    return (
        <View style={styles.container}>
            <Slider
                maximumValue={Math.max(trackLength, 1, currentPosition  - 1)}
                value={currentPosition}
                onValueChange={(value) => onSlideСlick(value)}
                minimumTrackTintColor={'#6A6DFF'}
                maximumTrackTintColor={'rgba(255,255,255, 0.9)'}
                thumbTintColor={'#6A6DFF'}
                thumbStyle={styles.thumb}
                trackStyle={styles.track}
            />
        </View>
    );
};

export default SeekBar;

const styles = StyleSheet.create({

    container: {
        width: '100%',
        paddingTop: 8,
        left: -15,
    },
    track: {
        height: 2,
        borderRadius: 1,
    },
    thumb: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    text: {
        color: 'rgba(255, 255, 255, 0.72)',
        fontSize: 12,
        textAlign: 'center',
    }
});
