import React, { Component } from "react";
import { Button, SafeAreaView, StyleSheet, Alert, Text } from "react-native";

//Importing the installed libraries
import * as FS from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

console.log("Class loaded!")

export default class App extends Component {
    
  constructor(props) {
    super(props);

    this.state = {
      cameraRollPer: null,
      disableButton: false,
    };
  }
  async componentDidMount() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    this.setState((state, props) => {
      return {
        cameraRollPer: status === "granted",
        disableButton: false,
      };
    });
  }

  // showAlert = () =>
  //   Alert.alert(
  //     "Connection Problem",
  //     "Internet or Server Problem ",
  //     [
  //       {
  //         text: "Try Again",
  //         onPress: () => {
  //           this.resetData();
  //         },
  //         style: "cancel",
  //       },
  //     ],
  //     {
  //       cancelable: true,
  //       onDismiss: () => {
  //         this.resetData();
  //       },
  //     }
  //   );
  
  uriToBase64 = async (uri) => {
    let base64 = await FS.readAsStringAsync(uri, {
      encoding: FS.EncodingType.Base64,
    });
    return base64;
  };

  pickMedia = async () => {

    console.log("method triggered")

    this.setState((state, props) => {
      return {
        cameraRollPer: state.cameraRollPer,
        disableButton: true,
      };
    });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
    });
    if (result.cancelled) {
      return;
    }
    if (result.type == "image") {
      console.log("Image selected!")
      await this.toServer({
        type: result.type,
        base64: result.base64,
        uri: result.uri,
      });
    } else {
       /** 
      let base64 = await this.uriToBase64(result.uri);
      await this.toServer({
        type: result.type,
        base64: base64,
        uri: result.uri,
      });
      */
     console.log("ERROR!")
     console.log(result.type)
    }
  };

  toServer = async (mediaFile) => {
    let content_type = "image/jpeg"
    let url = 'https://f04b-192-31-236-2.ngrok-free.app' + '/img/image'

    let response = await FS.uploadAsync(url, mediaFile.uri, {
      headers: {
        "content-type": content_type,
      },
      httpMethod: "POST",
      uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
    });

    console.log(response.headers);
    console.log(response.body);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.cameraRollPer ? (
          <Button
            title="Pick From Gallery"
            disabled={this.state.disableButton}
            onPress={async () => {
              await this.pickMedia();
              this.setState((s, p) => {
                return {
                  cameraRollPer: s.cameraRollPer,
                  disableButton: false,
                };
              });
            }}
          />
        ) : (
          <Text>Camera Roll Permission Required ! </Text>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});