import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text,TouchableOpacity } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Login = ({ setIsLoggedIn , setIsAdminLoggedIn }) => {

  const navigation = useNavigation(); // Use the useNavigation hook

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
 


const handleLogin = async () => {




  // Reset error messages
  setEmailErrorMessage('');
  setPasswordErrorMessage('');
  setErrorMessage('');

  try {
    const apiUrlLogin = 'http://localhost:3000/api/login';
  

    const response = await fetch(apiUrlLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password}),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log('Login Successful:', jsonResponse);
      const token = jsonResponse.token;
      console.log('JWT Token:', token);

      // Store the token in AsyncStoragei
      await AsyncStorage.setItem('jwtToken', token);// Store token in AsyncStorage

      // Get the user ID from the response
      const userId = jsonResponse.userId; // Assuming the user ID is available in the response
      const apiUrlUser = `http://localhost:3000/api/user/${userId}`;

      const userResponse = await fetch(apiUrlUser, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        const userJsonResponse = await userResponse.json();
        console.log('User Details:', userJsonResponse);


    //   // Store the token in AsyncStoragei
    //  const setUserType =  await AsyncStorage.setItem('userType', userResponse.userType);// Store token in AsyncStorage

          if(userJsonResponse.userType == "Admin")
          {
              // Navigate to UserProfile screen
               setIsAdminLoggedIn(true);
               navigation.navigate('Admin Dashboard', { user: userJsonResponse });
          }
          else{
               // Navigate to UserProfile screen
               setIsLoggedIn(true);
               navigation.navigate('Dashboard', { user: userJsonResponse });
          }


        // // Navigate to UserProfile screen
        // navigation.navigate('DashboardCRM', { user: userJsonResponse });
      } else {
        console.error('Failed to fetch user details:', userResponse.statusText);
        // Handle error appropriately (e.g., show error message to user)
      }
    } else {
      let errorMessage = 'Invalid email or password. Please try again.';
      console.log(errorMessage);

      try {
        const errorResponse = await response.json();
        if (errorResponse && errorResponse.error) {
          errorMessage = errorResponse.error;
        }
      } catch (jsonError) {
        console.error('JSON Parsing Error:', jsonError);
      }

      console.error('Login Error:', errorMessage);
      setErrorMessage(errorMessage);
    }
  } catch (error) {
    console.error('Network Error:', error.message);
    setErrorMessage('Network error occurred. Please check your internet connection.');
  }
};

  return (

    <View style={styles.container}>

    <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Login</Text>
        <Text style={styles.validationText}>{errorMessage}</Text>
        <Text style={styles.validationText}>{emailErrorMessage}</Text>

        <TextInput
          placeholder="Email:"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.text}
        />
        <Text style={styles.validationText}>{passwordErrorMessage}</Text>
        <TextInput
          placeholder="Password:"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.text}
        />     


          </View>
   
          <View style={styles.container2}>
            <View style={styles.container}>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text> 
                <Ionicons name="log-in-outline" size={20} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
   
        
      </View>
 
        
  


 
  );
};

export default Login;

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