import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from './screens/welcome';

export default function App() {



  const Stack = createNativeStackNavigator();


  return (
    // <View style={styles.container}>
  



    //   <StatusBar style="auto" />

      
    //   <Welcome/>
    // </View>

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{title: 'Welcome'}}
            />
          {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
    </Stack.Navigator>
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
