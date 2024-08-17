import React, { useState } from 'react';
import {StyleSheet, View, TextInput,Modal, Button,Text,Switch, TouchableOpacity, ScrollView } from 'react-native';
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
  const [tCsValidationErrorMessage , setTCsValidationErrorMessage] = useState(false);


  const [tcsVisibleModal , setTCsVisibleModal] = useState(false);
  const [agreeToTCs , setAgreeToTCs] = useState(false);





  const handleSave = async () => {

    const emptyFullName = /^\s*$/.test(fullName);
    
      // Check that email +  Fullname before then is valid before proceedding with POST request -  BUG ON submittion before the user enters a password


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


          if(!agreeToTCs){
            setTCsValidationErrorMessage("You must agree to the Terms & Conditions to proceed.");
            setErrorMessage('');
 
          }
    
          

          // Check if the password meets the criteria
         else if(password.length >= minLength && hasUppercase && hasLowercase &&hasDigit && hasSpecialChar)
          {

            console.log(agreeToTCs);
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
                  body: JSON.stringify({email , fullName, password, userType: 'CRM', agreeToTCs}),

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
        // } 
      
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





  const viewTCs = async () => {
    // Open Modal 

    setTCsVisibleModal(true);


  };

  const closeTCs = async () => {
    // close Modal 
    setTCsVisibleModal(false);
  };

  const toggleSwitch = () => {
    setAgreeToTCs(previousState => !previousState);
  };



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

            {/* Terms and conditions */}

                <TouchableOpacity style={styles.button} onPress={viewTCs}>
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>View T&Cs</Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.validationText}>{tCsValidationErrorMessage}</Text>
              <View style={styles.fieldRow}>
              <Text>I agree to these terms and conditions as the Parent / Guardian of the participants that may attend CF Sports Academy</Text>
      
              </View>  
               
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={agreeToTCs ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={agreeToTCs}
              />        
           
            <TouchableOpacity style={styles.button} onPress={handleSave} >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Sign Up </Text>
                <Ionicons name="person-add-outline" size={20} color="#0073e6" style={styles.icon} />
              </View>
            </TouchableOpacity>
         
          </View>
   

  
   
      
         
      

            {/* TCs View Modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={tcsVisibleModal}
              onRequestClose={closeTCs}
            >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <ScrollView>
                  
                    <TouchableOpacity style={styles.button} onPress={closeTCs} >
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  
                  <Text>Terms & Conditions</Text>
                  <Text> CF Sports Academy Mobile App - Terms and Conditions
                    Last Updated: 14th August 2024

                    1. Acceptance of Terms

                    By accessing or using the CF Sports Academy mobile application ("the App"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with these Terms, you must not use the App.

                    2. Definitions
                    * "We," "Us," "Our": Refers to CF Sports Academy.
                    * "User," "You," "Your": Refers to any individual or entity using the App.
                    * "Service": Refers to the booking and payment processing services provided through the App, as well as any additional features.
                    * "HoeyTech": Refers to the third-party developer responsible for building and maintaining the App.
                    3. User Registration
                    * Users must register an account to access certain features of the App.
                    * You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
                    4. Booking Services
                    * The App allows users to make bookings for sports camps and events offered by CF Sports Academy.
                    * All bookings are subject to availability and confirmation.
                    * We reserve the right to cancel or refuse any booking at our discretion.
                    5. Payment Processing
                    * Payments for bookings can be processed directly through the App using a third-party payment processor.
                    * By making a payment, you authorize us to charge the selected payment method for the total amount of your booking.
                    * We are not liable for any issues or delays caused by the payment processor.
                    6. Fees and Charges
                    * All fees associated with bookings and services are clearly displayed in the App.
                    * Fees may include taxes, service charges, or other applicable costs.
                    7. Refunds and Cancellations
                    * Refund Process: Refunds are not processed directly through the App. You may request a refund through the App, but submitting a refund request does not guarantee that a refund will be granted. Refund requests are primarily for administrative purposes, and the final decision on whether a refund will be issued lies with CF Sports Academy in accordance with our refund policy.
                    * Subject to Terms: Refunds and cancellations are subject to the specific terms of the service provider with whom you made the booking. We may charge a cancellation fee or withhold a portion of the payment in accordance with the provider’s policy.
                    * Timeframe: If a refund is approved, it will be processed within a reasonable timeframe, subject to the processing times of our payment processor.
                    8. User Responsibilities
                    * You agree not to misuse the App, engage in fraudulent activities, or violate any applicable laws.
                    * You are responsible for ensuring that all information provided during the booking and payment process is accurate and complete.
                    9. Third-Party Services
                    * The App may contain links to third-party services or websites. We are not responsible for the content, accuracy, or policies of these third-party services.
                    * Use of third-party services is at your own risk, and you should review their terms and conditions separately.
                    10. Data Privacy
                    * Data Collection and Purpose: CF Sports Academy collects and processes personal data, including children’s names, ages, and allergies, to ensure the safety and well-being of participants during sports camps and events. This data is used solely for organizing events, running camps, and ensuring appropriate catering and accommodations.
                    * Legal Basis for Processing: The legal basis for processing this data is the consent of the parent or legal guardian. By providing this information, you consent to its use as described in these Terms and our Privacy Policy.
                    * Data Retention: Personal data will be retained only as long as necessary to fulfill the purposes for which it was collected or as required by law. After that period, the data will be securely deleted.
                    11. Parental Consent
                    * Consent Requirement: By providing the child's name, age, and allergy information through the CF Sports Academy mobile app, you confirm that you are the parent or legal guardian of the child and consent to the collection, use, and processing of this data as outlined in these Terms and our Privacy Policy.
                    * Verification of Consent: We may require verification of your consent to ensure compliance with applicable laws, particularly regarding the collection and processing of children’s data.
                    12. Use of Children's Data
                    * Safety and Service: The data collected will be used solely to provide a safe and suitable experience for your child during sports camps and events, including ensuring appropriate activities and catering arrangements.
                    * Limited Access: Access to your child's personal data is restricted to authorized personnel who need it to perform their job duties, such as event coordinators and health and safety officers.
                    13. Role of HoeyTech
                    * App Development and Maintenance: The App has been developed and is maintained by HoeyTech. HoeyTech’s role is solely to display data within the App.
                    * Data Usage: HoeyTech does not use the data collected by the App for any purposes other than displaying it within the App.
                    * No Liability for Breaches: HoeyTech is not liable for any data breaches or security incidents that may occur as a result of third-party services being used, including those related to data storage or payment processing. While HoeyTech implements security measures within the App, the responsibility for any risks associated with third-party data storage or breaches lies with those third-party services. HoeyTech has no control over the security measures employed by these third-party providers.
                    14. Data Subject Rights
                    * Access, Rectification, and Deletion: As a parent or legal guardian, you have the right to access, modify, or request the deletion of your child's personal data. You can exercise these rights by contacting us at [Your Contact Information].
                    * Data Portability and Objection: You have the right to request the transfer of your child's personal data to another service provider (data portability) and the right to object to the processing of your child's data under certain circumstances.
                    * Data Breach Notification: In the event of a data breach that affects your child's personal data, we will notify you and the relevant authorities as required by law.
                    15. Data Security and Third-Party Storage
                    * Third-Party Database and Payment Processor: The personal data collected, including your child's name, age, and allergies, is stored securely on a third-party database. Payments for bookings are also processed through a third-party payment processor. We select third-party service providers that implement security measures, but we do not control these databases or payment systems.
                    * No Liability for Breaches: While we take reasonable steps to protect your child's data, CF Sports Academy is not responsible or liable for any data breaches, leaks, or unauthorized access that may occur within the third-party database or payment system. We do not have control over these third-party systems, and by agreeing to these Terms, you acknowledge and accept this risk.
                
                      </Text>  
                    </ScrollView>
                  </View>
                </View>

            </Modal>
   
        
      </View>

      
 
        
  ); 
};

export default SignUp;

const styles = StyleSheet.create({
  headerContainer: {
    flex:1,
    padding:40,
    marginTop:50,
    fontWeight:'bold'
  },
  headerText:{
    color: 'white',
    fontSize: 24,
    fontWeight:'bold'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',  // Ensures text and icon are vertically centered
  },


  containerCard: {
    borderWidth: 8,
    borderColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    margin: 20,
    width: 'auto',
    backgroundColor: '#ecf0ff',
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
      backgroundColor: '#ecf0ff',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    fieldRow: {
      flexDirection: 'row',
       marginTop: 15,
       marginBottom: 10,
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

    button2: {
 
      width:'100%',
      borderRadius: 10,
      marginTop: 30,
      paddingVertical: 15,
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 4,
      padding: 5,
      zIndex: 2, // Ensure dropdown is above other elements

     
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
     
    buttonWhite: {
 
      width:100,
      borderRadius: 10,
      marginTop: 30,
      paddingVertical: 15,
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 4,
      padding: 5,
      zIndex: 2, // Ensure dropdown is above other elements

     
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
  text:{
        color: 'white',
        fontSize: 18,
     
  },

  icon: {
    color: '#00e3ae', // Add spacing between icon and text
  
  },
    
  headerText2:{
    color: 'white',
    fontSize: 14,
    paddingLeft:20,
    fontWeight:'bold',
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
    container2:{
  
      flex: 1,
      width: '100%', // Width of the container (adjust as needed)
      height: '100%', // Height of the container (adjust as needed)
      backgroundColor: '#ecf0ff',
      alignItems: 'center',
      justifyContent: 'center',
  
  
    },
    buttonText:
    {
      color: 'white',
      fontSize: 14,
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