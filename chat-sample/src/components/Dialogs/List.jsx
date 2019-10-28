import React from 'react'
import { FlatList, RefreshControl } from 'react-native'

import Dialog from './Dialog'
import styles from './styles'
import { colors } from '../../theme'

export default class DialogsList extends React.PureComponent {

  componentDidMount() {
    const { getDialogs, limit, skip } = this.props
    getDialogs && getDialogs({ skip, limit })
  }

  loadNextPage = () => {
    const { getDialogs, limit, loading, skip, total } = this.props
    if (loading || skip + limit > total) return
    getDialogs && getDialogs({
      append: true,
      skip: skip + limit,
      limit
    })
  }

  onPress = dialog => {
    const { onPress, selectable, selectDialog } = this.props
    if (onPress) {
      onPress(dialog)
    } else {
      if (selectable && selectDialog) {
        selectDialog(dialog.id)
      }
    }
  }

  onLongPress = dialog => {
    if (this.props.onLongPress) {
      this.props.onLongPress(dialog)
    }
  }

  renderDialog = ({ item }) => {
    const { selectable = false, selected = [] } = this.props
    const isSelected = selected.length && selected.indexOf(item.id) > -1
    return (
      <Dialog
        dialog={item}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
        selectable={selectable}
        isSelected={isSelected}
      />
    )
  }

  render() {
    const { dialogs, getDialogs, loading } = this.props
    return (
      <FlatList
        data={dialogs}
        keyExtractor={({ id }) => id}
        onEndReached={this.loadNextPage}
        onEndReachedThreshold={0.9}
        refreshControl={(
          <RefreshControl
            colors={[colors.primary]}
            onRefresh={getDialogs}
            refreshing={loading}
            tintColor={colors.primary}
          />
        )}
        renderItem={this.renderDialog}
        style={styles.dialogsList}
      />
    )
  }

}