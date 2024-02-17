import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
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
    // <View style={styles.container}>

    //       <Text>Events Upcoming</Text>

    //       <Text>Test Camp - Date {testdate} - Time {time} </Text>

    //       <Text>Book a 1 to 1 Training Session - Date {testdate} - Time {time} </Text>
        




    //       <Button title='Book a Birthday'/>

    //       <Button onPress={handleLogOut} title='Logout' />

    // </View>


    <View style={styles.container}>
      <Text>Event Name : </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>More Details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardCRM;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 20,
    margin: 20,
    width: 'auto',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginTop: 10,

  },
});
