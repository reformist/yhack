import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Image, View, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { createClient } from '@supabase/supabase-js';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {useNavigation } from '@react-navigation/native';

const supabaseUrl = 'https://hxpwtuoiuaqflszxeqja.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cHd0dW9pdWFxZmxzenhlcWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE4Mjk4OTQsImV4cCI6MjAyNzQwNTg5NH0.6bnY8se-ydQ4kbuBWi6HER_FIMmb90qnn-fvTthFmBA';

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cHd0dW9pdWFxZmxzenhlcWphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMTgyOTg5NCwiZXhwIjoyMDI3NDA1ODk0fQ.PedxGu1QjrJIIe0SCWeVriiQjennx4yuvB_pd-WnlAE'

const supabase = createClient(supabaseUrl, SERVICE_KEY);

const Stack = createStackNavigator();

export default function App() {

  const navigation = useNavigation();

  console.log("App loaded");
  const [selectedImage, setSelectedImage] = React.useState(null);

  const BACKEND_URL_BASE = 'https://e2d9-192-31-236-2.ngrok-free.app';

  const [isLoading, setIsLoading] = useState(false);

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

  // Get the user's access token
  // const accessToken = supabase.auth.session()?.access_token;

  const uploadImage = async () => {
    if (!selectedImage) {
      alert('No image selected');
      return;
    }

    // const fileName = selectedImage.split('/').pop(); // infer from URI of image
    const fileName = 'image-1.'; // infer from URI of image
    const fileType = selectedImage.match(/\.(\w+)$/)?.[1];

    /**
    const formData = new FormData();
    // Correctly append the selected image to formData
    formData.append('image', {
      uri: selectedImage,
      name: 'test.jpeg', // Assuming the image is a PNG, ensure the name has a valid image file extension
      type: 'image/jpeg', // Adjust according to the actual image type
    });
    */

    const formData = new FormData();

    formData.append('files', {
      uri: Platform.OS === 'android' ? selectedImage : selectedImage.replace('file://', ''),
      name: fileName+`${fileType || 'jpg'}`,
      type: `image/${fileType || 'jpeg'}`,
    });

    // bucket cannot be found
    const { data, error } = await supabase.storage
      .from('bucket-1')
      .upload(`public/${formData._parts[0][1].name}`, formData._parts[0][1], {
        cacheControl: '3600',
        upsert: true,
        //contentType: `image/${fileType || 'jpeg'}`,
      });

    if (error) {
      console.error('Upload error:', error);
      return;
    }

    // get the public URL from the bucket
    const publicUrl = await supabase.storage
      .from('bucket-1')
      .getPublicUrl(`public/${formData._parts[0][1].name}`);

    console.log('Upload successful', publicUrl.data.publicUrl);

    /**
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
    */

    // Now, send the public URL to your backend
    const response = await fetch(BACKEND_URL_BASE + '/gpt/testUpload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: publicUrl }),
    });

    const responseData = await response.json();

    if (response.ok) { // then we go back to the shopping list app
      console.log('Success:', responseData);
      navigation.navigate('ShoppingList', { data: responseData });
    } else {
      console.error('Backend error:', responseData);
    }

    /** 
    const sendData = async () => {
    // Set loading to true before the request
    setIsLoading(true);

    try {
        // Now, send the public URL to your backend
        const response = await fetch(BACKEND_URL_BASE + '/gpt/testUpload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: publicUrl }),
        });

        const responseData = await response.json();

        if (response.ok) {
        // Success - navigate and pass the data
        console.log('Success:', responseData);
        navigation.navigate('ShoppingList', { data: responseData });
        } else {
        // Handle server errors
        console.error('Backend error:', responseData);
        }
    } catch (error) {
        // Handle any other errors
        console.error('Error:', error);
    } finally {
        // Set loading to false after the request is completed
        setIsLoading(false);
    }
    };

    sendData(); // explicitly call it?
    */
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

        {isLoading && (
            <>
            <ActivityIndicator size="large" color="#0000ff" /> {/* Customize color as needed */}
            </>
        )}

    </View>
  );
}
