import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {useNavigation } from '@react-navigation/native';




const NewPage = () => {
    const navigation = useNavigation();

    return (
        
        <View style = {StyleSheet.container}>
            <LinearGradient 
                colors={['#6BFFB8', '#2CEAA3', '#28965A']}
                start = { { x: 0.1, y: 0.15}}
                style={styles.background}
                />
            <Text> Statistics </Text>
            <Button title="Go to Shopping List" onPress={() => navigation.navigate('ShoppingList')} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    background : {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 1000,
      }
  });
  
  export default NewPage;