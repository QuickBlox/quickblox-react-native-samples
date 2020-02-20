import React from 'react'
import {
  ActivityIndicator,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Message from '../../containers/Messages/Message'
import TypingIndicator from '../../containers/TypingIndicator'
import Navigation from '../../NavigationService'
import { colors } from '../../theme'

const styles = StyleSheet.create({
  messagesList: {
    backgroundColor: colors.whiteBackground,
    paddingHorizontal: 10,
    width: '100%',
  },
  sectionHeaderView: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    justifyContent: 'center',
  },
  sectionHeaderTextView: {
    alignItems: 'center',
    backgroundColor: colors.greyedBlue,
    borderRadius: 11,
    height: 20,
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  sectionHeaderText: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
  },
  noMessagesView: {
    alignSelf: 'center',
    height: '100%',
    transform: [{ scaleY: -1 }]
  },
  noMessagesText: {
    color: colors.label,
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'center',
  },
})

export default class MessagesList extends React.PureComponent {

  viewabilityConfig = {
    minimumViewTime: 600,
    itemVisiblePercentThreshold: 100,
  }
  PAGE = 0
  PER_PAGE = 30

  componentDidMount() {
    const { dialogId, getMessages } = this.props
    if (dialogId && getMessages) {
      getMessages({
        dialogId,
        limit: this.PER_PAGE,
        skip: this.PAGE * this.PER_PAGE,
      })
    }
  }

  loadMore = () => {
    const { hasMore, dialogId, getMessages, loading } = this.props
    if (loading || !hasMore) {
      return
    }
    this.PAGE += 1
    getMessages({
      dialogId,
      limit: this.PER_PAGE,
      skip: this.PAGE * this.PER_PAGE,
    })
  }

  forwardTo = message => Navigation.navigate({
    key: message.id,
    params: { message },
    routeName: 'ForwardTo',
  })

  showDelivered = message => Navigation.navigate({
    key: message.id,
    params: { message },
    routeName: 'DeliveredTo',
  })

  showViewed = message => Navigation.navigate({
    key: message.id,
    params: { message },
    routeName: 'ViewedBy',
  })

  renderLoadingIndicator = () => this.props.loading ? (
    <ActivityIndicator
      color={colors.primary}
      size={30}
      style={{ padding: 10 }}
    />
  ) : null

  getDateString = date => {
    const now = new Date()
    if (date.getFullYear() === now.getFullYear()) {
      if (date.getMonth() === now.getMonth()) {
        if (date.getDate() === now.getDate()) {
          return 'Today'
        }
        if (date.getDate() === now.getDate() - 1) {
          return 'Yesterday'
        }
      }
      return date.toDateString().replace(/(^\w+\s)|(\s\d+$)/g, '')
    } else {
      return date.toDateString().replace(/(^\w+\s)/, '')
    }
  }

  listEmptyComponent = () => this.props.loading ? null : (
    <View style={styles.noMessagesView}>
      <Text>There is no messages in this chat yet</Text>
    </View>
  )

  renderMessage = ({ item }) => (
    <Message
      dialogType={this.props.dialogType}
      message={item}
      onForwardPress={this.forwardTo}
      showDelivered={this.showDelivered}
      showViewed={this.showViewed}
    />
  )

  renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeaderView}>
      <View style={styles.sectionHeaderTextView}>
        <Text style={styles.sectionHeaderText}>
          {this.getDateString(section.title)}
        </Text>
      </View>
    </View>
  )

  viewableItemsChanged = ({ viewableItems }) => {
    const { currentUser, markAsRead } = this.props
    viewableItems
      .filter(item => item.index !== null)
      .forEach(({ isViewable, item: message }) => {
        const { readIds = [] } = message
        const shouldMarkAsRead = (
          isViewable &&
          readIds.indexOf(currentUser.id) === -1
        )
        if (shouldMarkAsRead) {
          markAsRead(message)
        }
      })
  }

  render() {
    const { dialogId, hasMore, sections } = this.props
    return (
      <SectionList
        inverted={true}
        keyExtractor={({ id }) => id}
        ListEmptyComponent={this.listEmptyComponent}
        ListFooterComponent={this.renderLoadingIndicator}
        ListHeaderComponent={
          <TypingIndicator dialogId={dialogId} style={{ padding: 10 }} />
        }
        onEndReached={hasMore ? this.loadMore : undefined}
        onEndReachedThreshold={1}
        onViewableItemsChanged={this.viewableItemsChanged}
        renderItem={this.renderMessage}
        renderSectionFooter={this.renderSectionHeader}
        renderToHardwareTextureAndroid={Platform.OS === 'android'}
        sections={sections}
        style={styles.messagesList}
        viewabilityConfig={this.viewabilityConfig}
      />
    )
  }

}