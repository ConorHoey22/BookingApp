import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
               navigation.navigate('DashboardAdmin', { user: userJsonResponse });
          }
          else{
               // Navigate to UserProfile screen
               setIsLoggedIn(true);
               navigation.navigate('DashboardCRM', { user: userJsonResponse });
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
      <View style={styles.innerContainer}>
        <Text style={styles.text}>Login</Text>
        <Text style={styles.validationText}>{errorMessage}</Text>
        <Text style={styles.validationText}>{emailErrorMessage}</Text>
        <TextInput
          placeholder="Enter your email here"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.validationText}>{passwordErrorMessage}</Text>
        <TextInput
          placeholder="Enter your password here"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    marginBottom: 20, // Adjust the value to control the space between the inner containers
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  validationText: {
    fontSize: 20,
    marginBottom: 10,
    color: 'red',
  },
});