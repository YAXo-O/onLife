import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import CardItem from './CardItem';
import WeightCard from './WeightCard';
import {useNavigation} from '@react-navigation/native';

const {height, width} = Dimensions.get('window');

const WeightTab = props => {
    const navigation = useNavigation()

  const [listData, setListData] = useState(
      Array(1)
          .fill('')
          .map((_, i) => ({ key: `${i}`, text: `1-й круг` }))
  );

  const [statOpen, setStatOpen] = useState(false);
  const [firstTrain, setFirstTrain] = useState([0, 0, 0, 0]);
  const [secondTrain, setSecondTrain] = useState([0, 0, 0, 0]);

  const onChangeNumber = (approach, number) => {
       const  newTrain = [...firstTrain]
       newTrain [approach] = number;
        setFirstTrain(newTrain)
      navigation.goBack()
  }
    const onChangeSecondNumber = (approach, number) => {
        const  newTrain = [...secondTrain]
        newTrain [approach] = number;
        setSecondTrain(newTrain)
        navigation.goBack()
    }
  const onRowOpen = () => {
    statOpen ? setStatOpen(false ) : setStatOpen(true)
  }

  const renderItem = data => (
      <TouchableHighlight
          onPress={() => console.log('You touched me')}
          style={styles.itemWrapper}
          underlayColor={'#AAA'}
      >
          <WeightCard name={props.name}
                      statOpen={statOpen}
                      onChangeNumber={onChangeNumber}
                      onChangeSecondNumber={onChangeSecondNumber}
                      firstTrain={firstTrain}
                      secondTrain={secondTrain}
                      />
      </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
          <CardItem firstTrain={firstTrain} secondTrain={secondTrain}/>
  );

  return (
    <View style={styles.wrapper}>
        <SwipeListView
            data={listData}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            disableRightSwipe
            rightOpenValue={-(width-40)}
            previewRowKey={'0'}
            swipeToOpenVelocityContribution={40}
            previewOpenValue={1000}
            previewOpenDelay={3000}
            onRowOpen={() => setStatOpen(true)}
            onRowClose={() => setStatOpen(false )}

        />

    </View>
  );
};
const styles = StyleSheet.create({

  wrapper: {
    marginLeft: 0,
  },
  itemWrapper: {
    flexDirection: 'row',
    marginBottom: 40,
    backgroundColor: '#fff',

  },
});

export default WeightTab;
