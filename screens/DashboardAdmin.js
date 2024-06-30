import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DashboardAdmin = ({navigation}) => {
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

    navigation.navigate('Login');
  };

  
  const handleCreateAnEventBtn = async () => {

    navigation.navigate('Create an Event');
  };


  const handleCreateACampBtn = async () => {

    navigation.navigate('Create a Camp');
  };

  const handleManageBookings = async () => {

    navigation.navigate('Manage Bookings');
  };


  const handleCreateAnOffer = async () => {

    navigation.navigate('Create an Offer');
  };



  return (
   

    <View>
      <Text>Dashboard Admin: </Text>
      
        <Button title='Create an Event' onPress={handleCreateAnEventBtn}/>
        <Button title='Create a Camp' onPress={handleCreateACampBtn} />
        <Button title='Manage Bookings' onPress={handleManageBookings} />
        <Button title='Create / View an Offer' onPress={handleCreateAnOffer} />


     
    </View>
  );
};

export default DashboardAdmin;

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
