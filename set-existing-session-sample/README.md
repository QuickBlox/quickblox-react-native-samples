# Overview

QuickBlox [Set existing session](https://github.com/QuickBlox/quickblox-react-native-samples/tree/set-existing-session-sample) Sample (React Native)


This is a code sample for [QuickBlox](https://quickblox.com) platform.
 It is a way for developers using [QuickBlox](https://quickblox.com) platform to test [Set existing session](https://docs.quickblox.com/docs/react-native-authentication#set-existing-session).
 Typically, a session token is stored in SDK after successful login and used for every subsequent API call.
 However, you may want to obtain and store the session on your server for better security.
 In this case, you can set application or user token into SDK using the startSessionWithToken() method, also before calling the method to get notified that the session has expired you need to add SESSION_EXPIRED listener to NativeEventEmitter.
  Don't forget to log in user if you pass the application token.
  
  
 # Set Existing Session 

### Features:
* [Initialize QuickBlox SDK without Authorization Key and Secret](https://docs.quickblox.com/docs/react-native-setup#initialize-quickblox-sdk-without-authorization-key-and-secret)
* [Set existing session with Token](https://docs.quickblox.com/docs/react-native-authentication#set-existing-session)
* [Get session](https://docs.quickblox.com/docs/react-native-authentication#get-session)
* [Login](https://docs.quickblox.com/docs/react-native-authentication#log-in-user)
* [Logout](https://docs.quickblox.com/docs/react-native-authentication#log-out-user)

### Get application credentials

QuickBlox application includes everything that brings messaging right into your application - chat, video calling, users, push notifications, etc. To create a QuickBlox application, follow the steps below:

1. Register a new account following [this link](https://admin.quickblox.com/signup). Type in your email and password to sign in. You can also sign in with your Google or Github accounts.
2. Create the app clicking **New app** button.
3. Configure the app. Type in the information about your organization into corresponding fields and click **Add** button.
4. Go to **Dashboard** => **_YOUR_APP_** => **Overview** section and copy your **Application ID** and **Account Key**.


### Run Sample

1. Setup the [React Native environment](https://reactnative.dev/docs/environment-setup).
2. Clone repository with the sample.
3. Open a terminal and enter the commands below in your project path.
```bash
npm install
```
4. Extra steps for iOS:
in terminal run
```bash
cd ios
pod install
```
5. You may don't want to store authKey and authSecret inside an application for security reasons.
 In such case, you can initialize QuickBlox SDK with applicationId and accountKey only, and store your authKey and authSecret on your backend.
 But, if so, the implementation of authentication with QuickBlox should be also moved to your backend.
 Get **appId**, **accountKey** from your app and put these values in `src/QBConfig.js` file.
```javascript
export default {
  appId: xxxxxxx,
  accountKey: 'xxxxxxxxxxxx',
  apiEndpoint: '',
  chatEndpoint: '',
  login: '',
  password: '',
}
```
6. If you are using an application token when calling the **startSessionWithToken()** enter the **login** and **password** in `src/QBConfig.js` file and use the **login()** method to update it to a user token.

7. Run the code sample.  
`npm run android` OR `npm run ios`  

8. Use the **TextInput** field to enter or update your **Existing Session Token**. 
