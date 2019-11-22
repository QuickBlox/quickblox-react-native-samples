import 'react-native-gesture-handler' // TODO: remove when bug will be fixed https://github.com/kmagiera/react-native-gesture-handler/issues/320
import { AppRegistry } from 'react-native';
import App from './src';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
