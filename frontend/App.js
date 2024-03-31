import React from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  console.log("App loaded");
  const [selectedImage, setSelectedImage] = React.useState(null);

  const BACKEND_URL_BASE = 'https://e2f1-192-31-236-2.ngrok-free.app';

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      uri = result.assets[0].uri;
      // console.log(uri);
      setSelectedImage(uri);
      console.log("Image loaded");
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      alert('No image selected');
      return;
    }

    const formData = new FormData();
    // Correctly append the selected image to formData
    formData.append('image', {
      uri: selectedImage,
      name: 'test.jpeg', // Assuming the image is a PNG, ensure the name has a valid image file extension
      type: 'image/jpeg', // Adjust according to the actual image type
    });

    try {
      const response = await fetch(BACKEND_URL_BASE + '/gpt/testUpload', {
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
      const responseJson = await response.json();
        console.log('Upload successful', responseJson);
    } catch (error) {
        console.error('Upload error:', error);
    }

    
    
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />

        {selectedImage && (
        <View>
            <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
            <Button title="Upload Image" onPress={uploadImage} />
        </View>
        )}

        <Button
        onPress={pickImage}
        title="Learn More"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
        />
    </View>
  );
}
