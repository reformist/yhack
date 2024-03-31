import React, { useState, useEffect } from 'react';
import {TextInput, Button, FlatList } from 'react-native';
import { StyleSheet, Text, View, SafeAreaView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {useNavigation } from '@react-navigation/native';
import axios from 'axios';
// const url = "https://jsonplaceholder.typicode.com/posts"

// console.log(fetch(url));
// const options = {
//   method: 'GET',
//   url: 'https://edamam-food-and-grocery-database.p.rapidapi.com/api/food-database/v2/parser',
//   params: {
//     'nutrition-type': 'cooking',
//     'category[0]': 'generic-foods',
//     'health[0]': 'alcohol-free'
//   },
//   headers: {
//     'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
//     'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com'
//   }
// };

// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);
// }
console.log("2");

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Banana',
    count: 3
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Orange Juice',
    count: 4
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Lemonade',
    count: 2
  },
];

const Item = ({title, count}) => { 
  return(  
    <View style={styles.tableRow}> 
    <Text style = {styles.tableCell}> {title} </Text>
    <Text style = {styles.tableCell}> x{count}</Text>
    </View> 
  ); 
} 




const ShoppingListApp = () => {
  const [items, setItems] = useState(
    DATA,
  );
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [keys, setKeys] = useState([]);

  const navigation = useNavigation();
  useEffect(() => {
    // Import or fetch the JSON file
    const importJsonData = async () => {
      try {
        const response = require("./test.json"); // Import the JSON file (local file)
        console.log(response, typeof(response))
        const data = response; // Parse the JSON data
        setJsonData(data); // Set the parsed JSON data to state
        console.log(data)
        const jsonKeys = Object.keys(data);
        setKeys(jsonKeys);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    importJsonData();
  }, []);

  // const renderItem = ({item}) => (
  //   <Item title = {item.title} />
  // )

  // console.log(renderItem(item()))

  // useEffect(() => {
  //   // const url = "https://api.adviceslip.com/advice"
    

  //   const url = 'https://api.edamam.com/api/food-database/v2/parser';
  //   // const options = { 
  //   //   method: 'GET',
  //   //   headers: {
  //   //   'X-Application-ID': 'd1f61817',
  //   //   'X-RapidAPI-Key': 'd7d62b6ccd27af22bebbd5ba25abfd8d'	,
  //   //   'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com'
  //   //   }
  //   // };

  //   const fetchData = async() => {
  //     try {
  //       const response = await fetch(url);
  //       const json = await response.text();
  //       console.log(json);
  //       // setResponse(json.slip.advice);

  //     } catch (error) {
  //       console.log("error", error)
  //     }
  //   }

  //   fetchData();

  // }, []);


  const addItem = () => {
    if (text.trim() !== '') {
      // spread syntax to update the array
      setItems([...items, { id: Math.random().toString(), title: text, count: 1 }]);
      setText('');
    }
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const decrementItem = (id) => {
    setItems(items.map(item =>
      item.id === id ? {...item, count: item.count > 1 ? item.count-1:1} : item));
  };
  // fetch('https://jsonplaceholder.typicode.com/todos/1')
  // .then(response => response.json())
  // .then(data => console.log(data));

  // const customData = require('./customData.json');
  const incrementItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? {...item, count: item.count + 1} : item ));
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#2CEAA3', '#28965A']}
        start = { { x: 0.1, y: 0.15}}
        style={styles.background}
      />
        <Text style={styles.boldText}>Shopping List</Text>
        {/* <Text style = {styles.text}> {jsonData ? keys : 'Loading...'} </Text> */}
        <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Enter item"
        />
        <Text style = {styles.text}>{response}</Text>
        <Button title="Add" onPress={addItem} />

        <FlatList
          data = {items}
          renderItem = {
            ({item}) =>
            <View style = {styles.row}>
            <Item title = {item.title} count ={item.count} />
              <View style = {[styles.button, {
                flexDirection: 'row',
              },
            ]}>
                <Button title="Remove" onPress = {() => removeItem(item.id)} />
                <Button title = "-" onPress ={() => decrementItem(item.id)} />
                <Button title = "+" onPress = {() => incrementItem(item.id)} />
              </View>
            </View>
          }
          keyExtractor = {item => item.id}
          />

        {/* {response.map((response) => {
          return renderItem(
            <View>
              {response.key}
            </View>
          ); */}
        {/* })} */}
        {/* <FlatList 
          data = {response}
          renderItem = {renderItem}
          keyExtractor = {item => item.id}
          /> */}

        {/* <Button title = "Remove" /> */}
      <Button title="Go to Statistics" onPress={() => navigation.navigate('Statistics')} />

    </View>
  );
};

const styles = StyleSheet.create({

  input: {
    height: 40,
    borderColor: 'red',
    borderWidth: 20,
    paddingLeft: 10, // Example: Adds left padding
    paddingRight: 10, // Example: Adds right padding
    borderRadius: 5, // Example: Adds border radius
    marginBottom: 10,
    fontSize: 16, // Example: Sets font size
    backgroundColor: '#f9f9f9', // Example: Sets background color
    color: 'black', // Example: Sets text color
    // You can add more styles as needed
  },

  container : {
    flex: 1,
    padding: 40,
    // backgroundColor: linear-gradient('grey', 'yellow')
  },

  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'left',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10, 
  },
  tableCell: {
    flex: 1,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 20
  },
  boldText: {
    fontSize: 38,
    fontWeight: 'bold',
    margin: 25,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  text: {
    fontSize: 38,
    margin: 10
    
  },
  input : {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    marginBottom: 10
  },

  background : {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 1000,
  },

  button : {
    flex: 1,
    padding: 20,
    
  }
})

export default ShoppingListApp;
