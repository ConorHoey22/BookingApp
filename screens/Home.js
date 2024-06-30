import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Image} from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { Ionicons } from '@expo/vector-icons';



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
      <View style={styles.headerContainer1}>
        <Image
            source={require('./assets/CFLogo.png')} // Adjust the path based on your project structure
            style={styles.logo}
            resizeMode="contain"
          />
      </View>
      <View style={styles.headerContainer2}>
          <Text style={styles.headerText}>Developed by </Text>
          <Image
            source={require('./assets/HoeyTechLogo.png')} // Adjust the path based on your project structure
            style={styles.logo1}
            resizeMode="contain"
          />

      </View>

        <View style={styles.container2}>
          <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
              <Ionicons name="log-in-outline" size={20} style={styles.icon} />
            </TouchableOpacity>
          
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>  
              <Ionicons name="person-add-outline" size={20} color="#0073e6" style={styles.icon} />
            </TouchableOpacity>
          
          </View>
        </View>

        
    </View>

        
  );
};

export default Home;

const styles = StyleSheet.create({

  headerContainer1: {
    flex:1,
    padding:10,
    marginTop:70,
    fontWeight:'bold'
  },

  headerContainer2: {
    flex:1,
    padding:10,
    marginTop:110,
    fontWeight:'bold'
  },
  headerText:{
    color: 'white',
    fontSize: 18,
    // fontWeight:'bold'
  },
  icon: {
    color: '#00e3ae', // Add spacing between icon and text
    marginRight : -10
  },
  container: {
    flex: 1,
    width: '100%', // Width of the container (adjust as needed)
    height: '10%', // Height of the container (adjust as needed)
    backgroundColor: '#00e3ae',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 150, // Adjust this value for the desired curvature
    borderBottomRightRadius: 150, // Adjust this value for the desired curvature

  },
  text:{
   
      color: 'white',
      fontSize: 18,

    
  },
  buttonText:
  {
    color: 'black',
    fontSize: 12,
    alignItems: 'center',
     justifyContent: 'center',
  },

  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    flexDirection:'row',
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    paddingVertical: 15,

    alignItems: 'center',
    justifyContent: 'center',

  },
  
 
  container2:{

    flex: 1,
    width: '100%', // Width of the container (adjust as needed)
    height: '100%', // Height of the container (adjust as needed)
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',


  },

 
  logo: {
    width: 370, // Adjust width as needed
    height: 270, // Adjust height as needed
    marginLeft: -15, // Add spacing between logo and text
    marginTop: 10,
  },
  logo1: {
    width: 270, // Adjust width as needed
    height: 270, // Adjust height as needed
    marginLeft: -10, // Add spacing between logo and text
    marginTop: -100,
  },

 
  containerText:{

    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',


  }
});