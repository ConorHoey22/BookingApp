import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';

const Login = ({ navigation }) => {

  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const handleLogin = async () => {
    //reset - error messages needed
    setEmailErrorMessage('');
    setPasswordErrorMessage('');
    setErrorMessage('');

    try {
      const apiUrl = 'http://localhost:3000/api/login'; // Update with your actual server login endpoint

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('Login Successful:', jsonResponse);
        const token = await jsonResponse.token;
        console.log('JWT Token:', token);
        navigation.navigate('DashboardCRM');


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
