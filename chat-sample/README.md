### To run a code sample, follow the steps below:

1. Install [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/get-npm) if you don’t have it.
2. Install [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) (for iOS project only) if you don’t have it.
3. Setup the [React Native environment](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies) if you don’t have it.
4. Clone repository with the sample.
5. Open a terminal and enter the commands below in your project path.
```bash
npm install
```
extra step for iOS
```bash
cd ios
pod install
```
6. Register a FREE QuickBlox account following [this link](https://admin.quickblox.com/signup).
7. [Create a new app in the Dashboard](https://docs.quickblox.com/docs/react-native-quick-start#section-create-a-new-app-in-the-dashboard) and get **appId**, **authKey**, **authSecret**, **accountKey**. Put these values in `src/QBConfig.js` file .
```javascript
export default {
  appId: xxxxxxx,
  authKey: 'xxxxxxxxxxxxxxx',
  authSecret: 'xxxxxxxxxxxxx',
  accountKey: 'xxxxxxxxxxxx',
  apiEndpoint: '',
  chatEndpoint: '',
}
```
8. Run the code sample.  
`react-native run-android` OR `react-native run-ios`