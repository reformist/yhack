import React from 'react';
import {RNCamera} from 'react-native-camera';
import {Button, View} from 'react-native';

const App = () => {
  let camera;

  const BACKEND_URL_BASE = 'https://7291-192-31-236-2.ngrok-free.app';

  const takePicture = async () => {
    if (camera) {
      const options = {quality: 0.5, base64: true};
      const data = await camera.takePictureAsync(options);

      // Here, we send the captured image to the backend
      const url = BACKEND_URL_BASE + 'img/upload'; // Replace this with your Flask backend URL
      const formData = new FormData();
      formData.append('image', {
        name: 'photo.jpg',
        type: 'image/jpeg',
        uri: data.uri,
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
    }
  };

  return (
    <View style={{flex: 1}}>
      <RNCamera
        ref={ref => {
          camera = ref;
        }}
        style={{flex: 1}}
      />
      <Button title="Capture" onPress={() => takePicture()} />
    </View>
  );
};

export default App;
