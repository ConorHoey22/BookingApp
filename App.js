import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './screens/welcome';

import SignUp from './screens/signup';
import Login from './screens/login';

// Current TASK / BUG SignUP page is appearing but no content ? 

export default function App() {

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Welcome"
      component={Welcome}
      options={{ title: 'Welcome', headerShown: false }}
      />
    {/* Add more screens to your stack if needed */}
   

  </Stack.Navigator>
);


const SignUpStack = () => {
  <Stack.Navigator>
    <Stack.Screen
      name="Sign Up"
      component={SignUp}
      options={{ title: 'Sign Up', headerShown: false }}
    />
    
  </Stack.Navigator>

};


// const LoginStack = () => {
//   <Stack.Navigator>
  
// <Stack.Screen
//       name="Login"
//       component={Login}
//       options={{ title: 'Login', headerShown: false }}
//       />
    
//   </Stack.Navigator>

// };

return (
  <NavigationContainer>
    <Drawer.Navigator initialRouteName="SignUp">
      {/* <Drawer.Screen name="Home" component={HomeStack} /> */}
      <Drawer.Screen name="SignUp" component={SignUpStack} />
      {/* Add more screens to your drawer if needed */}
    </Drawer.Navigator>
  </NavigationContainer>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
