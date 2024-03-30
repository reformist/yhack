import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button} from 'react-native';
import { Camera } from 'expo-camera';
import React, { useState, useEffect, useRef} from 'react';
export default function App() {

  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const[text, setText] = useState('daddy');
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

  }, []);
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      let photoUri = photo.uri;
       setText(photoUri);
    }
  };

  //TODO: this if block is a little funky, figure out hasPermission
  if (hasPermission === 'granted') {
    //return <View />; doesnt do shit? 
    <Text> i love men</Text>  //this isn't displayed
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (//cam style ... type = {type}
    <View style={styles.container}>
    <Camera style={styles.camera} ref ={cameraRef}></Camera>
    <Button title="Take Picture" onPress={takePicture} />
    <StatusBar style="auto" />
    <Text> {text} </Text>
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
    flex: 0.75,
    width: '100%',
  }
});