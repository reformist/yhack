import React from 'react';
import {Button, View} from 'react-native';
import RNFS from 'react-native-fs';

const uploadImage = async () => {
  const imagePath = RNFS.DocumentDirectoryPath + '/assets/test.png'; // Update this path

  const BACKEND_URL_BASE = 'https://8396-192-31-236-2.ngrok-free.app';

  // Here, you might need to ensure the file exists
  const fileExists = await RNFS.exists(imagePath);
  if (!fileExists) {
    console.error('File does not exist');
    return;
  }

  const url = BACKEND_URL_BASE + 'img/upload'; // Replace this with your actual endpoint
  const formData = new FormData();
  formData.append('image', {
    name: 'test.png',
    type: 'image/png',
    uri: Platform.OS === 'android' ? 'file://' + imagePath : '' + imagePath,
  });

  fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const App = () => (
  <View style={{flex: 1, justifyContent: 'center'}}>
    <Button title="Upload Image" onPress={uploadImage} />
  </View>
);

export default App;
