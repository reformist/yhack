import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const App = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const BACKEND_URL_BASE = 'https://f04b-192-31-236-2.ngrok-free.app';

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options)
      .then((response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          // Assuming only one image is selected
          const source = { uri: response.assets[0].uri };
          setImageUri(source.uri);
        }
      })
      .catch((error) => {
        console.log('launchImageLibrary Error: ', error);
      });
  };

  const uploadImageToServer = async () => {
    if (!imageUri) return;
    setUploading(true);

    const uri = imageUri;
    const type = 'image/jpeg'; // Assuming a JPEG image
    const name = uri.split('/').pop();

    let formData = new FormData();
    formData.append('image', { uri, type, name });

    try {
      const response = await fetch(BACKEND_URL_BASE + '/img/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseJson = await response.json();
      console.log('Upload successful', responseJson);
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Upload Image" onPress={uploadImageToServer} disabled={!imageUri} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
});

export default App;
