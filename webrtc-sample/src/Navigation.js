import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from './components/Auth/Login';
import Users from './components/Users';
import CallScreen from './components/CallScreen';
import Info from './components/Info';
import SplashScreen from './components/SplashScreen';
import {navigationHeader} from './theme';

const INIT_FAILED_MSG =
  'SDK initialization failed.\nCheck if your config is valid.';

const Stack = createNativeStackNavigator();

const AuthScreens = () => (
  <>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Info" component={Info} />
  </>
);

const LoggedInScreens = (call) => call ? (
  <Stack.Screen
    name="CallScreen"
    component={CallScreen}
    options={{headerShown: false}}
  />
) : (
  <>
    <Stack.Screen name="Users" component={Users} />
    <Stack.Screen name="Info" component={Info} />
  </>
);

export default props => (
  props.appReady ? (
    <NavigationContainer>
      <Stack.Navigator screenOptions={navigationHeader}>
        {props.loggedIn ? LoggedInScreens(props.call) : AuthScreens()}
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <SplashScreen
      message={props.appReady === false ? INIT_FAILED_MSG : undefined}
    />
  )
);
