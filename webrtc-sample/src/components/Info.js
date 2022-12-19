import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';

import {getInfo} from '../actionCreators';
import {colors, navigationHeader} from '../theme';
import {useActions} from '../hooks';
import {LOGO} from '../images';
import json from '../../package.json';
import QBjson from 'quickblox-react-native-sdk/package.json';

const styles = StyleSheet.create({
  fieldText: {
    color: colors.black,
    fontSize: 17,
    lineHeight: 20,
  },
  formControlView: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  headerTitle: {
    color: colors.white,
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    color: colors.gray,
    fontSize: 13,
    paddingBottom: 7,
  },
  logoImage: {
    height: 27,
    width: 137,
  },
  logoView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    width: '100%',
  },
  safeArea: {
    backgroundColor: colors.whiteBackground,
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
});

const Label = ({children}) => <Text style={styles.label}>{children}</Text>;

const Field = ({value}) => (
  <Text numberOfLines={1} style={styles.fieldText}>
    {value}
  </Text>
);

const selector = state => ({ info: state.info });

const actions = {getSdkInfo: getInfo};

export default function Info({navigation}) {
  const {info} = useSelector(selector);
  const {getSdkInfo} = useActions(actions);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>App Info</Text>
      ),
      headerRight: () => <View style={styles.headerRight} />,
      ...navigationHeader,
    });
  }, [navigation]);

  React.useEffect(() => {
    getSdkInfo();
  }, []);

  const {
    appId = ' ',
    authKey = ' ',
    authSecret = ' ',
    accountKey = ' ',
    apiEndpoint = ' ',
    chatEndpoint = ' ',
    sdkVersion = ' ',
  } = info;
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}>
        <View style={styles.formControlView}>
          <Label>WebRTC Sample version</Label>
          <Field value={json.version} />
        </View>
        <View style={styles.formControlView}>
          <Label>React Native SDK version</Label>
          <Field value={QBjson.version} />
        </View>
        <View style={styles.formControlView}>
          <Label>QuickBlox SDK Version</Label>
          <Field value={sdkVersion} />
        </View>
        <View style={styles.formControlView}>
          <Label>Application ID</Label>
          <Field value={appId} />
        </View>
        <View style={styles.formControlView}>
          <Label>Authorization key</Label>
          <Field value={authKey} />
        </View>
        <View style={styles.formControlView}>
          <Label>Authorization secret</Label>
          <Field value={authSecret} />
        </View>
        <View style={styles.formControlView}>
          <Label>Account key</Label>
          <Field value={accountKey} />
        </View>
        <View style={styles.formControlView}>
          <Label>API endpoint</Label>
          <Field value={apiEndpoint} />
        </View>
        <View style={styles.formControlView}>
          <Label>Chat endpoint</Label>
          <Field value={chatEndpoint} />
        </View>
      </ScrollView>
      <View style={styles.logoView}>
        <Image style={styles.logoImage} source={LOGO} />
      </View>
    </SafeAreaView>
  );
}
