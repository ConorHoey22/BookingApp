
import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal,FlatList, Alert, VirtualizedList } from 'react-native';
import validator from 'validator';
import { useNavigation , useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';




const MyBookings = ({ navigation }) => {
  const [openCampList, setOpenCampList] = useState(true);
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [bookingData, setBookingData] = useState([]);
      const [campData, setCampData] = useState([]);
      const [eventData, setEventData] = useState([]);
      const [bookingCampData, setBookingCampData] = useState([]);
      const [bookingEventData, setBookingEventData] = useState([]);
      const [refundReason , setRefundReason] = useState('');
      const [fetchDataTrigger , setFetchDataTrigger] = useState(false); 
      const [bookingDetailsModalVisible, setBookingDetailsVisibleModal] = useState(false);
      const [bookingEventDetailsModalVisible, setBookingEventDetailsVisibleModal] = useState(false);

      const route = useRoute()
      const dataT = route.params?.dataTrigger;

      // View Bookings - Camps and Events
      const [viewCampBookings, setViewCampBookings] = useState(false);
      const [viewEventBookings, setViewEventBookings] = useState(false);


      // Refund Modals Variables- Options          
      const [refundReasonErrorMessage , setRefundReasonErrorMessage] = useState('');
      const [refundModalVisible, setRefundModalVisible] = useState(false);
      const [refundEventModalVisible, setRefundEventModalVisible] = useState(false);

      //Refund Confirmation Modal variables - Open / Close
  
      const [refundCampFullRefundConfirmationModalVisible, setRefundCampFullConfirmationModalVisible] = useState(false);
      const [refundEventFullRefundConfirmationModalVisible, setRefundEventFullConfirmationModalVisible] = useState(false);


      useEffect(() => {
 
        setRefundReason("");


        const checkAuthentication = async () => {
          try {
            const jwtToken = await AsyncStorage.getItem('jwtToken');
            setIsLoggedIn(!!jwtToken);
    
          
          } catch (error) {
            console.error('Error fetching JWT token:', error);
          }
        };

        

        const fetchData = async () => {
          try {
            const jwtToken = await AsyncStorage.getItem('jwtToken');
            setIsLoggedIn(!!jwtToken);
    
            // Fetch booking data
            const apiGetBookings = 'http://localhost:3000/api/getBookingRecords';
            const bookingsResponse = await fetch(apiGetBookings, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
              },
            });
            if (!bookingsResponse.ok) {
              Alert.alert("You do not have any bookings.")
              //throw new Error('Network response was not ok');
            }
            const bookingData = await bookingsResponse.json();
            setBookingData(bookingData);
          


          
    
            // Fetch and process camp data
            const apiGetCamps = 'http://localhost:3000/api/camps';
            const campsResponse = await fetch(apiGetCamps, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
              },
            });
           
            const campsData = await campsResponse.json();
            setCampData(campsData);



            // Fetch and process event data
            const apiGetEvent = 'http://localhost:3000/api/events';
            const eventResponse = await fetch(apiGetEvent, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
              },
            });
           
            const eventData = await eventResponse.json();
            setEventData(eventData);




            
          
            // Process booking data
            processBookings(bookingData, campsData ,eventData);


            if(fetchDataTrigger)
            {
              fetchData();
            }

            if(dataT)
            {
              fetchData();
            }

          } catch (error) {
              //Error Fetching

               // throw new Error('Network response was not ok');
              
          }
        };
    
        fetchData(); // Fetch data when component mounts
      }, [fetchDataTrigger]);
    
      const processBookings = (bookingData, campData, eventData) => {
        const currentDate = new Date(); // Get current date
    
        // Filter and process camp data
        const futureCamps = campData.filter(camp => {
            const campStartDate = new Date(camp.startDate);
            return campStartDate > currentDate;
        });
        setCampData(futureCamps);
    
        // Filter and process event data
        const futureEvents = eventData.filter(event => {
            const eventStartDate = new Date(event.startDate);
            return eventStartDate > currentDate;
        });
        setEventData(futureEvents);
    
        // Extract unique camp IDs from bookingData for future camps
        const uniqueCampIDs = Array.from(new Set(bookingData
            .filter(item => item.bookingType === 'Camp' && futureCamps.some(camp => camp._id === item.campID))
            .map(item => item.campID)));
    
        // Extract unique event IDs from bookingData for future events
        const uniqueEventIDs = Array.from(new Set(bookingData
            .filter(item => item.bookingType === 'Event' && futureEvents.some(event => event._id === item.eventID))
            .map(item => item.eventID)));
    
        // Map over unique camp IDs to find corresponding camp objects
        const bookingCampData = uniqueCampIDs.map(campID => futureCamps.find(camp => camp._id === campID));
    
        // Map over unique event IDs to find corresponding event objects
        const bookingEventData = uniqueEventIDs.map(eventID => futureEvents.find(event => event._id === eventID));
    
        // Set the state with the processed bookingCampData and bookingEventData
        setBookingCampData(bookingCampData);
        setBookingEventData(bookingEventData);

    };

         // Function to close the modal 
         const openCampBookings = () => {
          setViewCampBookings(true);
    
        };

        // Function to close the modal 
        const openEventBookings = () => {
          setViewCampBookings(false);

  
       };
    
  //----- 

    // Function to close Camp Refund modal - (Options)
      const closeCampRefundModal = () => {
      setRefundModalVisible(false);

       //Clear DDL Array as we exit and reuse 
        
          // Now set the value back to an empty array
          setValue([]);
    };


     // Function to close the Event Refund Confirmation modal - (Options)
     const closeEventRefundModal = () => {
      setRefundEventModalVisible(false);
          //Clear DDL Array as we exit and reuse 
      setValue([]);
         
    };

