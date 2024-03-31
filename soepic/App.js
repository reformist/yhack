import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, StatusBar, Platform } from 'react-native';
import { Camera } from 'expo-camera';

import {createClient} from '@supabase/supabase-js';
const superbaseUrl = 'https://hxpwtuoiuaqflszxeqja.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cHd0dW9pdWFxZmxzenhlcWphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMTgyOTg5NCwiZXhwIjoyMDI3NDA1ODk0fQ.PedxGu1QjrJIIe0SCWeVriiQjennx4yuvB_pd-WnlAE'
const supabase = createClient(superbaseUrl, SERVICE_KEY);
const BACKEND_URL_BASE = 'https://e2d9-192-31-236-2.ngrok-free.app/';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [uri, setUri] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isViewingPhoto, setIsViewingPhoto] = useState(false);
 
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady && !isViewingPhoto) { 
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setUri(photo.uri);
        setIsViewingPhoto(true); // Update state to view photo

      } catch (error) {
        console.error(error);
      }
    } else if (isViewingPhoto) {//if viewing photo
      setIsViewingPhoto(false);
      setUri(null); 
    }
  };

  const submitPicture = async () => {
    if(!uri) return; 

    let now = new Date();
    now = now.toString();
    const fileName = now.replace(':', ','); // infer from URI of image
    const fileType = uri.match(/\.(\w+)$/)?.[1];

    //formdata
    const formData = new FormData();
    formData.append('files', {
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      name: fileName+`${fileType || 'jpg'}`,
      type: `image/${fileType || 'jpeg'}`,
    });

    // bucket cannot be found
    const { data, error } = await supabase.storage
      .from('bucket-1')
      .upload(`public/${formData._parts[0][1].name}`, formData._parts[0][1], {
        cacheControl: '3600',
        upsert: true
      });

      //error handling
      if (error) {
        console.error('Upload error:', error);
        return;
      }
      
      //get the public URL from bucket
      const publicUrl = await supabase.storage
      .from('bucket-1')
      .getPublicUrl(`public/${formData._parts[0][1].name}`);
    
    console.log('Upload successful', publicUrl.data.publicUrl);
    
    //apparently this sends to backend
    const response = await fetch(BACKEND_URL_BASE + '/gpt/testUpload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: publicUrl }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('Success:', responseData);
    } else {
      console.error('Backend error:', responseData);
    }


    setIsViewingPhoto(false);
    setUri(null);
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  } else if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {!isViewingPhoto && (
        <Camera
          style={styles.camera}
          ref={cameraRef}
          onCameraReady={() => setIsCameraReady(true)}
        />
      )}
      {isViewingPhoto && uri && (
        <Image source={{ uri: uri }} style={styles.photo} />
        
      )}
      <Button
        title={isViewingPhoto ? "Retake Picture" : "Take Picture"}
        onPress={takePicture}
      />
      {isViewingPhoto && (
        <Button title = "Submit" 
        onPress={submitPicture}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '70%',
  },
  photo: {
    width: '100%',
    height: '70%',
  },
});