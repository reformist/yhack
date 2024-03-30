// Import necessary components from React and React Native
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const App = () => {
  // State to store the data fetched from the backend and loading state
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = 'https://ce3b-192-31-236-2.ngrok-free.app';

  useEffect(() => {
    // Function to fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch(BACKEND_URL + '/test');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Display a loading indicator while the data is being fetched
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Render the fetched data
  return (
    <View style={styles.container}>
      <Text>Data from backend:</Text>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
};

// Styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default App;
