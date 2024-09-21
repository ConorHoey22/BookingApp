import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text,TouchableOpacity,Platform } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ResetPasswordScreen = ({ setIsLoggedIn , setIsAdminLoggedIn }) => {

  const navigation = useNavigation(); // Use the useNavigation hook

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
 
  const handlePasswordReset = async () => {
    
    try {
    
        // Set the API URL based on the platform
        const apiUrl =
        Platform.OS === 'ios'
          ? 'http://localhost:3000/api/resetPassword'  // iOS simulator uses localhost
          : 'http://192.168.1.186:3000/api/resetPassword';  // Android emulator 
        

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({newPassword}),
          });

          if (response.ok) {
            const jsonResponse = await response.json()
          }

        }
        catch (jsonError) {
          console.error('JSON Parsing Error:', jsonError);
        }


  };

  return (

    <View style={styles.container}>

    <View style={styles.headerContainer}>
  

          <TextInput
            placeholder="New Password:"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.text}
          />

      
    

          </View>
   
          <View style={styles.container2}>
            <View style={styles.container}>
              <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Request Password Reset</Text> 
                <Ionicons name="log-in-outline" size={20} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
   
        
      </View>
 
        
  


 
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flex:1,
    padding:40,
    marginTop:250,
    fontWeight:'bold'
  },

  buttonText:
    {
      color: 'white',
      fontSize: 14,
      alignItems: 'center',
      justifyContent: 'center',

    },
    button:{
      flexDirection:'row',
      width: '80%',
      backgroundColor: 'black',
      borderRadius: 10,
      marginBottom: 20,
      paddingVertical: 15,
    
      alignItems: 'center',
      justifyContent: 'center',
    
    },
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

  icon: {
    color: '#00e3ae', // Add spacing between icon and text
    marginLeft :0
  },
text:{
   
      color: 'white',
      fontSize: 18,
   
},
headerText:{
      color: 'white',
      fontSize: 24,
      fontWeight:'bold'
},

  
 
  container2:{

    flex: 1,
    width: '100%', // Width of the container (adjust as needed)
    height: '100%', // Height of the container (adjust as needed)
    backgroundColor: '#ecf0ff',
    alignItems: 'center',
    justifyContent: 'center',


  },

 
  containerText:{

    flex: 1,
   


  },
  validationText: {
    fontSize: 20,
    marginBottom: 10,
    color: 'red',
  },
});