This is a code sample for [QuickBlox](https://quickblox.com) platform. It is a great way for developers using [QuickBlox](https://quickblox.com) platform to learn how to integrate private and group chat, add text and image attachments sending into your application.

### Features:
* Login/logout
* Send and receive message/attachment
* Create and leave a 1-to-1 and group chat
* Create a public chat
* Display users who have received/read the message
* Mark messages as read/delivered
* Send typing indicators
* List and delete chats
* Display chat history
* Display a list with chat participants
* Receive push notifications
* Subscribe/unsubscribe device to push notifications

### Get application credentials

QuickBlox application includes everything that brings messaging right into your application - chat, video calling, users, push notifications, etc. To create a QuickBlox application, follow the steps below:

1. Register a new account following [this link](https://admin.quickblox.com/signup). Type in your email and password to sign in. You can also sign in with your Google or Github accounts.
2. Create the app clicking **New app** button.
3. Configure the app. Type in the information about your organization into corresponding fields and click **Add** button.
4. Go to **Dashboard** => **_YOUR_APP_** => **Overview** section and copy your **Application ID**, **Authorization Key**, **Authorization Secret**, and **Account Key**.


### Run Chat sample

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
`npm run android` OR `npm run ios`  

**NOTE**: in order to receive push notifications you should make changes as described in [documentation](https://docs.quickblox.com/docs/react-native-push-notifications#configuration)
