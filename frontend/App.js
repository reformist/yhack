
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingListApp from './ShoppingListApp';
import NewPage from './Statistics';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ShoppingList" component={ShoppingListApp} />
        <Stack.Screen name="Statistics" component={NewPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;