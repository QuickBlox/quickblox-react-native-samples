### Get application credentials

QuickBlox application includes everything that brings messaging right into your application - chat, video calling, users, push notifications, etc. To create a QuickBlox application, follow the steps below:

1. Register a new account following [this link](https://admin.quickblox.com/signup). Type in your email and password to sign in. You can also sign in with your Google or Github accounts.
2. Create the app clicking **New app** button.
3. Configure the app. Type in the information about your organization into corresponding fields and click **Add** button.
4. Go to **Dashboard** => **_YOUR_APP_** => **Overview** section and copy your **Application ID**, **Authorization Key**, **Authorization Secret**, and **Account Key**.

### Run Chat sample

1. Install [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/get-npm) if you don’t have it.
2. Install [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) (for iOS project only) if you don’t have it.
3. Setup the [React Native environment](https://reactnative.dev/docs/environment-setup) if you don’t have it.
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
6. Get **appId**, **authKey**, **authSecret**, **accountKey** from your app and put these values in `src/QBConfig.js` file .
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

**NOTE**: in order to receive push notifications you should make following changes:  
### Android
1. Set up push notifications as described in [Android Push Notifications guide](https://docs.quickblox.com/docs/android-push-notifications)
2. Put `google-services.json` to your app (in `android/app` folder)
3. Uncomment following code:  
​
`android/app/build.gradle`
```
// apply plugin: 'com.google.gms.google-services'
```
`src/NotificationService.js`
```
// import gServices from '../android/app/google-services.json'
```
### iOS
Configure push notifications as described in [iOS Push notifications guide](https://docs.quickblox.com/docs/ios-push-notifications)
