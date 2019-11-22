import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import CheckAuth from './containers/CheckAuth'
import Login from './containers/Auth/Login'
import CheckConnection from './containers/CheckConnection'
import Dialogs from './containers/Dialogs'
import DialogsCreate1 from './containers/Dialogs/Create1'
import DialogsCreate2 from './containers/Dialogs/Create2'
import DialogInfo from './containers/Dialogs/Info'
import AddOccupants from './containers/Dialogs/AddOccupants'
import Messages from './containers/Messages'
import DeliveredTo from './containers/Messages/DeliveredTo'
import ViewedBy from './containers/Messages/ViewedBy'
import ForwardTo from './containers/Messages/ForwardTo'
import ImageViewer from './components/ImageViewer'
import VideoPlayer from './components/VideoPlayer'
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
  Chat: createSwitchNavigator({
    CheckConnection,
    Main: createStackNavigator({
      DialogsCreate1,
      DialogsCreate2,
      Dialogs,
      DialogInfo,
      AddOccupants,
      Messages,
      DeliveredTo,
      ViewedBy,
      ForwardTo,
      ImageViewer,
      VideoPlayer,
      Info,
    }, {
      initialRouteName: 'Dialogs',
      defaultNavigationOptions: navigationHeader,
    })
  }, {
    initialRouteName: 'CheckConnection'
  })
}, {
  initialRouteName: 'CheckAuth'
})

export default createAppContainer(AppNavigator)
