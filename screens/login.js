import React, { useState } from 'react';
import {StyleSheet, View, TextInput, Button,Text } from 'react-native';
import validator from 'validator';





const Login = () => {

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [emailErrorMessage , setEmailErrorMessage] = useState('');
    const [errorMessage , setErrorMessage] = useState('');
    const [fullNameErrorMessage , setFullNameErrorMessage] = useState('');
    const [passwordErrorMessage , setPasswordErrorMessage] = useState('');
  
  
  
    const handleSave = async () => {
  
    }

    return (
      <View styles={styles.container}>
      <Text>Login</Text>
      <Text>{errorMessage}</Text>
      <Text>{emailErrorMessage}</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text>{passwordErrorMessage}</Text>
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Text>{fullNameErrorMessage}</Text>
        <TextInput
          placeholder="Full name"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        <Button title="Sign up" onPress={handleSave} />
      </View>
    );
  };
  
  export default Login;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });