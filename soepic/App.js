import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isViewingPhoto, setIsViewingPhoto] = useState(false);
  const[text, setText] = useState('daddy');
 
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
        console.log(photo.uri);
        setPhotoUri(photo.uri);
        setIsViewingPhoto(true); // Update state to view photo
        console.log(photo.uri);

      } catch (error) {
        console.error(error);
      }
    } else if (isViewingPhoto) {//if viewing photo
      setIsViewingPhoto(false);
      setPhotoUri(null); 
    }
  };

  const submitPicture = async () => {
    if(!photoUri) return;

    const formData = new FormData();
    formData.append('image', {
      uri: photoUri,
      type: 'image/jpg',
      name: 'photo.jpg',
    });
    console.log("Submitting picture:", photoUri);
    setIsViewingPhoto(false);
    setPhotoUri(null);
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
      {isViewingPhoto && photoUri && (
        <Image source={{ uri: photoUri }} style={styles.photo} />
        
      )}
      <Text> { text } </Text>
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