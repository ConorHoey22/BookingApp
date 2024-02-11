import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardCRM = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        setIsLoggedIn(!!jwtToken);
      
      } catch (error) {
        console.error('Error fetching JWT token:', error);
      }
    };

    checkAuthentication(); // Call the function to check authentication status when component mounts
  }, []); // Empty dependency array ensures the effect runs only once when component mounts



  

  const handleLogOut = async () => {
    await AsyncStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>


    <Text>Events Upcoming</Text>
    <Text>Test Camp</Text>
    

  

    


      <Button onPress={handleLogOut} title='Logout' />
    </View>
  );
};

export default DashboardCRM;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