// -------------

  // Close Event Refund Confirmation Modals ---------------------------------

  // Function to close the Full Refund Confirmation modal 

      const closeEventFullRefundConfirmationModal = () => {
        setRefundEventFullConfirmationModalVisible(false);

      };

      const closeEventPartialRefundConfirmationModal = () => {
        setPartialRefundEventConfirmationModalVisible(false);

      };
  
  // --------------------------------------------------------------------------


  //---------------------------------------------------------------------------


    // Close Camp Refund Confirmation Modals

      // Function to close the Full Refund Confirmation modal 
      const closeCampFullRefundConfirmationModal = () => {
        setRefundCampFullConfirmationModalVisible(false);

      };

       // Function to  close the Partial Refund Confirmation modal 
       const closeCampPartialRefundConfirmationModal = () => {
        setRefundCampPartialConfirmationModalVisible(false);
  
      };

    //---------------------------------------------------------------



    
    

      // Function to close the modal 
      const closeBookingDetailsModal = () => {
        setBookingDetailsVisibleModal(false);
  
      };

      // Function to close the modal 
      const closeBookingEventDetailsModal = () => {
        setBookingEventDetailsVisibleModal(false);
  
      };

      

      const openEventBookingDetailsModal = async(booking) => {
        setSelectedEventBookingRecord(booking); // Set the selected booking data in the state
        setBookingEventDetailsVisibleModal(true); // Open the modal
      };


    const openCampBookingDetailsModal = async(booking) => {
      setSelectedBookingRecord(booking); // Set the selected booking data in the state
      setBookingDetailsVisibleModal(true); // Open the modal
    };



    //CAMP - FULL REFUND ----- 
    const openCampFullRefundConfirmationModal = () => {
     
      //Validation Check - Reason is a required Entry
      if(refundReason === "")
      {
        //Validation message 
        const reasonValidationMessage = "Please enter a reason"
        setRefundReasonErrorMessage(reasonValidationMessage);
      }
      else{

          setRefundModalVisible(false);
          setRefundCampFullConfirmationModalVisible(true); 

        

      }

    };
//--------------------------------






