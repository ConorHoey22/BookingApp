import React, { useEffect, useState } from 'react';

import { StyleSheet, View, Button, Text, Platform ,TextInput , Modal,SafeAreaView, ScrollView, TouchableOpacity, Alert , Switch} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

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

        navigation.navigate('Admin Dashboard');
        setEventOfferCreationVisible(false);
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

        // Set the eventData state with the fetched data
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

          navigation.navigate('Admin Dashboard');
          setCampOfferCreationVisible(false);
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
      navigation.navigate('Admin Dashboard');
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
        navigation.navigate('Admin Dashboard');
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
      navigation.navigate('Admin Dashboard');
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
        navigation.navigate('Admin Dashboard');
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

  const deleteCampOffer = async (index) => {
   
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const id = campOfferData[index]._id; // Assuming each camp has an '_id' property
  
      try {
        await fetch(`http://localhost:3000/api/campOffers/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
          },
        });
    
        // Remove the camp from the local state
        setCampOffersData((prevData) => {
          const newData = [...prevData];
          newData.splice(index, 1);
          return newData;
        });
      } catch (error) {
        console.error('Error removing camp:', error);
      }
    };
  
    
  

  const EditEventOffer = async () => {

    
  };

  const deleteEventOffer = async (index) => {
   
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    const id = eventOfferData[index]._id; // Assuming each event has an '_id' property

    try {
      await fetch(`http://localhost:3000/api/eventOffers/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },
      });
  
      // Remove the event from the local state
      setEventOffersData((prevData) => {
        const newData = [...prevData];
        newData.splice(index, 1);
        return newData;
      });
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  



//   DELETE OFFERS 
//   VIEW OFFERS
  

// Camp wide

// Account 


  return (
     <ScrollView>
      <View style={styles.container2}>
        <View style={styles.container}>
          
 

            {/* MENU */}
            <View style={styles.containerCard}>
       
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

            </View>


          {/* Camp Offer Create Modal  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={campOfferCreationVisible}
            onRequestClose={closeViewCampOfferModal}

          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>

                   <View style={styles.fieldRow}>
                      <Text style={styles.headerText}>Create a Camp Offer</Text>
                   </View>

                   <View style={styles.fieldRow}>
                    <Text>Camp Offer name: </Text>

                      <TextInput
                        placeholder="Enter here"
                        value={offerName}
                        onChangeText={setOfferName} />

                      <Text style={styles.validationText}>{offerNameErrorMessage}</Text>

                    </View>


                
                    <View style={styles.fieldRow}>
                      <Text>Number of Participants required:</Text>
                          <TextInput
                          placeholder="Enter here"
                          value={participantsRequired}
                          onChangeText={setParticipants} />
                      <Text style={styles.validationText}>{participantRequiredErrorMessage}</Text>
                    </View>
                    
                    <View style={styles.fieldRow}>
                      <Text>% off Booking:</Text>
                      <TextInput
                        placeholder=" Enter % here"
                        value={percentageDiscount}
                        onChangeText={setPecentageDiscount} />
                         <Text style={styles.validationText}>{discountRewardErrorMessage}</Text>
                    </View>

                    
                    <View style={styles.fieldRow}>
                      <Text>Physical Reward e.g. Jumper :</Text>
                      <TextInput
                        placeholder=" Enter here"
                        value={reward}
                        onChangeText={setReward} />
                        <Text style={styles.validationText}>{discountRewardErrorMessage}</Text>
                    </View>  

                       
                           <TouchableOpacity style={styles.button} onPress={CreateCampOffer} >
                              <Text style={styles.buttonText}>Create Camp Offer</Text>
                          </TouchableOpacity>


                          <TouchableOpacity style={styles.button} onPress={closeCampOfferCreationModal} >
                              <Text style={styles.buttonText}>Close</Text>
                          </TouchableOpacity>
                 

                
             
          </View>
        </View>
 
    
      </Modal>






          {/* Event Offer Create Modal  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={eventOfferCreationVisible}
            onRequestClose={closeViewEventCreationModal}
          >
 
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
               
                  <View style={styles.fieldRow}>
                    <Text style={styles.headerText}>Create Event Offer</Text>
                  </View>

                    <View style={styles.fieldRow}>
                      <Text>Event Offer name:</Text>
                          <TextInput
                          placeholder="Enter the name of the offer here"
                          value={offerName}
                          onChangeText={setOfferName} />
                      <Text style={styles.validationText}>{offerNameErrorMessage}</Text>
                    </View>


                    <View style={styles.fieldRow}>
                      <Text>Number of Participants required:</Text>
                          <TextInput
                          placeholder="Enter the number of participants"
                          value={participantsRequired}
                          onChangeText={setParticipants} />
                      <Text style={styles.validationText}>{participantRequiredErrorMessage}</Text>
                    </View>
                    
                    <View style={styles.fieldRow}>
                      <Text>% off Booking:</Text>
                      <TextInput
                        placeholder=" Enter number of percentage"
                        value={percentageDiscount}
                        onChangeText={setPecentageDiscount} />
                         <Text style={styles.validationText}>{discountRewardErrorMessage}</Text>
                    </View>

                    <View style={styles.fieldRow}>
                      <Text>Physical Reward e.g. Jumper :</Text>
                      <TextInput
                        placeholder=" Enter the Reward here"
                        value={reward}
                        onChangeText={setReward} />
                         <Text style={styles.validationText}>{discountRewardErrorMessage}</Text>
                    </View>     
                         
                    <View style={styles.fieldRow}>
                          <TouchableOpacity style={styles.button} onPress={CreateEventOffer} >
                              <Text style={styles.buttonText}>Create Event Offer</Text>
                          </TouchableOpacity>


                          <TouchableOpacity style={styles.button} onPress={closeViewEventCreationModal}>
                              <Text style={styles.buttonText}>Close</Text>
                          </TouchableOpacity>
                    </View>

                
           
            </View>
      

        </View>

   
      </Modal>






          {/* Camp Offers View Modal */}
          <Modal
              animationType="slide"
              transparent={true}
              visible={campOfferViewVisible}
              onRequestClose={closeViewCampOfferModal}

            >
              {/* <ScrollView> */}
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>

                  <View style={styles.containerGap}></View>
                  <View style={styles.containerGap}></View>
                      <TouchableOpacity style={styles.button} onPress={closeViewCampOfferModal}>
                        <View style={styles.buttonContent}>
                          <Ionicons name="close-circle-outline" size={20} style={styles.icon} color="#ecf0ff" />
                        </View>
                      </TouchableOpacity>
         

                      <View style={styles.containerGap}></View>
                      <ScrollView>
       
                         {campOfferData.map((campOffer, index) => (
                          <View key={index} style={styles.containerCardBooking}>  
                            
                            <View style={styles.fieldContent}>
                              <Text>Offer Name: {campOffer.offerName}</Text>
                            </View>
                                    
                            <View style={styles.fieldContent}>
                              <Text>Discount % : {campOffer.percentageDiscount}</Text>
                            </View>

                            <View style={styles.fieldContent}>
                              <Text>Reward : {campOffer.reward}</Text>
                            </View>
                      
                            <View style={styles.fieldContent}>
                              <Text>Activate Camp Offer: </Text>
                              <Switch
                                trackColor={{false: '#767577', true: '#81b0ff'}}
                                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch(campOffer._id , index)} // Pass a callback function
                                value={isEnabledStates[index]} // Set the value based on isEnabled
                              />
                            </View>

                            <View style={styles.fieldContent}>
                              <TouchableOpacity style={styles.button} onPress={() => deleteCampOffer(index)}>
                                <Text style={styles.buttonText}>Delete Offer</Text>
                              </TouchableOpacity>
                            </View>

                   

                          </View>
                        ))}
                   
                 
              
                              
                    </ScrollView>
                  </View>
                </View>
              {/* </ScrollView>  */}
        
            </Modal>
            

          {/* Event Offers View Modal */}
          <Modal
              animationType="slide"
              transparent={true}
              visible={eventOfferViewVisible}
              onRequestClose={closeViewEventOfferModal}

            >
              <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.containerGap}></View>
                <View style={styles.containerGap}></View>
                    
                    <TouchableOpacity style={styles.button} onPress={closeViewEventOfferModal}>
                        <View style={styles.buttonContent}>
                          <Ionicons name="close-circle-outline" size={20} style={styles.icon} color="#ecf0ff" />
                        </View>
                      </TouchableOpacity>

              <View style={styles.containerGap}></View>

 
                 <ScrollView>

                         {eventOfferData.map((eventOffer, index) => (
                          <View key={index} style={styles.containerCardBooking}>  
                            
                            <View style={styles.fieldContent}>
                               <Text>Offer Name: {eventOffer.offerName}</Text>
                            </View>

                            <View style={styles.fieldContent}>
                               <Text>Discount % :  {eventOffer.percentageDiscount}</Text>
                            </View>
                           
                            <View style={styles.fieldContent}>
                              <Text>Reward : {eventOffer.reward}</Text>
                            </View>
                 
                      
                            <View style={styles.fieldContent}>
                              <Text>Activate Event Offer: </Text>
                              <Switch
                                trackColor={{false: '#767577', true: '#81b0ff'}}
                                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleEventSwitch(eventOffer._id , index)} // Pass a callback function
                                value={isEnabledEventStates[index]} // Set the value based on isEnabled
                              />
                            </View>



                            <View style={styles.fieldContent}>
                              <TouchableOpacity style={styles.button} onPress={() => deleteEventOffer(index)}>
                                <Text style={styles.buttonText}>Delete Offer</Text>
                              </TouchableOpacity>
                            </View>

                   

                          </View>
                        ))}

                  </ScrollView>      
           
               
          
                  </View>
                </View>
      

            </Modal>
            
            </View>
        </View>
    </ScrollView>

 

    
  );
};


