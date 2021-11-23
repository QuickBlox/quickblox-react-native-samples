This is a code sample for [QuickBlox](http://quickblox.com) platform. It is a great way for developers using [QuickBlox](http://quickblox.com) platform to learn how to integrate audio and video calling features into your application.

### Features
* Login/logout
* Make and receive 1-to-1 and group audio call
* Make and receive 1-to-1 and group video call
* Search for users to make a call with
* Mute/unmute the microphone
* Display a list of call participants and their statuses
* Switch speaker
* Switch camera
* Mirror local video

### Get application credentials

QuickBlox application includes everything that brings messaging right into your application - chat, video calling, users, push notifications, etc. To create a QuickBlox application, follow the steps below:

1. Register a new account following [this link](https://admin.quickblox.com/signup). Type in your email and password to sign in. You can also sign in with your Google or Github accounts.
2. Create the app clicking **New app** button.
3. Configure the app. Type in the information about your organization into corresponding fields and click **Add** button.
4. Go to **Dashboard** => **_YOUR_APP_** => **Overview** section and copy your **Application ID**, **Authorization Key**, **Authorization Secret**, and **Account Key**.


### Run Video Calling sample

1. Setup the [React Native environment](https://reactnative.dev/docs/environment-setup).
2. Clone repository with the sample.
3. Open a terminal and enter the commands below in your project path.
```bash
npm install
```
4. Extra steps for iOS: in file `ios/Podfile` change `platform` to `12`
```
platform :ios, '12.0'
```
then in terminal run
```bash
cd ios
pod install
```
5. Get **appId**, **authKey**, **authSecret**, **accountKey** from your app and put these values in `src/QBConfig.js` file .
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
6. Run the code sample.  
`react-native run-android` OR `react-native run-ios`  

Please note, processing of incoming calls in the background is not implemented in this sample. This functionality will be developed later, meanwhile, you can implement it in your way.
