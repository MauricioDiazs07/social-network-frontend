import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import { useEffect } from 'react';
import App from './src';
import {name as appName} from './app.json';
import store from './src/redux/store';
import { firebase } from '@react-native-firebase/app';
import { requestUserPermission, NotificationListener } from './src/utils/pushnotifications_helper';
import messaging from '@react-native-firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDn2OmB_urs8lcKRnGdpf6ZVjN37nhMVBo",
  authDomain: "influex-9f8bf.firebaseapp.com",
  projectId: "influex-9f8bf",
  storageBucket: "influex-9f8bf.appspot.com",
  messagingSenderId: "70085749849",
  appId: "1:70085749849:web:7d4d84daa744812bd49548",
  databaseURL: "https://your-database-url.firebaseio.com", 
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const RNRoot = () => {
  useEffect(()=> {
    requestUserPermission();
    NotificationListener();
}, [])

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RNRoot);
