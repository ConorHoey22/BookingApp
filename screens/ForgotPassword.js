import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text,TouchableOpacity,Platform, ScrollView,Modal } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ForgotPassword = ({navigation}) => {



  const [email, setEmail] = useState('');
  
  const [enteredResetPasswordCode, setEnteredResetPasswordCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [openRequestPasswordCodeModal, setOpenRequestPasswordCodeModal] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [passwordError, setPasswordErrorMessage] = useState('');
  

 
  const handlePasswordReset = async () => {
  
    if(email == "")
    {
      setEmailErrorMessage("Please enter your email!");
    }
    else
    {

      // Open Modal enter ResetPassword Code
      setOpenRequestPasswordCodeModal(true);
      
      try {
      
          // Set the API URL based on the platform
          const apiUrl =
          Platform.OS === 'ios'
            ? 'http://localhost:3000/api/sendResetPasswordCode'  // iOS simulator uses localhost
            : 'http://192.168.1.186:3000/api/sendResetPasswordCode';  // Android emulator 
          

            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({email}),
            });

            if (response.ok) {
              const jsonResponse = await response.json()
            }

          }
          catch (jsonError) {
            console.error('JSON Parsing Error:', jsonError);
          }
      }
  };



     
  const handleVerifyPasswordCode = async () => {


      try {

           // Define password criteria
           const minLength = 8;
           const hasUppercase = /[A-Z]/.test(newPassword);
           const hasLowercase = /[a-z]/.test(newPassword);
           const hasDigit = /\d/.test(newPassword);
           const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(newPassword);
      
         //Valid Password
        if(newPassword.length >= minLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar)
        {
    
            // Set the API URL based on the platform
            const apiUrlResetCode =
              Platform.OS === 'ios'
                ? 'http://localhost:3000/api/verifyResetToken' // iOS simulator uses localhost
                : 'http://192.168.1.186:3000/api/verifyResetToken';  // Android emulator 

            const response = await fetch(apiUrlResetCode, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ enteredResetPasswordCode , newPassword}),
            });
        
            if (!response.ok) {
              throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
        
            const jsonResponse = await response.json();
            console.log("Response JSON:", jsonResponse); // Log successful response

            // Open Modal enter ResetPassword Code
            setOpenRequestPasswordCodeModal(false);
            
            navigation.navigate("Login");

        }
        else
        {
     
            if (newPassword.length <= minLength){
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
    
      } catch (error) {

        setErrorMessage("Incorrect Code!");
        console.error('Request Error:', error); // Log network or other errors
      }
    };
    

  
  

   
  const closeRequestPasswordModal = async () => {
  
    // Open Modal enter ResetPassword Code
    setOpenRequestPasswordCodeModal(false);


  }


  return (

    <View style={styles.container}>
     <Text style={styles.text}>Enter your email and we will send you code!</Text>
     <Text style={styles.validationText}>{emailErrorMessage}</Text>

      
              <TextInput
                placeholder="Email:"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.text}
              />

        
   

              <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Request Password Reset</Text> 
               
              </TouchableOpacity>
    



          <Modal
              animationType="slide"
              transparent={true}
              visible={openRequestPasswordCodeModal}
              onRequestClose={closeRequestPasswordModal}
            >
              <View style={styles.modalContainer}>
                <ScrollView style={styles.modalContent}>

                  <View style = {styles.containerCard}>
              
                    <Text>Check your emails, we have sent you a code to enter below : </Text>

                    <Text style = {styles.validationText}>{errorMessage}</Text>
                    <Text style = {styles.validationText}>{passwordError}</Text>
                    <View style ={styles.checkoutBookingsLine}></View>

                    <View style= {styles.fieldRow}>

                      <TextInput
                          placeholder="Enter your reset code here:"
                          value={enteredResetPasswordCode}
                          onChangeText={(text) => setEnteredResetPasswordCode(text)}
                      />

                    </View>



                    <View style= {styles.fieldRow}>
                      <TextInput
                          placeholder="Enter your new password"
                          value={newPassword}
                          onChangeText={(text) => setNewPassword(text)}
                      />

                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleVerifyPasswordCode}>
                      <Text style={styles.buttonText}>Submit</Text> 
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.button} onPress={closeRequestPasswordModal}>
                      <Text style={styles.buttonText}>Close</Text> 
                    </TouchableOpacity>
                  </View>
                </ScrollView>

              </View>
              
          </Modal>
   
        
      </View>
 
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
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
  checkoutBookingsContainer:{
    borderWidth: 1,
    backgroundColor:'#ecf0ff',
    borderColor: '#00e3ae',
    marginBottom:10,
    borderRadius: 10, // Adjust this value for the desired curvature
  },
  checkoutBookingsLine:{
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10, 
    marginTop:10,
    marginBottom:10

  },
  containerModal: {
    flex: 1,
    backgroundColor: '#00e3ae',
    borderWidth: 1,
    borderColor: '#00e3ae',
    borderRadius: 10,
    padding: 10,
    margin: 20,
  },
  container2:{

    flex: 1,
    width: '100%', // Width of the container (adjust as needed)
    height: '100%', // Height of the container (adjust as needed)
    backgroundColor: '#ecf0ff',
    alignItems: 'center',
    justifyContent: 'center',


  },
  bookingsButtonsContainer:{
    flex: 1,
    width: '100%', // Width of the container (adjust as needed)
    height: '100%', // Height of the container (adjust as needed)
  },
  validationText: {
    fontSize: 12,
    marginBottom: 10,
    color: 'red',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
   modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 30,
      // marginTop:10,
      width: '90%',
    },
    fieldRow: {
      flexDirection: 'row',
       marginTop: 15,
       marginBottom: 10,
    },

    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerCard: {
      borderWidth: 8,
      borderColor: '#ffffff',
      borderRadius: 30,
      padding: 10,
      marginTop: 80,
      width: 'auto',
      backgroundColor: '#ecf0ff',
    },

    label: {
      // marginBottom: 5,
      fontWeight: 'bold',
    },
    textInput: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    buttonContainer:{
      marginTop: 10
    },
    button: {
 
      borderRadius: 10,
      marginTop: 30,
      paddingVertical: 15,
      alignItems: 'center',
      backgroundColor: 'black',
      borderRadius: 15,
      padding: 2,
      zIndex: 2, // Ensure dropdown is above other elements

    },

    bookingsHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // padding: 10,
      marginTop:30,
      marginBottom:10,
    },

    bookingsButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
    buttonBooking: {
      backgroundColor: 'black',
      paddingVertical: 5, // Reduced padding
      paddingHorizontal: 10, // Reduced padding
      borderRadius: 5,
      marginHorizontal: 5,
    },
   
    button1: {
      backgroundColor: '#4CAF50',
      borderRadius: 4,
      padding: 10,
      zIndex: 2, // Ensure dropdown is above other elements
      marginBottom: 5,
     
    },
    headerTextBlack:{
      color: 'black',
      fontSize: 14,
      justifyContent:'center',
      padding:5,
      marginBottom:5,
      marginTop:5
  
    },
    headerTextBlack2:{
      color: 'black',
      fontSize: 14,
      fontWeight:'bold',
      justifyContent:'center',
      padding:1,
      marginBottom:5,
      marginTop:5
  
    },
    button2: {
      backgroundColor: '#4CAF50',
      borderRadius: 4,
      padding: 10,
      zIndex: 2, // Ensure dropdown is above other elements
      marginBottom: 5,
     
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    containerd: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    dropdownContainer: {
      position: 'relative',
      marginBottom: 30, // Adjust this value as needed to prevent overlap
      zIndex: 1, // Ensure dropdown is above other elements
    },
    dropdown: {
       position: 'absolute',
      zIndex: 1, // Ensure dropdown is above other elements
      width: '100%',
    },
    
});