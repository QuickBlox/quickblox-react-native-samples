import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './components/Auth/Login';
import SplashScreen from './components/SplashScreen';
import Info from './components/Info';
import {navigationHeader} from './theme';

const INIT_FAILED_MSG =
  'SDK initialization failed.\nCheck if your config is valid.';

const Stack = createStackNavigator();

const AuthScreens = () => (
  <>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Info" component={Info} />
  </>
);

let navigation;

function setNavigator(_navigation) {
  navigation = _navigation;
}

export function getCurrentRoute() {
  return navigation ? navigation.getCurrentRoute() : undefined;
}

export default props =>
  props.appReady ? (
    <NavigationContainer ref={setNavigator}>
      <Stack.Navigator
        screenOptions={{...navigationHeader, headerBackTitleVisible: false}}>
        {AuthScreens()}
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <SplashScreen
      message={props.appReady === false ? INIT_FAILED_MSG : undefined}
    />
  );
