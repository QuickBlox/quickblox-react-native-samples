import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import { CLOSE } from '../../../images'
import styles from './styles'

export default ({ item, selectUser }) => {
  const pressHandler = () => selectUser(item)
  return (
    <View style={styles.itemView}>
      <Text numberOfLines={1} style={styles.itemText}>
        {item.name}
      </Text>
      <TouchableOpacity
        onPress={pressHandler}
        style={styles.itemRemoveButton}
      >
        <Image source={CLOSE} style={styles.itemRemoveIcon} />
      </TouchableOpacity>
    </View>
  )
}