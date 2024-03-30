import React, { useState } from 'react';
import { View, StyleSheet, Button, ActivityIndicator, Image, Text } from 'react-native';
import ImagePicker from 'react-native-image-picker/lib/commonjs';

const App = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const BACKEND_URL_BASE = 'https://7291-192-31-236-2.ngrok-free.app';

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setImageUri(source.uri);
      }
    });
  };

  const uploadImageToServer = async () => {
    if (!imageUri) return;
    setUploading(true);

    const uri = imageUri;
    const type = 'image/jpeg'; // Assuming a JPEG image, adjust as necessary
    const name = uri.split('/').pop();

    let formData = new FormData();
    formData.append('image', { uri, type, name, fileName: name }); // Include the fileName for multipart/form-data uploads

    try {
      const response = await fetch(BACKEND_URL_BASE + 'img/upload', {
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
      {uploading && <ActivityIndicator size="large" />}
      {imageUri ? (
        <View>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Button title="Upload Image" onPress={uploadImageToServer} disabled={!imageUri || uploading} />
        </View>
      ) : null}
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
