/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
var Firebase = require("firebase"); //downgrade to firebase 2 and this might work, using as constructor later


import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAsPowMdiZPLZv80MHZgN5KrOxt7NQINJw",
    authDomain: "cs-tutoring-try-2.firebaseapp.com",
    databaseURL: "https://cs-tutoring-try-2.firebaseio.com",
    storageBucket: "cs-tutoring-try-2.appspot.com",
};
const firebaseApp = Firebase.initializeApp(firebaseConfig);


class CSMentorTutoring extends Component { //changed class name here from GoogleSigninSampleApp
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this._setupGoogleSignin();
  }

  render() {
    if (!this.state.user) {
      return (
        <View style={styles.container}>
          <GoogleSigninButton style={{width: 120, height: 44}} color={GoogleSigninButton.Color.Light} size={GoogleSigninButton.Size.Icon} onPress={() => { this._signIn(); }}/>
        </View>
      );
    }

    if (this.state.user) {
      return (
        <View style={styles.container}>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>Welcome {this.state.user.name}</Text>
          <Text>Your email is: {this.state.user.email}</Text>

          <TouchableOpacity onPress={() => {this._signOut(); }}>
            <View style={{marginTop: 50}}>
              <Text>Log out</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/calendar'],
        webClientId: '1032258821549-846pfsdj3nortoggko7q3ls77ujl91td.apps.googleusercontent.com', //changed from included webClientId to the one for my project given here, https://console.developers.google.com/apis/credentials?project=cstutoring-ace81
        offlineAccess: true
      });

      const user = await GoogleSignin.currentUserAsync();
      console.log(user);
      this.setState({user});
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  _signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      console.log(user);
      this.setState({user: user});
// Authenticate with using an existing OAuth 2.0 access token
//var ref = new Firebase("https://cstutoring-ace81.firebaseio.com");
//ref.authWithOAuthToken("google", GoogleSignin.getAccessToken()); //added to send auth token to firebase to register as user with server. on ios, user.accessToken is equivalent to the user.getAccessToken. Errors here for now for some reason

//Firebase 3
//terrible idea way of custome/non gmail
/* var uid = this.state.user.email;
var customToken = firebase.auth().createCustomToken(uid);
firebase.auth().signInWithCustomToken(customToken).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
*/


    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    
    .done();
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({user: null});
    })
    .done();
  }
}
//correct firebase 3 google auth
/*function onSignIn(googleUser) {
  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.getAuthResponse().id_token);
      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    } else {
      console.log('User already signed-in Firebase.');
    }
  });
} 

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}


*/


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('CSMentorTutoring', () => CSMentorTutoring); //kept this from original app instead of using AppRegistry.registerComponent('GoogleSigninSampleApp', () => GoogleSigninSampleApp);

