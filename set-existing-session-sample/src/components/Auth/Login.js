import React, {memo, useState, useLayoutEffect, useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Pressable,
  ScrollView,
  Button,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Form} from 'react-final-form';

import {showError, showSuccess} from '../../NotificationService';

import config from '../../QBConfig';

import FormTextInput from '../FormTextInput';
import HeaderButton from '../HeaderButton';
import {validate, useSubmitHandler} from './handlers';
import styles from './styles';
import {colors, styles as commonStyles} from '../../theme';
import images from '../../images';

const Header = ({children, style}) => (
  <View style={styles.headerView}>
    <Text style={[styles.headerText, style]}>{children}</Text>
  </View>
);

const Label = ({children, style}) => (
  <Text style={[commonStyles.label, style]}>{children}</Text>
);

import {
  changeToken,
  appStart,
  sessionGet,
  startSessionWithToken,
  loginRequest,
  logoutRequest,
} from '../../actionCreators';
import { useActions } from '../../hooks';
import { TextInput } from 'react-native-gesture-handler';

const actionCreators = {
  setupToken: changeToken,
  setupSettings: appStart,
  getSession: sessionGet,
  startWithToken: startSessionWithToken,
  login: loginRequest,
  logout: logoutRequest,
};


function Login(props) {
  const {navigation} = props;
  const dispatch = useDispatch();
  const tokenRef = useRef(null);
  const submit = useSubmitHandler(dispatch);

  const {
    setupSettings,
    getSession,
    startWithToken,
    login,
    logout,
  } = useActions(actionCreators);

  const [token, setToken] = useState('');
  const clearToken = useCallback(()=> {
    setToken('');
  }, []);
  const [loginEnabled, setLoginEnabled] = useState(false);
  const [info, setInfo] = useState('Please enter your token');

  const initSettings = useCallback(() => {
    setupSettings({
      reject: action => {
        setInfo('Settings not set: ' + action.error);
        showError('Settings not set', action.error);
      },
      resolve: result => {
        showSuccess('Settings Setted');
        setInfo('Settings Setted');
      },
    });
  }, [setupSettings]);

  const checkSession = useCallback(() => {
    getSession({
      reject: action => {
        setInfo('Session is null');
        showError('Session is null');
      },
      resolve: session => {
        if (session.payload.expirationDate) {
          showSuccess('Get Session Success');
          setInfo('Session expirationDate: ' + session.payload.expirationDate);
          return;
        }
        setInfo('Session is null');
        showError('Session is null');
      },
    });
  }, [getSession]);

  const startSession = useCallback(() => {
    if (!token) {
      return;
    }
    startWithToken({
      token: token,
      reject: action => {
        setInfo('StartWithTokenFail: ' + action.error);
        showError('StartWithTokenFail', action.error);
      },
      resolve: result => {
        setLoginEnabled(true);
        showSuccess('Start With Token Success');
        setInfo('Start With Token Success');
      },
    });
  }, [startWithToken]);
  
  const signIn = useCallback(() => {
    login({
      login: config.login,
      password: config.p,
      reject: action => {
        setInfo('Login Fail: ' + action.error);
        showError('Login Fail', action.error);
      },
      resolve: result => {
        showSuccess('Login Success');
        setInfo('Login User ID: ' + result.payload.session.userId);
      },
    });
  }, [login]);

  const signOut = useCallback(() => {
    logout({
      reject: action => {
        setInfo('Logout Fail: ' + action.error);
        showError('Logout Fail', action.error);
      },
      resolve: result => {
        showSuccess('Logout Success');
        setInfo('Logout User Success');
        setLoginEnabled(false);
      },
    });
  }, [logout]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <View style={commonStyles.headerButtonStub} />,
      headerRight: () => (
        <HeaderButton
          imageSource={images.INFO}
          onPress={() => navigation.navigate('Info')}
        />
      ),
      headerTitle: () => <Text style={styles.headerTitle}>Auth</Text>,
    });
  }, [navigation]);

  const renderForm = formProps => {
    const {handleSubmit, submitError} = formProps;
    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ios: 'padding'})}
        style={styles.topView}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          style={styles.scrollView}>
          <Header>{info}</Header>
          <View style={styles.submitView}>
            <Pressable
              android_ripple={{color: colors.white}}
              disabled={false}
              onPress={initSettings}
              style={styles.submitBtn}>
              {<Text style={styles.submitBtnText}>Init Settings</Text>}
            </Pressable>
            {Platform.OS === 'android' ? (
              <Image source={images.SHADOW} style={styles.submitBtnShadow} />
            ) : null}
          </View>
          <View style={styles.submitView}>
            <Pressable
              android_ripple={{color: colors.white}}
              disabled={false}
              onPress={checkSession}
              style={styles.submitBtn}>
              {<Text style={styles.submitBtnText}>Get Session</Text>}
            </Pressable>
            {Platform.OS === 'android' ? (
              <Image source={images.SHADOW} style={styles.submitBtnShadow} />
            ) : null}
          </View>
          <View style={commonStyles.formControlView}>
            <Label>Token</Label>
            <View style={commonStyles.textInputView}>
            <TextInput
              activeStyle={commonStyles.textInputActive}
              autoCapitalize="none"
              component={FormTextInput}
              inputRef={tokenRef}
              name="token"
              onChangeText={newToken => setToken(newToken)}
              onSubmitEditing={handleSubmit}
              // returnKeyType="done"
              style={commonStyles.textInput}
              underlineColorAndroid={colors.transparent}
              value={token}
            />
            <TouchableOpacity
              style={commonStyles.closeButtonView}
              onPress={clearToken}>
              <Image
                style={commonStyles.closeButton}
                source={images.CLOSE}
              />
            </TouchableOpacity>
            </View>
          </View>
          {submitError ? (
            <Label style={styles.submitError}>{submitError}</Label>
          ) : null}
          <View style={styles.submitView}>
            <Pressable
              android_ripple={{color: colors.white}}
              disabled={!token}
              onPress={startSession}
              style={styles.submitBtn}>
              {<Text style={styles.submitBtnText}>Start with token</Text>}
            </Pressable>
            {Platform.OS === 'android' ? (
              <Image source={images.SHADOW} style={styles.submitBtnShadow} />
            ) : null}
          </View>
          <View style={styles.submitView}>
            <Pressable
              android_ripple={{color: colors.white}}
              disabled={!loginEnabled}
              onPress={signIn}
              style={styles.submitBtn}>
              {<Text style={styles.submitBtnText}>Login</Text>}
            </Pressable>
            {Platform.OS === 'android' ? (
              <Image source={images.SHADOW} style={styles.submitBtnShadow} />
            ) : null}
          </View>
          <View style={styles.submitView}>
            <Pressable
              android_ripple={{color: colors.white}}
              disabled={false}
              onPress={signOut}
              style={styles.submitBtn}>
              {<Text style={styles.submitBtnText}>Logout</Text>}
            </Pressable>
            {Platform.OS === 'android' ? (
              <Image source={images.SHADOW} style={styles.submitBtnShadow} />
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={commonStyles.safeArea}>
      <Form onSubmit={submit} render={renderForm} validate={validate} />
    </SafeAreaView>
  );
}

export default memo(Login);
