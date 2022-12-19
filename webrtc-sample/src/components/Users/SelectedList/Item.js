import React from 'react';
import {useDispatch} from 'react-redux';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {CLOSE} from '../../../images';
import {usersSelect} from '../../../actionCreators';

import styles from './styles';

export default ({item}) => {
  const dispatch = useDispatch();
  const pressHandler = () => dispatch(usersSelect(item));
  return (
    <View style={styles.itemView}>
      <Text numberOfLines={1} style={styles.itemText}>
        {item.name}
      </Text>
      <TouchableOpacity onPress={pressHandler} style={styles.itemRemoveButton}>
        <Image source={CLOSE} style={styles.itemRemoveIcon} />
      </TouchableOpacity>
    </View>
  );
};
