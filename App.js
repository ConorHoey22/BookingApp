import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './screens/Home';
import DashboardCRM from './screens/DashboardCRM';
import DashboardAdmin from './screens/DashboardAdmin';
import SignUp from './screens/SignUp';
import Login from './screens/Login';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        setIsLoggedIn(!!jwtToken);
        console.log("token");
      } catch (error) {
        console.error('Error fetching JWT token:', error);
      }
    };

    checkAuthentication(); // Call the function to check authentication status when component mounts
  }, []); // Empty dependency array ensures the effect runs only once when component mounts

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'DashboardCRM' : 'Home'}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="DashboardCRM" component={DashboardCRM} />
        <Stack.Screen name="DashboardAdmin" component={DashboardAdmin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    marginBottom: 20, // Adjust the value to control the space between the inner containers
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});
