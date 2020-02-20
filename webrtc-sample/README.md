To run a code sample, follow the steps below:

1. Install [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/get-npm) if you don’t have it.
2. Install [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) (for iOS project only) if you don’t have it.
3. Setup the [React Native environment](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies) if you don’t have it.
4. Clone repository with the sample.
5. Register a FREE QuickBlox account at https://admin.quickblox.com/signup, then create your 1st QuickBlox app and obtain an app credential. Put `appId`, `authKey`, `authSecret` and `accountKey` in file `src/QBConfig.js`.
6. Open a terminal and enter the commands below in your project path
```bash
npm install
# if you're going to run iOS then install Pods
cd ios && pod install
```
7. Start application with `react-native run-android` or `react-native run-ios`

Please note, processing of incoming calls in the background is not implemented in this sample. This functionality will be developed later, meanwhile, you can implement it in your way.