// Full Refund - Event Confirmaton
    const openFullRefundEventConfirmationModal = () => {

      // //Validation Check - Reason is a required Entry
      if(refundReason == "")
      {
        //Validation message 
        const reasonValidationMessage = "Please enter a reason"
        setRefundReasonErrorMessage(reasonValidationMessage);
      }
      else{

          setRefundEventModalVisible(false);
          setRefundEventFullConfirmationModalVisible(true);   
      }

   
 
    };




    const RequestCampRefundCancellationModalVisible = async(booking) => {
       
        setSelectedBookingRecord(booking);
        setRefundModalVisible(true);
    };

    const RequestEventRefundCancellationModalVisible = async(booking) => {
       
      setSelectedEventBookingRecord(booking);
      setRefundEventModalVisible(true);
  
  };



  const EventRequestFullRefund = async() => {

    setRefundEventFullConfirmationModalVisible(false);
    RequestedEventFullRefund();

  };


  const CampRequestFullRefund = async() => {

    setRefundCampFullConfirmationModalVisible(false);    
    RequestedCampFullRefund();

  };







      // CAMP - Request Full Refund funcaionality
      const RequestedCampFullRefund = async() => { 



        if(refundReason == "")
        {
          //Validation message 
          const reasonValidationMessage = "Please enter a reason"
          setRefundReasonErrorMessage(reasonValidationMessage);
          
        }
        else{

              const selectedBookingTypeRecordID = `http://localhost:3000/api/fullRefundRequest/${selectedBookingRecord._id}`;

              // Update Status so that it changes on the Record from Booked to Full Refund Request Sent 
              // Update Person AttendanceStatus value 


        const jwtToken = await AsyncStorage.getItem('jwtToken');


            try {
                const response = await fetch(selectedBookingTypeRecordID, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    body: JSON.stringify({
                      // Include the data you want to send in the body
                      // For example:
                      _id: selectedBookingTypeRecordID._id,
                      reasonForRefund: refundReason
                      // Other properties...

                  })
                   
                });


                // Notify Admin  HERE WHEN WE GET THE notifcations ? 

                const updatedRecord = await response.json();
              
                if(updatedRecord == null)
                {
                  setRefundModalVisible(true);
                }
                else{
                  

                  setRefundModalVisible(false);
                  setFetchDataTrigger(true);
                  navigation.navigate('Dashboard');


                }

                if (!response.ok) {
                  throw new Error('Failed to update booking record');
                }
                // Handle successful update
              } catch (error) {
                console.error('Error updating booking record:', error);
                // Handle error
              }

  }};


