import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Home = ({navigation}) => {
 
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Move useState to the co


      const handleLogin = async () => {
        navigation.navigate('Login');
      };

      const handleSignUp = async () => {
        navigation.navigate('SignUp');
      };

  return (
   
        <View style={styles.container}>
          
                <View style={styles.innerContainer}>
                 <Text style={styles.text}>Booking System</Text>
                 <Button title="Login" style={styles.button} onPress={handleLogin}/>
                </View>
    
          <View style={styles.innerContainer}>
              <Button title="Sign Up" style={styles.button} onPress={handleSignUp}/>
              </View>
             </View>
        
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});