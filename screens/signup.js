import React, { useState } from 'react';
import {StyleSheet, View, TextInput, Button,Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import validator from 'validator';
import { Ionicons } from '@expo/vector-icons';


//Test Cases 
//TC1 - User must enter a valid email 
//TC2 - User must enter a full name
//TC3 - User must enter a valid password
//TC4 - User cannot enter an empty email , fullname or password
//TC5 - User cannot enter an email that is already registered / exists in the DB


const SignUp = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorMessage , setEmailErrorMessage] = useState('');
  const [errorMessage , setErrorMessage] = useState('');
  const [fullNameErrorMessage , setFullNameErrorMessage] = useState('');
  const [passwordErrorMessage , setPasswordErrorMessage] = useState('');



  const handleSave = async () => {

    const emptyFullName = /^\s*$/.test(fullName);
    
      // Check that email +  Fullname before then is valid before proceedding with POST request -  BUG ON submittion before the user enters a password

    // bug now with no valiadation appearing? 
      if (validator.isEmail(email))
      {
        setEmailErrorMessage(''); // Clear validation 
        setErrorMessage('');
        if(!emptyFullName) {

          //Valid entry 
       

          //Valid Entry - No error message needed
          setEmailErrorMessage('');
          setFullNameErrorMessage('');
          setErrorMessage('');

          // Define password criteria
          const minLength = 8;
          const hasUppercase = /[A-Z]/.test(password);
          const hasLowercase = /[a-z]/.test(password);
          const hasDigit = /\d/.test(password);
          const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

          // Check if the password meets the criteria
          if(password.length >= minLength && hasUppercase && hasLowercase &&hasDigit && hasSpecialChar)
          {
            console.log("Valid password")
            //Valid Entry - No error message needed
            setEmailErrorMessage('');
            setFullNameErrorMessage('');
            setPasswordErrorMessage('');
            setErrorMessage('');

            try{ 

                const apiUrl = 'http://localhost:3000/api/signup'; // Update with your actual server endpoint - THis will need update in Production
                const response = await fetch(apiUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    // Add any additional headers if needed
                  },
                  body: JSON.stringify({email , fullName, password, userType: 'CRM'}),

                });





                if (response.ok) {
                  const jsonResponse = await response.json();
                  console.log('Response:', jsonResponse);
                  navigation.navigate('Login');

                } else {
                  const errorResponse = await response.json();
                  console.error('Error:', errorResponse.error);

                  if (response.status === 400) {
                    if (errorResponse.error === 'User with this email already exists') {
                        setErrorMessage('Email is already registered. Please use a different email.');
                    } else {
                    //setErrorMessage('Bad request. Please check your input.');
                    }
                  } else {
                    setErrorMessage('An unexpected error occurred. Please try again later.');
                  }
                }
              } catch (error) {
                console.error('Network Error:', error.message);
                setErrorMessage('Network error occurred. Please check your internet connection.');
              }

          }
          else if (password.length <= minLength){
            setPasswordErrorMessage("Password must be greater than 8 characters");
            setErrorMessage('');
          }
          else if(!hasUppercase){
            setPasswordErrorMessage("Password must contain an uppercase letter");
            setErrorMessage('');
          }
          else if(!hasLowercase){
            setPasswordErrorMessage("Password must have a lowercase letter  ");
            setErrorMessage('');
          }
          else if(!hasDigit){
            setPasswordErrorMessage("Password must contain a number");
            setErrorMessage('');
          }
          else if(!hasSpecialChar){
            setPasswordErrorMessage("Password must contain a special character");
            setErrorMessage('');
          }
          else{
            setPasswordErrorMessage("Password must contain a minimum of 8 character - 1 Uppercase , 1 Lowercase and includes 1 number and special character");
            setErrorMessage('');
          }

        } 
      
        else if(emptyFullName){ //Invalid full name validation
          setFullNameErrorMessage('Enter your full name');
          setFullName('');  //Invalid Clear entry 
          setErrorMessage('');
        }
     

   
     }
     else{ //Invalid email validation
        setEmailErrorMessage('Enter a valid email!');
        setEmail('');  //Invalid Clear entry 
        setErrorMessage('');
     }


  }
  return (

    <View style={styles.container}>

    <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Sign Up</Text>
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
            <Text style={styles.validationText}>{fullNameErrorMessage}</Text>
            <TextInput
              placeholder="Full name:"
              value={fullName}
              onChangeText={(text) => setFullName(text)}
              style={styles.text}
              
            />


          </View>
   
          <View style={styles.container2}>
            <View style={styles.container}>
              <TouchableOpacity style={styles.button} onPress={handleSave} >
                <Text style={styles.buttonText}>Sign Up</Text>
                <Ionicons name="person-add-outline" size={20} color="#0073e6" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
   
        
      </View>
 
        
  ); 
};

export default SignUp;

const styles = StyleSheet.create({
  headerContainer: {
    flex:1,
    padding:40,
    marginTop:250,
    fontWeight:'bold'
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

  icon: {
    color: '#00e3ae', // Add spacing between icon and text
    marginLeft : 5 
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

 
  containerText:{

    flex: 1,
   


  },
  validationText: {
    fontSize: 20,
    marginBottom: 10,
    color: 'red',
  },
});