import React from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Form, Field } from 'react-final-form'

import FormTextInput from '../FormTextInput'
import HeaderButton from '../HeaderButton'
import { showError } from '../../NotificationService'
import styles from './styles'
import { colors } from '../../theme'
import images from '../../images'

const Header = ({ children, style }) => (
  <Text style={[styles.header, style]}>
    {children}
  </Text>
)

const Label = ({ children, style }) => (
  <Text style={[styles.label, style]}>
    {children}
  </Text>
)

// w3c email regex https://html.spec.whatwg.org/multipage/input.html#e-mail-state-(type=email)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export default class Login extends React.Component {

  LOGIN_HINT = 'Use your email or alphanumeric characters in a range from 3 to 50. First character must be a letter.'
  USERNAME_HINT = 'Use alphanumeric characters and spaces in a range from 3 to 20. Cannot contain more than one space in a row.'

  static navigationOptions = ({ navigation }) => ({
    title: 'Enter to videochat',
    headerRight: (
      <HeaderButton
        imageSource={images.INFO}
        onPress={() => navigation.navigate('Info')}
      />
    )
  })

  validate = (values) => {
    const errors = []
    if (values.login) {
      if (values.login.indexOf('@') > -1) {
        if (!emailRegex.test(values.login)) {
          errors.login = this.LOGIN_HINT
        }
      } else {
        if (!/^[a-zA-Z][\w\-\.]{1,48}\w$/.test(values.login)) {
          errors.login = this.LOGIN_HINT
        }
      }
    } else {
      errors.login = this.LOGIN_HINT
    }
    if (values.username) {
      if (!/^(?=.{3,20}$)(?!.*([\s])\1{2})[\w\s]+$/.test(values.username)) {
        errors.username = this.USERNAME_HINT
      }
    } else {
      errors.username = this.USERNAME_HINT
    }
    return errors
  }

  submit = ({ login, username }) => {
    const { createUser, signIn } = this.props
    new Promise((resolve, reject) => {
      signIn({ login, resolve, reject })
    }).then(action => {
      this.checkIfUsernameMatch(username, action.payload.user)
    }).catch(action => {
      const { error } = action
      if (error.toLowerCase().indexOf('unauthorized') > -1) {
        new Promise((resolve, reject) => {
          createUser({
            fullName: username,
            login,
            password: 'quickblox',
            resolve,
            reject,
          })
        }).then(() => {
          this.submit({ login, username })
        }).catch(userCreateAction => {
          const { error } = userCreateAction
          if (error) {
            showError('Failed to create user account', error)
          }
        })
      } else {
        showError('Failed to sign in', error)
      }
    })
  }

  checkIfUsernameMatch = (username, user) => {
    const { updateUser } = this.props
    const update = user.fullName !== username ?
      new Promise((resolve, reject) => updateUser({
        fullName: username,
        login: user.login,
        resolve,
        reject,
      })) :
      Promise.resolve()
    update
      .then(this.connectAndRedirect)
      .catch(action => {
        if (action && action.error) {
          showError('Failed to update user', action.error)
        }
      })
  }

  connectAndRedirect = () => {
    const { connectAndSubscribe, navigation } = this.props
    connectAndSubscribe()
    navigation.navigate('Users')
  }

  renderForm = (formProps) => {
    const { handleSubmit, invalid, pristine, submitError } = formProps
    const { loading } = this.props
    const submitDisabled = pristine || invalid || loading
    const submitStyles = submitDisabled ?
      [styles.submitBtn, styles.submitBtnDisabled] :
      styles.submitBtn
    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding' })}
        style={styles.topView}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: 'center' }}
          style={styles.scrollView}
        >
          <View style={{ width: '50%' }}>
            <Header>Please enter your login and username</Header>
          </View>
          <View style={styles.formControlView}>
            <Label>Login</Label>
            <Field
              activeStyle={styles.textInputActive}
              autoCapitalize="none"
              blurOnSubmit={false}
              component={FormTextInput}
              editable={!loading}
              name="login"
              onSubmitEditing={() => this.usernameRef.focus()}
              returnKeyType="next"
              style={styles.textInput}
              textContentType="username"
              underlineColorAndroid={colors.transparent}
            />
          </View>
          <View style={styles.formControlView}>
            <Label>Username</Label>
            <Field
              activeStyle={styles.textInputActive}
              autoCapitalize="none"
              component={FormTextInput}
              editable={!loading}
              inputRef={_ref => this.usernameRef = _ref}
              name="username"
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              style={styles.textInput}
              underlineColorAndroid={colors.transparent}
            />
          </View>
          {submitError ? (
            <Label style={{ alignSelf: 'center', color: colors.error }}>
              {submitError}
            </Label>
          ) : null}
          <TouchableOpacity
            disabled={submitDisabled}
            onPress={handleSubmit}
            style={submitStyles}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} size={20} />
            ) : (
              <Text style={styles.submitBtnText}>Login</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  render() {
    return (
      <Form
        onSubmit={this.submit}
        render={this.renderForm}
        validate={this.validate}
      />
    )
  }

}