// Event - Request Full Refund
const RequestedEventFullRefund = async() => { 


  if(refundReason == "")
  {
    //Validation message 
    const reasonValidationMessage = "Please enter a reason"
    setRefundReasonErrorMessage(reasonValidationMessage);
  }
  else{

        const selectedBookingTypeRecordID = `http://localhost:3000/api/fullRefundRequest/${selectedEventBookingRecord._id}`;

        // Update Status so that it changes on the Record from Booked to Full Refund Request Sent 
        // Update Person AttendanceStatus value 


  const jwtToken = await AsyncStorage.getItem('jwtToken');


      try {
          const response = await fetch(selectedBookingTypeRecordID, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`,
              },
              body: JSON.stringify({
                // Include the data you want to send in the body
                // For example:
                _id: selectedBookingTypeRecordID._id,

                reasonForRefund: refundReason
                // Other properties...

            })
             
          });


// Notify Admin  HERE WHEN WE GET THE notifcations ? ? 

  
          const updatedRecord = await response.json();
        
          if(updatedRecord == null)
          {
            setRefundModalVisible(true);
          }
          else{
            
            setRefundModalVisible(false);       
            setFetchDataTrigger(true);
          
            navigation.navigate('Dashboard');
          }

          if (!response.ok) {
            throw new Error('Failed to update booking record');
          }
          // Handle successful update
        } catch (error) {
          console.error('Error updating booking record:', error);
          // Handle error
        }



  }




};



    
   

// Define initial values
const initialValue = []; // Provide an initial value for 'value' state
const initialItems = []; // Provide an initial value for 'items' state

const [open, setOpen] = useState(false);
const [value, setValue] = useState(initialValue);
const [items, setItems] = useState(initialItems);

const [selectedBookingRecord, setSelectedBookingRecord]= useState();
const [selectedParticipantID, setSelectedParticipantID] = useState(initialValue);



const [selectedEventBookingRecord, setSelectedEventBookingRecord]= useState();



// Usage example of setValue
const updateValue = (newValue) => {
  setValue(newValue);
};

// Usage example of setItems
const updateItems = (newItems) => {
  setItems(newItems);
};

const renderParticipantItem = ({ item: participant }) => (
   <View style={{ marginTop: 10 }}>


      <Text>
        <Text style={styles.headerText}>Participant Name: </Text>
        {participant.name}
      </Text>

      <Text>
        <Text style={styles.headerText}>Participant Age: </Text>
        {participant.age}
      </Text>

      <Text>
        <Text style={styles.headerText}>Participant Allergies: </Text>
        {participant.allergies}
      </Text>


    {participant.daysSelectedArray.length > 0 ? (
      <View style={{ 
        marginTop: 10 ,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#d4d0d0'}}>
        <Text style={styles.headerText}>Selected Camp Days:</Text>
        <FlatList
          data={participant.daysSelectedArray}
          keyExtractor={(day, index) => index.toString()}
          renderItem={({ item: day }) => (
            <Text key={day}>{day}</Text>
          )}
        />
      </View>
    ) : (
      <Text>No selected days</Text>
    )}
  </View>
);




const renderEventParticipantItem = ({ item: participant }) => (
    <View style={{ 
        marginTop: 10 ,
        borderBottomWidth: 1,
        borderBottomColor: '#d4d0d0'}}>
      <Text>
          <Text style={styles.headerText}>Participant Name: </Text>
          {participant.name}
      </Text>
      
       <Text>
          <Text style={styles.headerText}>Participant Age: </Text>
          {participant.age}
      </Text>

      <Text>
        <Text style={styles.headerText}>Participant Allergies: </Text>
        {participant.allergies}
      </Text>

  </View>
);




const renderEventItem = ({ item: event }) => (
  
    bookingEventData && bookingEventData.length > 0 ? (
      bookingEventData.map((event, index) => (
        <View key={index} style={styles.containerCard}>

        <View style={styles.container2}>
          <Text>
              <Text style={styles.headerText}>Event Name: </Text>
              {event.eventName}
          </Text>
        </View>


        <View style={styles.container2}>
          <Text>
              <Text style={styles.headerText}>Location: </Text>
              {event.location}
          </Text>
        </View>


        <View style={styles.container2}>
          <Text>
              <Text style={styles.headerText}>Date: </Text>
              {new Date(event.startDate).toLocaleDateString('en-GB')}
          </Text>
        </View>

        <View style={styles.container2}>
          <Text>
              <Text style={styles.headerText}>Start Time: </Text>
              {new Date(event.startDate).toLocaleDateString('en-GB')}
          </Text>
        </View>
          
        <View style={styles.container2}>
          <Text>
              <Text style={styles.headerText}>End Time: </Text>
              {new Date(event.endTime).toLocaleTimeString()}
          </Text>
        </View>

        <View style={styles.container2}>
          <Text>
              <Text style={styles.headerText}>Price: </Text>
              £{event.price}
          </Text>
        </View>
    
          {/* You can add more event details here */}
          <View style={styles.container1}>
            <Text style={styles.headerText}>Booking Details</Text>
          </View>

          {/* Check if bookingData is not undefined or empty */}
          {bookingData && bookingData.length > 0 && bookingData.filter(booking => booking.eventID === event._id).map((booking, bookingIndex) => (
          <View style={styles.containerCardBooking} key={bookingIndex}>
              <Text>Status: {booking.bookingStatus}</Text>
              <Text>Booking ID: {booking._id}</Text>
              <Text>Participants: {booking.participantsBooked}</Text>

                <View>
                      <TouchableOpacity style={styles.button} onPress={() => openEventBookingDetailsModal(booking)}>
                            <View style={styles.buttonContent}>
                                <Text style={styles.buttonText}>View Booking Details </Text>
                                <Ionicons name="book-outline" size={20} style={styles.icon} />
                            </View>
                      </TouchableOpacity>
                </View>


                <View>
                      <TouchableOpacity style={styles.button} onPress={() => RequestEventRefundCancellationModalVisible(booking)}>
                            <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>View Refund Options </Text>
                                <Ionicons name="arrow-forward-circle-outline" size={20} style={styles.icon} />
                            </View>
                      </TouchableOpacity>
                </View>
                
    
       
            </View>
          ))}



       <Modal
            animationType="slide"
            transparent={true}
            visible={bookingEventDetailsModalVisible}
            onRequestClose={closeBookingEventDetailsModal}
          >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{ flexDirection: 'column' }}>
       
              <Text style={styles.headerText}>Participant Details</Text>
                    {/* Render participant details for the selected booking */}
                    {selectedEventBookingRecord && selectedEventBookingRecord.participantArray ? (
                    <FlatList
                      data={selectedEventBookingRecord.participantArray}
                      keyExtractor={(participant, index) => index.toString()}
                      renderItem={renderEventParticipantItem}
                    />
        
                    


                  ) : (
                    <Text>No data available</Text>
                  )}


                    <View>
                      <TouchableOpacity style={styles.button} onPress={closeBookingEventDetailsModal}>
                        <Text style={styles.buttonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
              </View>
               
            </View>

        </View>
  </Modal>



      {/* Modal for displaying event details */}
      <Modal
          animationType="slide"
          transparent={true}
          visible={refundEventModalVisible}
          onRequestClose={closeEventRefundModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.label}>Reason for cancellation / Refund request: *</Text>
                  <Text style={styles.validationText}>{refundReasonErrorMessage}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Enter here..'
                    onChangeText= {(text) => setRefundReason(text)}
                  />



                                  <TouchableOpacity style={styles.button} onPress={openFullRefundEventConfirmationModal}>
                                    <Text style={styles.buttonText}>Request Refund</Text>
                                  </TouchableOpacity>
                
                                  <TouchableOpacity style={styles.button} onPress={closeEventRefundModal}>
                                    <Text style={styles.buttonText}>Close</Text>
                                  </TouchableOpacity>
                          
                </View>








                
                   <View>


                     



                  <View>


                             

                 </View>

            
                              </View>

                             </View> 
                      </View>
      
            
        </Modal> 


          
         {/* EVENT - Full Refund Modal - Refund Confirmation */}
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={refundEventFullRefundConfirmationModalVisible}
                          onRequestClose={closeEventFullRefundConfirmationModal}

                        >
                        <View style={styles.modalContainer}>
                         <View style={styles.modalContent}>
                                <View>
                                      
                                      <Text style={styles.label}> Are you sure you want to request a refund?</Text>

                                          <TouchableOpacity style={styles.button} onPress={EventRequestFullRefund}>
                                            <Text style={styles.buttonText}>Yes</Text>
                                          </TouchableOpacity>

                                          <TouchableOpacity style={styles.button} onPress={closeEventFullRefundConfirmationModal}>
                                            <Text style={styles.buttonText}>No</Text>
                                          </TouchableOpacity>

                                </View>
                             </View>
                          </View>

          </Modal>
        </View>



      ))

     








    ) : null
  
); //Closing Bracket


   


  
const renderCampItem = ({ item: camp }) => (
     
  //Container for Camps Bookings 
  
  <View style={styles.containerCard}>

    {(!bookingCampData || !Array.isArray(bookingData)) ? (
      <Text>No Bookings</Text> // if no bookings
    ) : (
  
      <View>
       
        <View style={styles.container2}>
          <Text>
              <Text style={styles.headerText}>Camp Name: </Text>
              {camp.campName}
          </Text>
        </View>

        <View style={styles.container2}>
          <Text>
              <Text style={styles.headerText}>Location: </Text>
              {camp.location}
          </Text>
        </View>

        <View style={styles.container2}>
          <Text>
              <Text style={styles.headerText}>Duration: </Text>
              {new Date(camp.startDate).toLocaleDateString('en-GB')} -{' '}
              {new Date(camp.endDate).toLocaleDateString('en-GB')}
          </Text>
        </View>

        <View style={styles.container2}>
          <Text>
            <Text style={styles.headerText}>Start Time: </Text>
            {new Date(camp.startTime).toLocaleTimeString()}
          </Text>
        </View>
          
        <View style={styles.container2}>
          <Text>
              <Text style={styles.headerText}>End Time:{' '}</Text>
              {new Date(camp.endTime).toLocaleTimeString()}
          </Text>
        </View>
          


        <View style={styles.container1}>
          <Text style={styles.headerText}>Booking Details</Text>
        </View>

        {bookingData &&
          bookingData.length > 0 &&
          bookingData
            .filter((booking) => booking.campID === camp._id)
            .map((booking, bookingIndex) => (
              <View style={styles.containerCardBooking} key={bookingIndex}>
                
      
                <Text>
                  <Text style={styles.headerText}>Status: </Text>
                  {booking.bookingStatus}
                </Text>

                <Text>
                  <Text style={styles.headerText}>Booking ID:  </Text>
                  {booking._id}
                </Text>

                <Text>
                  <Text style={styles.headerText}>Participants: </Text>
                  {booking.participantsBooked}
                </Text>

                <Text>
                  <Text style={styles.headerText}>Booking Price: </Text>
                  £{booking.price}
                </Text>

                <View>
                      <TouchableOpacity style={styles.button} onPress={() => openCampBookingDetailsModal(booking)}>
                            <View style={styles.buttonContent}>
                                <Text style={styles.buttonText}>View Booking Details </Text>
                                <Ionicons name="book-outline" size={20} style={styles.icon} />
                            </View>
                      </TouchableOpacity>
                </View>


                <View>
                      <TouchableOpacity style={styles.button} onPress={() => RequestCampRefundCancellationModalVisible(booking)}>
                            <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>View Refund Options </Text>
                                <Ionicons name="arrow-forward-circle-outline" size={20} style={styles.icon} />
                            </View>
                      </TouchableOpacity>
                </View>
   
              </View>

              
            ))}
      
       {/* Modal  */}       
          <Modal
            animationType="slide"
            transparent={true}
            visible={bookingDetailsModalVisible}
            onRequestClose={closeBookingDetailsModal}
          >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>

              <View style={{ flexDirection: 'column' }}>
              <Text style={styles.headerText}>Participant Details</Text>
                  {/* Render participant details for the selected booking */}
                  {selectedBookingRecord && selectedBookingRecord.participantArray ? (
                <FlatList
                
                    data={selectedBookingRecord.participantArray}
                    keyExtractor={(participant, index) => index.toString()}
                    renderItem={renderParticipantItem}
                  />
                  
                ) : (
                  <Text>No data available</Text>
                )}
              </View>

                    <View>
                      <TouchableOpacity style={styles.button} onPress={closeBookingDetailsModal}>
                        <Text style={styles.buttonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                </View>

     
              </View>
          </Modal>

     



         {/* CAMP - Refund Modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={refundModalVisible}
          onRequestClose={closeCampRefundModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'column' }}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={closeCampRefundModal}>
                      <Text style={styles.buttonText}>Exit</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.headerText}>Please enter a reason for your cancellation / Refund request: *</Text>
                  <Text style={styles.validationText}>{refundReasonErrorMessage}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Enter here..'
                    onChangeText={(text) => setRefundReason(text)}
                  />
                </View>

                <View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={openCampFullRefundConfirmationModal}>
                      <Text style={styles.buttonText}>Request Refund</Text>
                    </TouchableOpacity>
                  </View>

                
                </View>
              </View>
            </View>
        </Modal>

         {/* CAMP - Full Refund Modal - Refund Confirmation Modal*/}

                     <Modal
                          animationType="slide"
                          transparent={true}
                          visible={refundCampFullRefundConfirmationModalVisible}
                          onRequestClose={closeCampFullRefundConfirmationModal}

                        >
                        <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        <View>

                                        <Text style={styles.label}> Are you sure you want to request a refund?</Text>

                                            <TouchableOpacity style={styles.button} onPress={CampRequestFullRefund}>
                                              <Text style={styles.buttonText}>Yes</Text>
                                            </TouchableOpacity>
                                 
                                            <TouchableOpacity style={styles.button} onPress={closeCampFullRefundConfirmationModal}>
                                              <Text style={styles.buttonText}>No</Text>
                                            </TouchableOpacity>

                                        </View>
                                </View> 
                         </View>
           
                          


                       </Modal>


          </View> // To add a modal , Add it before this.

       )}

       </View>
);



  const uniqueKeyExtractor = (item) => item._id;



return (


  <View style={styles.container}>

      <TouchableOpacity style={styles.buttonEventCamp} onPress={() => setOpenCampList(!openCampList)}>
        <Text style={styles.buttonText}>{openCampList ? 'View Event List' : 'View Camp List'}</Text>
      </TouchableOpacity>


    {openCampList ? (
      <FlatList
        data={bookingCampData}
        renderItem={renderCampItem}
        keyExtractor={uniqueKeyExtractor}
      />
    ) : (
      <FlatList
        data={bookingEventData}
        renderItem={renderEventItem}
        keyExtractor={uniqueKeyExtractor}
      />
    )}

  </View>

                   
          
      );
    };
    
    const styles = StyleSheet.create({
 
      containerCard: {
        borderWidth: 8,
        borderColor: '#ffffff',
        borderRadius: 30,
        padding: 10,
        margin: 0,
        width: 'auto',
        backgroundColor: '#ecf0ff',
      },  
      buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },

      headerText:{
        color: 'black',
        fontSize: 14,
        fontWeight:'bold'
    
      },
      icon: {
        color: '#00e3ae', // Add spacing between icon and text
      
      },
      containerCardBooking: {
        borderWidth: 1,
        borderColor: '#00e3ae',
        borderRadius: 10,
        padding: 10,
        margin: 0,
        marginBottom:10,
        width: '100%',
        backgroundColor: 'white',
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
      container2:{
  
        flex: 1,
        width: '100%', // Width of the container (adjust as needed)
        height: '100%', // Height of the container (adjust as needed)
        backgroundColor: '#ecf0ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:10
    
    
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
          backgroundColor: '#ecf0ff',
          padding: 50,
          borderColor: '#ffffff',
          borderRadius: 30,
          width: '80%',
          borderWidth: 8,
        },
        fieldRow: {
          flexDirection: 'row',
           marginTop: 15,
           marginBottom: 10,
        },
       
        textInput: {
          borderWidth: 1,
          borderColor: 'gray',
          padding: 10,
          marginTop: 10,
          marginBottom: 10,
        },
        buttonContainer:{
          marginTop:-20
        },

        buttonEventContainer:{
          marginTop:-20
        },
        button: {
          borderRadius: 10,
          marginTop: 30,
          alignItems: 'center',
          backgroundColor: 'black',
          padding: 2,
          zIndex: 2, // Ensure dropdown is above other elements
          paddingVertical: 5, // Reduced padding
          paddingHorizontal: 10, // Reduced padding
          borderRadius: 5,
          marginHorizontal: 5,
        },
        
    
      
       

        buttonEventCamp:{
          borderRadius: 10,
          marginTop: 70,
          marginBottom: 20,
          paddingVertical: 15,
          alignItems: 'center',
          backgroundColor: 'black',
          width:'80%',
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
        container1: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop:20,
          marginBottom:10
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
        separator: {
          height: 1,
          width: '100%',
          backgroundColor: '#CCC',
        },
        
    });
    
    export default MyBookings;