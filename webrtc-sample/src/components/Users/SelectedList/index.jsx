import React from 'react'
import { ScrollView } from 'react-native'

import Item from '../../../containers/Users/SelectedList/Item'
import EmptyComponent from './EmptyComponent'
import styles from './styles'

export default ({ users = [] }) => (
  <ScrollView contentContainerStyle={styles.scrollViewContent}>
    {users.length ?
      users.map(user => <Item key={`${user.id}`} item={user} />) :
      <EmptyComponent />
    }
  </ScrollView>
)
