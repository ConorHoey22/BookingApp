import React, { useEffect, useState } from 'react';

import { StyleSheet, View, Button, Text, Platform ,TextInput , Modal,SafeAreaView, ScrollView, TouchableOpacity, Alert , Switch} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

//Stripe imports
import { CardField, useStripe, StripeProvider, InitPaymentSheet , usePaymentSheet} from '@stripe/stripe-react-native';

const CreateAnOffer = ({navigation}) => {

  const [isEnabled, setIsEnabled] = useState(false);

// ---------- CAMP OFFER VARIABLES ----------------------

  //Array for Camp data
  const [campOfferData, setCampOffersData] = useState([]);

  //Camp Offer Modal
  const [campOfferCreationVisible, setCampOfferCreationVisible] = useState(false);
  const [campOfferViewVisible, setCampOfferViewVisible] = useState(false);

//------------------------------------------

//-------------- EVENT OFFER VARIABLES ----------------

  //Array for Event data
  const [eventOfferData, setEventOffersData] = useState([]);

  //Event Offer Modal
  const [eventOfferCreationVisible, setEventOfferCreationVisible] = useState(false);
  const [eventOfferViewVisible, setEventOfferViewVisible] = useState(false);

//-------------------------------------------




  //Error Messages 
  const [offerNameErrorMessage, setOfferErrorMessage] = useState('');
  const [participantRequiredErrorMessage, setParticipantErrorMessage] = useState('');
  const [discountRewardErrorMessage, setDiscountRewardErrorMessage] = useState('');
  
  
    // Initialize isEnabled state for each campOffer
    const [isEnabledEventStates, setIsEnabledEventStates] = useState([]);
    const [isEnabledStates, setIsEnabledStates] = useState([]);
  
  useEffect(() => {
   if (campOfferData.length > 0) {
     
        // Check camps offers isactive for the Switch toggle
        const initialStates = campOfferData.map(campOffer => campOffer.isActive);
        setIsEnabledStates(initialStates);

     }

     if (eventOfferData.length > 0) {
     
          // Check camps offers isactive for the Switch toggle
        const initialEventStates = eventOfferData.map(eventOffer => eventOffer.isActive);
        setIsEnabledEventStates(initialEventStates);
 
      }
}, [campOfferData ,eventOfferData ]); // Include campOfferData , eventOfferData as a dependency


  const [offerName, setOfferName] = useState('');
  const [participantsRequired, setParticipants] = useState('');
  const [percentageDiscount, setPecentageDiscount] = useState('');
  const [reward, setReward] = useState('');











  // -------  CAMP OFFER TOGGLE SWITCH -----------

  const toggleSwitch = (id, index) => {
    setIsEnabledStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      
      // Call ActivateCampOffer or DeactivateCampOffer based on the new state
      if (newStates[index]) {
        ActivateCampOffer(id);
      } else {
        DeactivateCampOffer(id);
      }
  
      return newStates;
    });
  };

  // -------  EVENT OFFER TOGGLE SWITCH -----------

  const toggleEventSwitch = (id, index) => {
    setIsEnabledEventStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      
      // Call ActivateCampOffer or DeactivateCampOffer based on the new state
      if (newStates[index]) {
        ActivateEventOffer(id);
      } else {
        DeactivateEventOffer(id);
      }
  
      return newStates;
    });
  };





  // ---- EVENT FUNCTIONS ----- 
  const GoToEventOfferCreation = async () => {
    setEventOfferCreationVisible(true);
    
  };

  const closeViewEventOfferModal = async () => {
    setEventOfferViewVisible(false);
};


  const closeViewEventCreationModal = async () => {
    setEventOfferCreationVisible(false);
  };


 const CreateEventOffer = async () => {
  
  try {
    const apiCreateEventOffer = 'http://localhost:3000/api/createEventOffer';
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


      const response = await fetch(apiCreateEventOffer, {
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
        console.log('Event Offer Created', jsonResponse);
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





const ViewEventOffers = async () => {

  setEventOfferViewVisible(true);


    //Get API Request - Fetch all event offers 

    const apiGetEventOffers = 'http://localhost:3000/api/getEventOffers';
    const jwtToken = await AsyncStorage.getItem('jwtToken'); 

    try {

        const response = await fetch(apiGetEventOffers, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response as JSON
        const data = await response.json();

        // Set the campData state with the fetched data
        setEventOffersData(data);


        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
        }


  
};



 //--------- CAMP OFFER FUNCTIONS ---------------------

 const closeCampOfferCreationModal = async () => {
  setCampOfferCreationVisible(false);
  
};

const GoToCampOfferCreation = async () => {
  setCampOfferCreationVisible(true);
  
};


const closeViewCampOfferModal = async () => {
    setCampOfferViewVisible(false);
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

    setCampOfferViewVisible(true);


    //Get API Request - Fetch all camps offers 

  const apiGetCampsOffers = 'http://localhost:3000/api/getCampOffers';
  const jwtToken = await AsyncStorage.getItem('jwtToken'); 
  
  try {

      const response = await fetch(apiGetCampsOffers, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the response as JSON
      const data = await response.json();

      // Set the campData state with the fetched data
      setCampOffersData(data);


      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }


    
  };

    
  const ActivateCampOffer = async (id) => {

    // API PUT - update DB - IsActive = True

    const CampOfferID = id; // Assuming each camp has an '_id' property

    try{

      const apiActivateCampOffer = `http://localhost:3000/api/ActivateCampOffer/${CampOfferID}`;
      const jwtToken = await AsyncStorage.getItem('jwtToken');
  
      if (!jwtToken) {
        throw new Error('JWT token not found');
      }
    

  
    const response = await fetch(apiActivateCampOffer, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (response.ok) {
      const jsonResponse = await response.json();

      Alert.alert("Camp offer has been activated for all Camps");
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
  } catch (error) {

    
  }

  
  };

  const DeactivateCampOffer = async (id) => {

    // API PUT - update DB - IsActive = True

      const CampOfferID = id; // Assuming each camp has an '_id' property

      try{

        const apiDeactivateCampOffer = `http://localhost:3000/api/DeactivateCampOffer/${CampOfferID}`;
        const jwtToken = await AsyncStorage.getItem('jwtToken');
    
        if (!jwtToken) {
          throw new Error('JWT token not found');
        }
      

    
      const response = await fetch(apiDeactivateCampOffer, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        const jsonResponse = await response.json();

        Alert.alert("Camp offer has been deactivated for all Camps")
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
    } catch (error) {

      
    }

  };



  // ------- EVENT  TOGGLE Functions ------------------ 

  const ActivateEventOffer = async (id) => {

    // API PUT - update DB - IsActive = True

    const EventOfferID = id; // Assuming each camp has an '_id' property

    try{

      const apiActivateEventOffer = `http://localhost:3000/api/ActivateEventOffer/${EventOfferID}`;
      const jwtToken = await AsyncStorage.getItem('jwtToken');
  
      if (!jwtToken) {
        throw new Error('JWT token not found');
      }
    

  
    const response = await fetch(apiActivateEventOffer, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (response.ok) {
      const jsonResponse = await response.json();

      Alert.alert("Event offer has been activated for all Events");
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
  } catch (error) {

    
  }

  
  };

  const DeactivateEventOffer = async (id) => {

    // API PUT - update DB - IsActive = True

      const EventOfferID = id; // Assuming each event has an '_id' property

      try{

        const apiDeactivateEventOffer = `http://localhost:3000/api/DeactivateEventOffer/${EventOfferID}`;
        const jwtToken = await AsyncStorage.getItem('jwtToken');
    
        if (!jwtToken) {
          throw new Error('JWT token not found');
        }
      

    
      const response = await fetch(apiDeactivateEventOffer, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        const jsonResponse = await response.json();

        Alert.alert("Event offer has been deactivated for all Events")
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
    } catch (error) {

      
    }

  };




  const EditCampOffers = async () => {

    
  };

  const DeleteCampOffer = async () => {

    
  };

  const EditEventOffer = async () => {

    
  };

  const DeleteEventOffer = async () => {

    
  };


//   DELETE OFFERS 
//   VIEW OFFERS
  

// Camp wide

// Account 


  return (
     <ScrollView>
          <View style = {styles.container}>

            {/* MENU */}

            <TouchableOpacity style={styles.button} onPress={ViewCampOffers}>
                <Text style={styles.buttonText}>View Camp Offers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={ViewEventOffers}>
                <Text style={styles.buttonText}>View Event Offers</Text>
            </TouchableOpacity>
            
            
            <TouchableOpacity style={styles.button} onPress={GoToCampOfferCreation}>
                <Text style={styles.buttonText}>Create a Camp Offer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={GoToEventOfferCreation}>
                <Text style={styles.buttonText}>Create a Event Offer</Text>
            </TouchableOpacity>


          {/* Camp Offer Create Modal  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={campOfferCreationVisible}
            onRequestClose={closeViewCampOfferModal}

          >
           <ScrollView>
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
      </ScrollView>
      </Modal>






          {/* Event Offer Create Modal  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={eventOfferCreationVisible}
            onRequestClose={closeViewEventCreationModal}

          >
           <ScrollView>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'column' }}>
           


                  <Text>Event Offers</Text>
                  <View style={{ flexDirection: 'column' }}>
                      <Text>Event Offer name:</Text>
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
                          <TouchableOpacity style={styles.button} onPress={CreateEventOffer} >
                              <Text style={styles.buttonText}>Create Event Offer</Text>
                          </TouchableOpacity>


                          <TouchableOpacity style={styles.button} onPress={closeViewEventCreationModal}>
                              <Text style={styles.buttonText}>Close</Text>
                          </TouchableOpacity>
                  </View>

                
              </View>
            </View>
      
         </View>
        </View>
      </View>
      </ScrollView>
      </Modal>






          {/* Camp Offers View Modal */}
          <Modal
              animationType="slide"
              transparent={true}
              visible={campOfferViewVisible}
              onRequestClose={closeViewCampOfferModal}

            >
              <ScrollView>
              <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
        
                <View style={{ flexDirection: 'column' }}>
                  <Text>Camp Offers</Text>


                         {campOfferData.map((campOffer, index) => (
                          <View key={index} style={styles.container}>  
                            
                            <Text>Camp Offers</Text>
                            <Text>{campOffer.offerName}</Text>
                            <Text>Discount % : {campOffer.percentageDiscount}</Text>
                            <Text>Reward : {campOffer.reward}</Text>
                      
                            <View style={styles.container}>
                              <Text>Activate Camp Offer</Text>
                              <Switch
                                trackColor={{false: '#767577', true: '#81b0ff'}}
                                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch(campOffer._id , index)} // Pass a callback function
                                value={isEnabledStates[index]} // Set the value based on isEnabled
                              />
                            </View>

                   

                          </View>
                        ))}
                            <TouchableOpacity style={styles.button} onPress={closeViewCampOfferModal}>
                              <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                              
                    </View>
                </View>
                </View>
              </ScrollView> 
          

            </Modal>
            

          {/* Event Offers View Modal */}
          <Modal
              animationType="slide"
              transparent={true}
              visible={eventOfferViewVisible}
              onRequestClose={closeViewEventOfferModal}

            >
              <ScrollView>
              <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
        
                <View style={{ flexDirection: 'column' }}>
                  <Text>Event Offers</Text>


                         {eventOfferData.map((eventOffer, index) => (
                          <View key={index} style={styles.container}>  
                            
                            <Text>Event Offers</Text>
                            <Text>{eventOffer.offerName}</Text>
                            <Text>Discount % : {eventOffer.percentageDiscount}</Text>
                            <Text>Reward : {eventOffer.reward}</Text>
                      
                            <View style={styles.container}>
                              <Text>Activate Event Offer</Text>
                              <Switch
                                trackColor={{false: '#767577', true: '#81b0ff'}}
                                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleEventSwitch(eventOffer._id , index)} // Pass a callback function
                                value={isEnabledEventStates[index]} // Set the value based on isEnabled
                              />
                            </View>

                   

                          </View>
                        ))}
                            <TouchableOpacity style={styles.button} onPress={closeViewEventOfferModal}>
                              <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                              
                    </View>
                </View>
                </View>
              </ScrollView> 
          

            </Modal>
            
            </View>
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