import React from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'uuid';
import { Constants, ImagePicker, Permissions } from 'expo';
import ApiKeys from './constants/ApiKeys';
import * as firebase from 'firebase'; //npm install --save firebase
 // ref https://github.com/expo/firebase-storage-upload-example/blob/master/App.js


export default class App extends React.Component {


  constructor(props){
      super(props);
      state = {
        image: null,
        uploading: false,
      };
    
     if(!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig);}
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };


  render() {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <Button
          onPress={this._pickImage}
          title="Pick an image from camera roll"
        />

        </View>
     
    );
  }
}

async function uploadImageAsync(uri) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());

  const snapshot = await ref.put(blob);
  return snapshot.downloadURL;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
