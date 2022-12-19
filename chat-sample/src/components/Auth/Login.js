import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Form, Field} from 'react-final-form';
import {createSelector} from 'reselect';

import FormTextInput from '../FormTextInput';
import HeaderButton from '../HeaderButton';
import {
  authLoadingSelector,
  chatLoadingSelector,
  usersLoadingSelector,
} from '../../selectors';
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

const selector = createSelector(
  authLoadingSelector,
  chatLoadingSelector,
  usersLoadingSelector,
  (authLoading, chatLoading, usersLoading) =>
    authLoading || chatLoading || usersLoading,
);

function Login(props) {
  const {navigation} = props;

  const dispatch = useDispatch();
  const loading = useSelector(selector);
  const usernameRef = React.useRef(null);
  const submit = useSubmitHandler(dispatch);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <View style={commonStyles.headerButtonStub} />,
      headerRight: () => (
        <HeaderButton
          imageSource={images.INFO}
          onPress={() => navigation.navigate('Info')}
        />
      ),
      headerTitle: () => <Text style={styles.headerTitle}>Enter to chat</Text>,
    });
  }, [navigation]);

  const renderForm = formProps => {
    const {handleSubmit, invalid, pristine, submitError} = formProps;
    const submitDisabled = pristine || invalid || loading;
    const submitStyles = submitDisabled
      ? [styles.submitBtn, styles.submitBtnDisabled]
      : styles.submitBtn;
    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ios: 'padding'})}
        style={styles.topView}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          style={styles.scrollView}>
          <Header>Please enter your login and username</Header>
          <View style={commonStyles.formControlView}>
            <Label>Login</Label>
            <Field
              activeStyle={commonStyles.textInputActive}
              autoCapitalize="none"
              blurOnSubmit={false}
              component={FormTextInput}
              editable={!loading}
              name="login"
              onSubmitEditing={() => usernameRef.current.focus()}
              returnKeyType="next"
              style={commonStyles.textInput}
              textContentType="username"
              underlineColorAndroid={colors.transparent}
            />
          </View>
          <View style={commonStyles.formControlView}>
            <Label>Display Name</Label>
            <Field
              activeStyle={commonStyles.textInputActive}
              autoCapitalize="none"
              component={FormTextInput}
              editable={!loading}
              inputRef={usernameRef}
              name="username"
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              style={commonStyles.textInput}
              underlineColorAndroid={colors.transparent}
            />
          </View>
          {submitError ? (
            <Label style={styles.submitError}>{submitError}</Label>
          ) : null}
          <View style={styles.submitView}>
            <Pressable
              android_ripple={{color: colors.white}}
              disabled={submitDisabled}
              onPress={handleSubmit}
              style={submitStyles}>
              {loading ? (
                <ActivityIndicator color={colors.white} size={20} />
              ) : (
                <Text style={styles.submitBtnText}>Login</Text>
              )}
            </Pressable>
            {Platform.OS === 'android' ? (
              <Image
                source={images.SHADOW}
                style={
                  submitDisabled
                    ? styles.submitBtnDisabledShadow
                    : styles.submitBtnShadow
                }
              />
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

export default React.memo(Login);
