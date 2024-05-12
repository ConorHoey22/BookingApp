import React, { useEffect, useState } from 'react';

import { StyleSheet, View, Button, Text, Platform ,TextInput , Modal,SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';




//Stripe imports
import { CardField, useStripe, StripeProvider, InitPaymentSheet , usePaymentSheet} from '@stripe/stripe-react-native';

const CreateAnOffer = ({navigation}) => {


  //Camp Offer Type Selection Modal
  const [campOfferTypeSelectionVisible, setCampOfferTypeVisible] = useState(false);



  //Camp Attendance Offer Modal
  const [campAttendanceCreationVisible, setCampAttendanceOfferVisible] = useState(false);



  //Camp Offer Modal
  const [campOfferCreationVisible, setCampOfferCreationVisible] = useState(false);


  //Error Messages 
  const [offerNameErrorMessage, setOfferErrorMessage] = useState('');
  const [participantRequiredErrorMessage, setParticipantErrorMessage] = useState('');
  const [discountRewardErrorMessage, setDiscountRewardErrorMessage] = useState('');
  const [numberOfCampsRequiredErrorMessage, setNumberOfCampsRequiredErrorMessage] = useState('');

  useEffect(() => {


 


  }, []);


  const [offerName, setOfferName] = useState('');
  const [participantsRequired, setParticipants] = useState('');
  const [percentageDiscount, setPecentageDiscount] = useState('');
  const [reward, setReward] = useState('');


 const [numberOfCampsRequired, setNumberOfCampsRequired] = useState('');


  const OpenCampOfferSelectionModal = async () => {
    setCampOfferTypeVisible(true);
    
  };

  const closeCampOfferSelectionModal = async () => {
    setCampOfferTypeVisible(false);
    
  };
 


  const closeCampOfferCreationModal = async () => {
    setCampOfferCreationVisible(false);
    
  };
 
  const GoToCampOfferCreation = async () => {
    setCampOfferTypeVisible(false);
    setCampOfferCreationVisible(true);
    
  };

  const GoToCampOfferAttendanceCreation = async () => {
    setCampOfferTypeVisible(false);
    setCampAttendanceOfferVisible(true);
  };

  const closeCampAttendanceOfferCreationModal = async () => {
    setCampAttendanceOfferVisible(false);
    
  };

  const GoToEventOfferCreation = async () => {

    
  };


  const CreateCampOffer = async () => {
  
    try {
      const apiCreateCampOffer = 'http://localhost:3000/api/createCampOffer';
      const jwtToken = await AsyncStorage.getItem('jwtToken');
  
      if (!jwtToken) {
        throw new Error('JWT token not found');
      }

      //Reset error messages
      setOfferErrorMessage("");
      setParticipantErrorMessage("");
      setDiscountRewardErrorMessage("");



      //Form Validation before User can Handle Submition
      


      //If offerName is blank
      if(offerName == "")
      {
        const errorMessage1 = "Please enter the offer name";
        setOfferErrorMessage(errorMessage1);

      }
      else if(participantsRequired == "") 
      {
        const errorMessage3 = "Please enter the number of participants required";
        setParticipantErrorMessage(errorMessage3);
     
      }
      else if(percentageDiscount == "" && reward == "") 
      {
        const errorMessage3 = "Please enter either a discount or a reward";
        setDiscountRewardErrorMessage(errorMessage3);

      }
      else {

  
        const response = await fetch(apiCreateCampOffer, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ 
            offerName, 
            participantsRequired,
            percentageDiscount,
            reward
            
            
          }),
        });
    
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log('Camp Offer Created', jsonResponse);
          navigation.navigate('DashboardAdmin');
        } else {
          console.log('Error Status:', response.status);
          console.log('Error Message:', response.statusText);
          let errorMessage = 'Unknown error occurred.';
          try {
            const jsonResponse = await response.json();
            errorMessage = jsonResponse.message || jsonResponse.error || jsonResponse.errorMessage || errorMessage;
          } catch (error) {
            errorMessage = response.statusText || errorMessage;
          }
          console.log('Error Message from JSON:', errorMessage);
        }
     } 
    }catch (error) {

        
      }

    
  };

  const ViewCampOffers = async () => {

    
  };
  const EditCampOffers = async () => {

    
  };

  const DeleteCampOffer = async () => {

    
  };

  const ViewEventOffers = async () => {

    
  };

  const EditEventOffer = async () => {

    
  };

  const DeleteEventOffer = async () => {

    
  };


//   Edit OFFERES 
//   DELETE OFFERS 
//   VIEW OFFERS
  

// Camp wide

