import React from 'react';
import {useSelector} from 'react-redux';
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
import {Form, Field} from 'react-final-form';
import {createSelector} from 'reselect';

import FormTextInput from '../FormTextInput';
import HeaderButton from '../HeaderButton';
import {
  authLoadingSelector,
  chatLoadingSelector,
  usersLoadingSelector,
} from '../../selectors';
import {colors, navigationHeader} from '../../theme';
import images from '../../images';
import {validate} from './validation';
import {useSubmitHandler} from './submitHandler';
import styles from './styles';

const Header = ({children, style}) => (
  <View style={styles.headerView}>
    <Text style={[styles.headerText, style]}>{children}</Text>
  </View>
);

const Label = ({children, style}) => (
  <Text style={[styles.label, style]}>{children}</Text>
);

const selector = createSelector(
  [authLoadingSelector, chatLoadingSelector, usersLoadingSelector],
  (authLoading, chatLoading, usersLoading) => ({
    loading: authLoading || chatLoading || usersLoading
  })
);

export default function Login({navigation}) {
  const {loading} = useSelector(selector);
  const submit = useSubmitHandler();
  const usernameRef = React.useRef(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <View style={styles.headerButtonStub} />,
      headerTitle: () => (
        <Text style={styles.headerTitleText}>Enter to video chat</Text>
      ),
      headerRight: () => (
        <HeaderButton
          imageSource={images.INFO}
          onPress={() => navigation.navigate('Info')}
        />
      ),
      ...navigationHeader,
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
          <View style={styles.formControlView}>
            <Label>Login</Label>
            <Field
              activeStyle={styles.textInputActive}
              autoCapitalize="none"
              blurOnSubmit={false}
              component={FormTextInput}
              editable={!loading}
              name="login"
              onSubmitEditing={() => usernameRef.current.focus()}
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
              inputRef={usernameRef}
              name="username"
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              style={styles.textInput}
              underlineColorAndroid={colors.transparent}
            />
          </View>
          {submitError ? (
            <Label style={styles.labelError}>{submitError}</Label>
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

  return <Form onSubmit={submit} render={renderForm} validate={validate} />;
}