const styles = StyleSheet.create({
  ontainer: {
    flex: 1,
   
    width:'100%'
  }, 
  headerContainer: {
    marginTop:80,
    marginBottom:10
  }, 
  containerCardBooking: {
    borderWidth: 1,
    borderColor: '#00e3ae',
    borderRadius: 10,
    padding: 30,
    paddingTop: 5,
    marginBottom:10,
    width: 'auto',
    backgroundColor: 'white',
  },



  containerCard: {
    borderWidth: 8,
    borderColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    margin: 0,
    marginBottom:100,
    width: '80%',
    backgroundColor: '#ecf0ff',
    marginTop:200
  },  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ecf0ff',
    padding: 50,
    borderColor: '#ffffff',
    borderRadius: 30,
    width: '80%',
    borderWidth: 8,
  },

  button: {
  
    borderRadius: 10,
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 2,
    zIndex: 2, // Ensure dropdown is above other elements

  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    
    
  },
  BookingOptionsContainer:{
    marginTop:10,
    marginBottom:10
  },
  BookingOptionsText:{
    marginTop:5,
    marginBottom:5
  },

  BookingButtons:{
    marginTop:1,
  },
  BookingOptionsContainerLine:{
   
    borderColor:'grey',
    borderWidth:0.3
  },

  headerText:{
    color: 'black',
    fontSize: 14,
    fontWeight:'bold'

  },


  contentPosition:{
    marginTop:100
  },
 

  containerCardAttendance: {
    borderWidth: 2,
    borderColor: '#ffffff',
  
   
    flexWrap: 'wrap', // Ensure text wraps if too long
  
    width: '100%',
    backgroundColor: '#ecf0ff',
  },  
  validationText: {
    fontSize: 12,
    marginBottom: 10,
    color: 'red',
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  containerTextInput:{
    flex: 1,
    marginTop:70,
    marginBottom:-30,
  },
  icon :{
    color: '#00e3ae',
  },
  container2:{
  
    flex: 1,
    width: '100%', // Width of the container (adjust as needed)
    height: '100%', // Height of the container (adjust as needed)
    
    backgroundColor: '#ecf0ff',
    alignItems: 'center',
    justifyContent: 'center',


  },
  
  containerGap:{

    marginBottom:10
  
  },

  containerCardAttendanceGap:{
  
    marginBottom:10,

  
  },
  DateSelectionContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    width:'100%'
  },

  fieldRow:{
    flexDirection: 'column', // Display items in a row

    marginTop: 20,
    marginLeft:-10
    // paddingVertical: 20,


  }, 
  fieldContent: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'center',

  },

  formValidation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
});
export default CreateAnOffer;