// Account 


  return (
    
    <ScrollView style = {styles.container}>
        {/* Button to select / Create Camp Specifc offer or or Event Offer or  Create Account Offers  */}
{/* Account Rewards/Offers - IF user books into 2 or more camps -> They are eligible to claim a FREE JUMP */}
            <TouchableOpacity style={styles.button} onPress={ViewCampOffers}>
                <Text style={styles.buttonText}>View Camp Offers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={ViewEventOffers}>
                <Text style={styles.buttonText}>View Event Offers</Text>
            </TouchableOpacity>
            
            
            <TouchableOpacity style={styles.button} onPress={OpenCampOfferSelectionModal}>
                <Text style={styles.buttonText}>Create a Camp Offer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={GoToEventOfferCreation}>
                <Text style={styles.buttonText}>Create a Event Offer</Text>
            </TouchableOpacity>






          {/*  Camp Offer Selection Modal  */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={campOfferTypeSelectionVisible}
              onRequestClose={closeCampOfferSelectionModal}

            >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'column' }}>
                  <Text>Would you like to create a Camp offer or a Camp attendance reward / offer</Text>

                  <TouchableOpacity style={styles.button} onPress={GoToCampOfferCreation}>
                    <Text style={styles.buttonText}>Create a Camp Offer</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={GoToCampOfferAttendanceCreation}>
                      <Text style={styles.buttonText}>Create a Camp Attendance Offer</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={closeCampOfferSelectionModal}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>


                  
                </View>
              </View> 
            </View>

            </Modal>






          {/* Camp Attendance Offer Creation Modal  */}
          <Modal
              animationType="slide"
              transparent={true}
              visible={campAttendanceCreationVisible}
              onRequestClose={closeCampAttendanceOfferCreationModal}

            >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'column' }}>
                  <Text>Camp Attendance Offer / Reward</Text>

                  <Text>Camp Offer name:</Text>
                          <TextInput
                          placeholder="Enter the name of the offer here"
                          value={offerName}
                          onChangeText={setOfferName} />
                      <Text style={styles.validationText}>{offerNameErrorMessage}</Text>
                  


                  <View style={{ flexDirection: 'column' }}>
                      <Text>Number of Camps are required to be booked after todays date:</Text>
                          <TextInput
                          placeholder="Enter the number of camps booked requred"
                          value={numberOfCampsRequired}
                          onChangeText={setNumberOfCampsRequired} />
                      <Text style={styles.validationText}>{numberOfCampsRequiredErrorMessage}</Text>
                  <View/>


                    
                    <View style={{ flexDirection: 'column' }}>
                      <Text>% off Booking:</Text>
                      <TextInput
                        placeholder=" Enter number of percentage"
                        value={percentageDiscount}
                        onChangeText={setPecentageDiscount} />
                         <Text style={styles.validationText}>{discountRewardErrorMessage}</Text>
                    </View>

                    
                    <View style={{ flexDirection: 'column' }}>
                      <Text>Physical Reward e.g. Jumper :</Text>
                      <TextInput
                        placeholder=" Enter the Reward here"
                        value={reward}
                        onChangeText={setReward} />
                         <Text style={styles.validationText}>{discountRewardErrorMessage}</Text>
                        
                        <TouchableOpacity style={styles.button} onPress={CreateCampOffer} >
                          <Text style={styles.buttonText}>Create Camp Offer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={closeCampAttendanceOfferCreationModal}>
                          <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                  
                    </View>
                </View>
              </View> 
            </View>
            </View>

            </Modal>




          {/* Camp Offer Modal  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={campOfferCreationVisible}
            onRequestClose={closeCampOfferCreationModal}

          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'column' }}>
           


                  <Text>Camp Offers</Text>
                  <View style={{ flexDirection: 'column' }}>
                      <Text>Camp Offer name:</Text>
                          <TextInput
                          placeholder="Enter the name of the offer here"
                          value={offerName}
                          onChangeText={setOfferName} />
                      <Text style={styles.validationText}>{offerNameErrorMessage}</Text>
                    <View/>


                    <View style={{ flexDirection: 'column' }}>
                      <Text>Number of Participants required:</Text>
                          <TextInput
                          placeholder="Enter the number of participants"
                          value={participantsRequired}
                          onChangeText={setParticipants} />
                      <Text style={styles.validationText}>{participantRequiredErrorMessage}</Text>
                    <View/>
                    
                    <View style={{ flexDirection: 'column' }}>
                      <Text>% off Booking:</Text>
                      <TextInput
                        placeholder=" Enter number of percentage"
                        value={percentageDiscount}
                        onChangeText={setPecentageDiscount} />
                         <Text style={styles.validationText}>{discountRewardErrorMessage}</Text>
                    </View>

                    
                    <View style={{ flexDirection: 'column' }}>
                      <Text>Physical Reward e.g. Jumper :</Text>
                      <TextInput
                        placeholder=" Enter the Reward here"
                        value={reward}
                        onChangeText={setReward} />
                         <Text style={styles.validationText}>{discountRewardErrorMessage}</Text>
                          <TouchableOpacity style={styles.button} onPress={CreateCampOffer} >
                              <Text style={styles.buttonText}>Create Camp Offer</Text>
                          </TouchableOpacity>


                          <TouchableOpacity style={styles.button} onPress={closeCampOfferCreationModal} >
                              <Text style={styles.buttonText}>Close</Text>
                          </TouchableOpacity>
                  </View>

                
              </View>
            </View>
















      
      </View>
      </View>
      </View>
      </Modal>
            
            
    </ScrollView>

 

    
  );
};


const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 20,
    margin: 20,
    width: 'auto',
  },
  validationText: {
    fontSize: 20,
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
    buttonContainer:{
      marginTop:30
    },
    button: {
      backgroundColor: '#4CAF50',
      borderRadius: 4,
      padding: 10,
      marginBottom: 5,
      
    },
    button1: {
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

export default CreateAnOffer;