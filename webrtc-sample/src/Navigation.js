import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import CheckAuth from './containers/CheckAuth'
import Login from './containers/Auth/Login'
import CheckConnection from './containers/CheckConnection'
import Users from './containers/Users'
import CallScreen from './containers/CallScreen'
import Info from './containers/Info'
import { navigationHeader } from './theme'

const AppNavigator = createSwitchNavigator({
  CheckAuth,
  Auth: createStackNavigator({
    Login,
    Info,
  }, {
    initialRouteName: 'Login',
    defaultNavigationOptions: navigationHeader,
  }),
  WebRTC: createSwitchNavigator({
    CheckConnection,
    CallScreen,
    Main: createStackNavigator({
      Users,
      Info,
    }, {
      initialRouteName: 'Users',
      defaultNavigationOptions: navigationHeader,
    })
  }, {
    initialRouteName: 'CheckConnection'
  })
}, {
  initialRouteName: 'CheckAuth'
})

export default createAppContainer(AppNavigator)
