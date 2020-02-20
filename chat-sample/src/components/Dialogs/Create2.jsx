import React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  NavigationActions,
  SafeAreaView,
  StackActions,
} from 'react-navigation'
import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from 'final-form'

import FormTextInput from '../FormTextInput'
import { colors } from '../../theme'
import styles from './styles'
import { showError } from '../../NotificationService'

const localStyles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: colors.whiteBackground,
    paddingVertical: 15,
    width: '100%',
  },
  formControlView: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  label: {
    color: colors.label,
    fontSize: 13,
    opacity: 0.5,
    paddingBottom: 11,
  },
  textInput: {
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.black,
    elevation: 4,
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: colors.inputShadow,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  textInputActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.black,
    elevation: 14,
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: colors.primaryDisabled,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
})

export default class DialogsCreate2 extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    const { finishHandler } = params
    return {
      headerTitle: (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>New Chat</Text>
        </View>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={finishHandler}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            Finish
          </Text>
        </TouchableOpacity>
      )
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ finishHandler: this.formSubmit })
  }

  validate = ({ name = '' }) => {
    const errors = {}
    if (!/^.{3,20}$/.test(name)) {
      errors.name = 'Must be in a range from 3 to 20 characters'
    }
    return errors
  }

  submit = ({ name }) => {
    const {
      createDialog,
      currentUser,
      navigation,
      occupantsIds,
      sendMessage,
      users,
    } = this.props
    return new Promise((resolve, reject) => {
      createDialog({ name, occupantsIds, resolve, reject })
    })
    .then(action => {
      const dialog = action.payload
      const myName = (
        currentUser.fullName || currentUser.login || currentUser.email
      )
      const opponentsNames = occupantsIds.map(userId => {
        const user = users.find(user => user.id === userId)
        return user ? (user.fullName || user.login || user.email) : undefined
      })
      const body = (
        myName +
        ' created new dialog with: ' +
        opponentsNames.join(', ')
      )
      new Promise((resolve, reject) => sendMessage({
        dialogId: dialog.id,
        body,
        properties: { notification_type: 1 },
        resolve,
        reject,
      }))
      .then(() => {
        const reset = StackActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'Dialogs' }),
            NavigationActions.navigate({
              routeName: 'Messages',
              params: { dialog },
              key: dialog.id
            })
          ]
        })
        navigation.dispatch(reset)
      })
      .catch(action => showError('Failed to send message', action.error))
    })
    .catch(action => ({ [FORM_ERROR]: action.error }))
  }

  renderForm = ({ handleSubmit }) => {
    this.formSubmit = handleSubmit
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding' })}
          style={localStyles.contentView}
        >
          <View style={localStyles.formControlView}>
            <Text style={localStyles.label}>Chat Name</Text>
            <Field
              activeStyle={localStyles.textInputActive}
              component={FormTextInput}
              name="name"
              returnKeyType="done"
              style={localStyles.textInput}
              underlineColorAndroid={colors.transparent}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  render() {
    return (
      <Form
        render={this.renderForm}
        onSubmit={this.submit}
        validate={this.validate}
      />
    )
  }

}
