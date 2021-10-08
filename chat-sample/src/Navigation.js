import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './components/Auth/Login';
import Dialogs from './components/Dialogs';
import DialogsCreate1 from './components/Dialogs/Create1';
import DialogsCreate2 from './components/Dialogs/Create2';
import DialogInfo from './components/Dialogs/Info';
import AddOccupants from './components/Dialogs/AddOccupants';
import Messages from './components/Messages';
import DeliveredTo from './components/Messages/DeliveredTo';
import ViewedBy from './components/Messages/ViewedBy';
import ForwardTo from './components/Messages/ForwardTo';
import ImageViewer from './components/ImageViewer';
import VideoPlayer from './components/VideoPlayer';
import Info from './components/Info';
import SplashScreen from './components/SplashScreen';
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

const ChatScreens = () => (
  <>
    <Stack.Screen name="Dialogs" component={Dialogs} />
    <Stack.Screen name="DialogsCreate1" component={DialogsCreate1} />
    <Stack.Screen name="DialogsCreate2" component={DialogsCreate2} />
    <Stack.Screen name="DialogInfo" component={DialogInfo} />
    <Stack.Screen name="AddOccupants" component={AddOccupants} />
    <Stack.Screen name="Messages" component={Messages} />
    <Stack.Screen name="DeliveredTo" component={DeliveredTo} />
    <Stack.Screen name="ViewedBy" component={ViewedBy} />
    <Stack.Screen name="ForwardTo" component={ForwardTo} />
    <Stack.Screen
      name="ImageViewer"
      component={ImageViewer}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="VideoPlayer"
      component={VideoPlayer}
      options={{headerShown: false}}
    />
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
        {props.loggedIn ? ChatScreens() : AuthScreens()}
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <SplashScreen
      message={props.appReady === false ? INIT_FAILED_MSG : undefined}
    />
  );
