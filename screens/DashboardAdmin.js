import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
   
    <View style={styles.container2}>

        <View style={styles.container}>

        <View style={styles.contentPosition}>
          <Text style={styles.headerText}>Admin Dashboard</Text>
        </View>

          

          <View style={styles.containerCard}>
          <View>
            <TouchableOpacity style={styles.button} onPress={handleCreateAnEventBtn}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Create an Event  </Text>
                <Ionicons name="today-outline" size={20} style={styles.icon} color="#ecf0ff" />
              </View>
            </TouchableOpacity>
         </View>

          <View>
             <TouchableOpacity style={styles.button} onPress={handleCreateACampBtn}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Create a Camp  </Text>
                <Ionicons name="today-outline" size={20} style={styles.icon} color="#ecf0ff" />
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity style={styles.button} onPress={handleManageBookings}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Manage Bookings  </Text>
                <Ionicons name="book-outline" size={20} style={styles.icon} color="#ecf0ff" />
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity style={styles.button} onPress={handleCreateAnOffer}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Create / View an Offers </Text>
                <Ionicons name="share-social-outline" size={20} style={styles.icon} color="#ecf0ff" />
              </View>
            </TouchableOpacity>
          </View>
</View>
    
      </View>
    </View>
  );
};

export default DashboardAdmin;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Width of the container (adjust as needed)
    height: '10%', // Height of the container (adjust as needed)
    backgroundColor: '#00e3ae',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 150, // Adjust this value for the desired curvature
    borderBottomRightRadius: 150, // Adjust this value for the desired curvature

  },
  headerText:{
    color: 'white',
    fontSize: 24,
    fontWeight:'bold'
  },
  containerRow:{
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  container2:{
  
    flex: 1,
    width: '100%', // Width of the container (adjust as needed)
    height: '100%', // Height of the container (adjust as needed)
    backgroundColor: '#ecf0ff',
    alignItems: 'center',
    justifyContent: 'center',


  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerCard: {
    borderWidth: 8,
    borderColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    margin: 0,
    width: 'auto',
    backgroundColor: '#ecf0ff',
  },  
  button: {
 
    borderRadius: 10,
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 2,
    zIndex: 2, // Ensure dropdown is above other elements

  },
  
  contentPosition:{
    marginBottom:50
  },
  buttonText:
  {
    color: 'white',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',

  },
 
});
