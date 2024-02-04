import React, { useState } from 'react';
import {StyleSheet, View, TextInput, Button,Text } from 'react-native';
import validator from 'validator';





const SignUp = () => {

return(
<View>
  <Text>Sign up </Text>
</View>
);

}


export default SignUp;
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18, // Add a fontSize to make sure it's visible
  },
});
  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     backgroundColor: '#fff',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
  // });

  //   const [email, setEmail] = useState('');
  //   const [fullName, setFullName] = useState('');
  //   const [password, setPassword] = useState('');
  //   const [emailErrorMessage , setEmailErrorMessage] = useState('');
  //   const [errorMessage , setErrorMessage] = useState('');
  //   const [fullNameErrorMessage , setFullNameErrorMessage] = useState('');
  //   const [passwordErrorMessage , setPasswordErrorMessage] = useState('');
  
  
  
  //   const handleSave = async () => {
  
  //     const emptyFullName = /^\s*$/.test(fullName);
      
  //       // Check that email +  Fullname before then is valid before proceedding with POST request -  BUG ON submittion before the user enters a password
  
  //     // bug now with no valiadation appearing? 
  //       if (validator.isEmail(email))
  //       {
  //         setEmailErrorMessage(''); // Clear validation 
  //         setErrorMessage('');
  //         if(!emptyFullName) {
  
  //           //Valid entry 
  //           console.log('gg');
  
  //           //Valid Entry - No error message needed
  //           setEmailErrorMessage('');
  //           setFullNameErrorMessage('');
  //           setErrorMessage('');
  
  //           // Define password criteria
  //           const minLength = 8;
  //           const hasUppercase = /[A-Z]/.test(password);
  //           const hasLowercase = /[a-z]/.test(password);
  //           const hasDigit = /\d/.test(password);
  //           const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
  
  //           // Check if the password meets the criteria
  //           if(password.length >= minLength && hasUppercase && hasLowercase &&hasDigit && hasSpecialChar)
  //           {
  //             console.log("Valid password")
  //             //Valid Entry - No error message needed
  //             setEmailErrorMessage('');
  //             setFullNameErrorMessage('');
  //             setPasswordErrorMessage('');
  //             setErrorMessage('');
  
  //             try{ 
  
  //                 const apiUrl = 'http://localhost:3000/api/signup'; // Update with your actual server endpoint - THis will need update in Production
  //                 const response = await fetch(apiUrl, {
  //                   method: 'POST',
  //                   headers: {
  //                     'Content-Type': 'application/json',
  //                     // Add any additional headers if needed
  //                   },
  //                   body: JSON.stringify({email , fullName, password}),
  
  //                 });
  
  //                 if (response.ok) {
  //                   const jsonResponse = await response.json();
  //                   console.log('Response:', jsonResponse);
  //                 } else {
  //                   const errorResponse = await response.json();
  //                   console.error('Error:', errorResponse.error);
  
  //                   if (response.status === 400) {
  //                     if (errorResponse.error === 'User with this email already exists') {
  //                         setErrorMessage('Email is already registered. Please use a different email.');
  //                     } else {
  //                     //setErrorMessage('Bad request. Please check your input.');
  //                     }
  //                   } else {
  //                     setErrorMessage('An unexpected error occurred. Please try again later.');
  //                   }
  //                 }
  //               } catch (error) {
  //                 console.error('Network Error:', error.message);
  //                 setErrorMessage('Network error occurred. Please check your internet connection.');
  //               }
  
  //           }
  //           else if (password.length <= minLength){
  //             setPasswordErrorMessage("Password must be greater than 8 characters");
  //             setErrorMessage('');
  //           }
  //           else if(!hasUppercase){
  //             setPasswordErrorMessage("Password must contain an uppercase letter");
  //             setErrorMessage('');
  //           }
  //           else if(!hasLowercase){
  //             setPasswordErrorMessage("Password must have a lowercase letter  ");
  //             setErrorMessage('');
  //           }
  //           else if(!hasDigit){
  //             setPasswordErrorMessage("Password must contain a number");
  //             setErrorMessage('');
  //           }
  //           else if(!hasSpecialChar){
  //             setPasswordErrorMessage("Password must contain a special character");
  //             setErrorMessage('');
  //           }
  //           else{
  //             setPasswordErrorMessage("Password must contain a minimum of 8 character - 1 Uppercase , 1 Lowercase and includes 1 number and special character");
  //             setErrorMessage('');
  //           }
  
  //         } 
        
  //         else if(emptyFullName){ //Invalid full name validation
  //           setFullNameErrorMessage('Enter your full name');
  //           setFullName('');  //Invalid Clear entry 
  //           setErrorMessage('');
  //         }
       
  
     
  //      }
  //      else{ //Invalid email validation
  //         setEmailErrorMessage('Enter a valid email!');
  //         setEmail('');  //Invalid Clear entry 
  //         setErrorMessage('');
  //      }
  
  
  //   }
  //   return (
  //     <View styles={styles.container}>
  //     <Text>Sign Up</Text>
  //     <Text>{errorMessage}</Text>
  //     <Text>{emailErrorMessage}</Text>
  //       <TextInput
  //         placeholder="Email"
  //         value={email}
  //         onChangeText={(text) => setEmail(text)}
  //       />
  //       <Text>{passwordErrorMessage}</Text>
  //       <TextInput
  //         placeholder="Password"
  //         secureTextEntry
  //         value={password}
  //         onChangeText={(text) => setPassword(text)}
  //       />
  //       <Text>{fullNameErrorMessage}</Text>
  //       <TextInput
  //         placeholder="Full name"
  //         value={fullName}
  //         onChangeText={(text) => setFullName(text)}
  //       />
  //       <Button title="Create Account" onPress={handleSave} />
  //     </View>
  //   );
  // };
  
  // export default SignUp;
  
  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     backgroundColor: '#fff',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
  // });