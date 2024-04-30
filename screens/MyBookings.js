import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal,FlatList, Alert } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DropDownPicker from 'react-native-dropdown-picker';



const MyBookings = ({ navigation }) => {

      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [bookingData, setBookingData] = useState([]);
      const [campData, setCampData] = useState([]);
      const [eventData, setEventData] = useState([]);
      const [bookingCampData, setBookingCampData] = useState([]);
      const [bookingEventData, setBookingEventData] = useState([]);
      const [refundReason , setRefundReason] = useState('');

      const [isEvent, setEvent] = useState(false);
      
      const [selectedParticipants, setSelectedParticipantsArray] = useState([]);
    
      const [refundReasonErrorMessage , setRefundReasonErrorMessage] = useState('');
      const [refundModalVisible, setRefundModalVisible] = useState(false);
      const [refundEventModalVisible, setRefundEventModalVisible] = useState(false);
      
      
      const [bookingDetailsModalVisible, setBookingDetailsVisibleModal] = useState(false);

      const [viewCampBookings, setViewCampBookings] = useState(false);
      const [viewEventBookings, setViewEventBookings] = useState(false);

      const [refundConfirmationModalVisible, setRefundConfirmationModalVisible] = useState(false);
      const [refundEventConfirmationModalVisible, setRefundEventConfirmationModalVisible] = useState(false);
     

      useEffect(() => {


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
          } catch (error) {
              //Error Fetching

               // throw new Error('Network response was not ok');
              
          }
        };
    
        fetchData(); // Fetch data when component mounts
      }, []);
    
      const processBookings = (bookingData, campData, eventData) => {
         // Extract unique camp IDs from bookingData
          const uniqueCampIDs = Array.from(new Set(bookingData
            .filter(item => item.bookingType === 'Camp') // Filter bookingData to include only bookings of type 'Camp'
            .map(item => item.campID))); // Map to get an array of campIDs and then create a set to get unique IDs

          // Map over unique camp IDs to find corresponding camp objects
          const bookingCampData = uniqueCampIDs.map(campID => {
            // Find the camp object with the current campID
            const foundCamp = campData.find(camp => camp._id === campID);
            // If a camp is found, return it; otherwise, return null
            return foundCamp ? foundCamp : null;
          });

          // Set the state with the processed bookingCampData
          setBookingCampData(bookingCampData);

          // Extract unique event IDs from bookingData
            const uniqueEventIDs = Array.from(new Set(bookingData
              .filter(item => item.bookingType === 'Event') // Filter bookingData to include only bookings of type 'Event'
              .map(item => item.eventID))); // Map to get an array of eventIDs and then create a set to get unique IDs

            // Map over unique event IDs to find corresponding event objects
            const bookingEventData = uniqueEventIDs.map(eventID => {
              // Find the event object with the current eventID
              const foundEvent = eventData.find(event => event._id === eventID);
              // If an event is found, return it; otherwise, return null
              return foundEvent ? foundEvent : null;
            });

            // Set the state with the processed bookingEventData
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
    
  

    // Function to close the modal 
      const closeRefundModal = () => {
      setRefundModalVisible(false);

       //Clear DDL Array as we exit and reuse 
        
          // Now set the value back to an empty array
          setValue([]);
    };


    // Function to close the modal 
    const closeEventRefundModal = () => {
      setRefundEventModalVisible(false);
          //Clear DDL Array as we exit and reuse 
      setValue([]);
         
    };


     // Function to close the modal 
     const closeRefundConfirmationModal = () => {
      setRefundConfirmationModalVisible(false);

    };


    const closeEventRefundConfirmationModal = () => {
      setRefundEventConfirmationModalVisible(false);

    };
    

      // Function to close the modal 
      const closeBookingDetailsModal = () => {
        setBookingDetailsVisibleModal(false);
  
      };

      const openEventBookingDetailsModal = async(booking) => {
        setSelectedEventBookingRecord(booking); // Set the selected booking data in the state
        setBookingDetailsVisibleModal(true); // Open the modal
      };


    const openCampBookingDetailsModal = async(booking) => {
      setSelectedBookingRecord(booking); // Set the selected booking data in the state
      setBookingDetailsVisibleModal(true); // Open the modal
    };

    const openRefundConfirmationModal = async() => {

      //Validation Check - Reason is a required Entry
      if(refundReason == "")
      {
        //Validation message 
        const reasonValidationMessage = "Please enter a reason"
        setRefundReasonErrorMessage(reasonValidationMessage);
      }
      else{

        if(value == [])
        {
          const reasonValidationMessage = "Please select at least 1 particant"
          setRefundReasonErrorMessage(reasonValidationMessage);
        } 
        else{


       

          setSelectedParticipantsArray(selectedBookingRecord.participantArray);

          setRefundModalVisible(false);
          setRefundConfirmationModalVisible(true); 

        }

      }

 
    };




    const openRefundEventConfirmationModal = async() => {

      //Validation Check - Reason is a required Entry
      if(refundReason == "")
      {
        //Validation message 
        const reasonValidationMessage = "Please enter a reason"
        setRefundReasonErrorMessage(reasonValidationMessage);
      }
      else{

        if(value == [])
        {
          const reasonValidationMessage = "Please select at least 1 particant"
          setRefundReasonErrorMessage(reasonValidationMessage);
        } 
        else{


       

          setSelectedParticipantsArray(selectedEventBookingRecord.participantArray);

          setRefundEventModalVisible(false);
          setRefundEventConfirmationModalVisible(true); 

          
        }

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


  const EventRequestPartialRefund = async() => {

    setEvent(true);

    RequestPartialRefund();

  };




      const RequestPartialRefund = async() => {

        setRefundConfirmationModalVisible(false);
        //Validation Check - Reason is a required Entry
        if(refundReason == "")
        {
          //Validation message 
          const reasonValidationMessage = "Please enter a reason"
          setRefundReasonErrorMessage(reasonValidationMessage);
        }
        else{

          if(value == [])
          {
            const reasonValidationMessage = "Please select at least 1 particant"
            setRefundReasonErrorMessage(reasonValidationMessage);
          } 
          else{








            // Update Status so that it changes on the Record from Booked to Partial Refund Request Sent 
            // Update Person AttendanceStatus value 
  
              const jwtToken = await AsyncStorage.getItem('jwtToken');
              
              // Define selectedBookingTypeRecordID
              let selectedBookingTypeRecordID;

              if(isEvent == true)
              {
                selectedBookingTypeRecordID = selectedEventBookingRecord;
              }
              else{
                selectedBookingTypeRecordID = selectedBookingRecord;
              }
       


          
                    try {
                        const response = await fetch(`http://localhost:3000/api/updateBookingRecord/${selectedBookingTypeRecordID._id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${jwtToken}`,
                            },
                            body: JSON.stringify({
                              // Include the data you want to send in the body
                              // For example:
                              _id: selectedBookingTypeRecordID._id,
                              participantID: value,
                              reasonForRefund: refundReason
                              // Other properties...

                          })
                           
                        });


       // Notify Admin  HERE WHEN WE GET THE notifacatins ? ? 
      
                    
                        const updatedRecord = await response.json();
                      
                        if(updatedRecord == null)
                        {
                          setRefundModalVisible(true);
                        }
                        else{
                          
       
                          setRefundModalVisible(false);
                          navigation.navigate('DashboardCRM');
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
                  }
            }



      const RequestedFullRefund = async() => { 


        setRefundConfirmationModalVisible(false);
        if(refundReason == "")
        {
          //Validation message 
          const reasonValidationMessage = "Please enter a reason"
          setRefundReasonErrorMessage(reasonValidationMessage);
        }
        else{


              // Update Status so that it changes on the Record from Booked to Full Refund Request Sent 
            // Update Person AttendanceStatus value 

            const jwtToken = await AsyncStorage.getItem('jwtToken');

          console.log(selectedBookingRecord._id);
            try {
                const response = await fetch(`http://localhost:3000/api/fullRefundRequest/${selectedBookingRecord._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    body: JSON.stringify({
                      // Include the data you want to send in the body
                      // For example:
                      _id: selectedBookingRecord._id,
                      reasonForRefund: refundReason
                      // Other properties...

                  })
                   
                });


// Notify Admin  HERE WHEN WE GET THE notifacatins ? ? 

            
                const updatedRecord = await response.json();
              
                if(updatedRecord == null)
                {
                  setRefundModalVisible(true);
                }
                else{
                  

                  setRefundModalVisible(false);
                  navigation.navigate('DashboardCRM');
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
    <Text>Participant Name: {participant.name}</Text>
    <Text>Participant Age: {participant.age}</Text>
    <Text>Participant Allergies: {participant.allergies || 'None'}</Text>
    {participant.daysSelectedArray.length > 0 ? (
      <View>
        <Text>Selected Days:</Text>
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







return (





<ScrollView>
 
{/* Menu Options - 2 buttons Camp and Event , if true it will display respective lists */}
       {/* Conditional rendering based on the state */}
       {viewCampBookings ? (
        <View>
          {/* Display this view if viewCampBookings is true */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button1} onPress={openEventBookings}>
              <Text style={styles.buttonText}>View Event Bookings</Text>
            </TouchableOpacity>
        </View>







<View>
      {/* Check if either bookingCampData or bookingData is undefined */}
      {(!bookingCampData || !Array.isArray(bookingData)) ? (
        <Text>No Bookings</Text>
      ) : (
        // If both are defined and bookingData is an array, proceed with rendering
        bookingCampData.map((camp, index) => (
          <View key={index} style={styles.container}>
            <Text>{camp.campName} </Text>
            <Text>Location: {camp.location}</Text>
            <Text>Duration: {new Date(camp.startDate).toLocaleDateString('en-GB')} - {new Date(camp.endDate).toLocaleDateString('en-GB')}</Text>
            <Text>Start Time: {new Date(camp.startTime).toLocaleTimeString()} - End Time: {new Date(camp.endTime).toLocaleTimeString()}</Text>

            {/* Check if bookingData is not undefined or empty */}
            {bookingData && bookingData.length > 0 && bookingData.filter(booking => booking.campID === camp._id).map((booking, bookingIndex) => (
              <View key={bookingIndex}>
                <Text>Status: {booking.bookingStatus}</Text>
                <Text>Booking ID: {booking._id}</Text>
                <Text>Participants: {booking.participantsBooked}</Text>
                <Text>Booking Price: £{booking.price}</Text>
                
                <View>
                {/* This button make a modal appear and Render participant details for each booking */}
                   <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.button1} onPress={() => openCampBookingDetailsModal(booking)}>
                        <Text style={styles.buttonText}> View Booking Details</Text>
                      </TouchableOpacity>
                    </View>

                    <View>
                      <TouchableOpacity style={styles.button1} onPress={() => RequestCampRefundCancellationModalVisible(booking)}>
                        <Text style={styles.buttonText}>View Refund Options</Text>
                      </TouchableOpacity>
                    </View>

                </View>
          




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
          {/* Render participant details for the selected booking */}
          {selectedBookingRecord && selectedBookingRecord.participantArray ? (
          <FlatList
            data={selectedBookingRecord.participantArray}
            keyExtractor={(participant, index) => index.toString()}
            renderItem={renderParticipantItem}
          />
        ) : (
          <Text>No participant data available</Text>
        )}
                </View>
                    <View>
                      <TouchableOpacity style={styles.button1} onPress={closeBookingDetailsModal}>
                        <Text style={styles.buttonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                </View>

              </View>
          </Modal>
             </View>
              
            ))}

            
          </View>
        ))



      )}
    </View>



          {/* Modal  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={refundModalVisible}
            onRequestClose={closeRefundModal}

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
                </View>

                <View style={{ flexDirection: 'column' }}>
                  <Text>Please select the participants you would like to request to refund / cancel or Press the "Full Refund" button to request a full refund</Text>
                </View>

                {/* Participant selection */}
                <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Participant lists</Text>
                   {/* Dropdown for selecting participant */}
                  <View style={styles.dropdownContainer}>
                    <DropDownPicker
                      open={open}
                      value={value}
                      setOpen={setOpen}
                      setValue={updateValue}
                      setItems={updateItems}
                      placeholder={'Choose a participant'}
                      multiple={true}
                      mode="BADGE"
                      badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}


                      items={selectedBookingRecord?.participantArray.map(participant => ({ 
                        label: participant.name, 
                        value: participant._id 
                      })) || []}
                      containerStyle={styles.dropdown}
                    />
                  </View>
                  
                 </View>

              <View>
              {value.length > 0 && (
                  <View>


                              <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1} onPress={RequestedFullRefund}>
                                    <Text style={styles.buttonText}>Request Full Refund</Text>
                                  </TouchableOpacity>
                               </View>
                              <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button1} onPress={openRefundConfirmationModal}>
                                      <Text style={styles.buttonText}>Request Partial Refund</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1} onPress={closeRefundModal}>
                                    <Text style={styles.buttonText}> Exit</Text>
                                  </TouchableOpacity>
                                </View>

                 </View>

              )}

                {value.length <=0 && (
             

                          <View>
                               <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1} onPress={RequestedFullRefund}>
                                    <Text style={styles.buttonText}>Request Full Refund</Text>
                                  </TouchableOpacity>
                               </View>
                            
                               <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1} onPress={closeRefundModal}>
                                    <Text style={styles.buttonText}>Exit</Text>
                                  </TouchableOpacity>
                               </View>
                          </View> 


               )} 

                              </View>

                             </View> 
                      </View>
                                              
                     </Modal> 
                      
  


                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={refundConfirmationModalVisible}
                          onRequestClose={closeRefundModal}

                        >
                        <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                      <View>
                                      <View style={styles.buttonContainer}>

                                      <Text style={styles.label}> Are you sure you want to request a refund?</Text>
                                          <TouchableOpacity style={styles.button1} onPress={RequestPartialRefund}>
                                            <Text style={styles.buttonText}>Yes</Text>
                                          </TouchableOpacity>
                                      </View>
                                    
                                      <View style={styles.buttonContainer}>
                                          <TouchableOpacity style={styles.button1} onPress={closeRefundConfirmationModal}>
                                            <Text style={styles.buttonText}>No</Text>
                                          </TouchableOpacity>
                                      </View>
                        </View> 

                      </View>
                </View>
                          


          </Modal>
   
        
        </View>
      ) : (
      

        //Event bookings 
      <View>

        <View style={styles.buttonContainer}>
          {/* Display this view if viewCampBookings is false */}
          <TouchableOpacity style={styles.button1} onPress={openCampBookings}>
            <Text style={styles.buttonText}>View Camp Bookings</Text>
          </TouchableOpacity>
        </View>

        
    {bookingEventData && bookingEventData.length > 0 ? (
      bookingEventData.map((event, index) => (
        <View key={index} style={styles.container}>
          <Text>{event.eventName}</Text>
          <Text>Location: {event.location}</Text>
          <Text>Duration: {new Date(event.startDate).toLocaleDateString('en-GB')}</Text>
          <Text>Start Time: {new Date(event.startTime).toLocaleTimeString()} - End Time: {new Date(event.endTime).toLocaleTimeString()}</Text>
          <Text>Price: £{event.price}</Text>
          {/* You can add more event details here */}

  {/* Check if bookingData is not undefined or empty */}
  {bookingData && bookingData.length > 0 && bookingData.filter(booking => booking.eventID === event._id).map((booking, bookingIndex) => (
                <View key={bookingIndex}>
                  <Text>Status: {booking.bookingStatus}</Text>
                  <Text>Booking ID: {booking._id}</Text>
                  <Text>Participants: {booking.participantsBooked}</Text>
                  <Text>Booking Price: £{booking.price}</Text>

                  <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button1} onPress={() => openEventBookingDetailsModal(booking)}>
                <Text style={styles.buttonText}> View Booking Details</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity style={styles.button1} onPress={() => RequestEventRefundCancellationModalVisible(booking)}>
                <Text style={styles.buttonText}>View Refund Options</Text>
              </TouchableOpacity>
            </View>
                </View>

                
              )

       
              
              )}
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.button1} onPress={() => openEventBookingDetailsModal(event)}>
                        <Text style={styles.buttonText}> View Booking Details</Text>
                      </TouchableOpacity>
                    </View>

                    <View>
                      <TouchableOpacity style={styles.button1} onPress={() => RequestEventRefundCancellationModalVisible(event)}>
                        <Text style={styles.buttonText}>View Refund Options</Text>
                      </TouchableOpacity>
                    </View>

        </View>
      ))

//Modal - View Event Details 





  


    ) : (
      <Text>No Event Bookings</Text>
    )}


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
                </View>
                <View style={{ flexDirection: 'column' }}>
                  <Text>Please select the participants you would like to request to refund / cancel or Press the "Full Refund" button to request a full refund</Text>
                </View>

                 {/* Participant selection */}
                 <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Participant lists</Text>
                   {/* Dropdown for selecting participant */}
                  <View style={styles.dropdownContainer}>
                    <DropDownPicker
                      open={open}
                      value={value}
                      setOpen={setOpen}
                      setValue={updateValue}
                      setItems={updateItems}
                      placeholder={'Choose a participant'}
                      multiple={true}
                      mode="BADGE"
                      badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}


                      items={selectedEventBookingRecord?.participantArray.map(participant => ({ 
                        label: participant.name, 
                        value: participant._id 
                      })) || []}
                      containerStyle={styles.dropdown}
                    />
                  </View>
                  
                 </View>
                 <View>
              {value.length > 0 && (
                  <View>

                              <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1} onPress={RequestedFullRefund}>
                                    <Text style={styles.buttonText}>Request Full Refund</Text>
                                  </TouchableOpacity>
                               </View>
                              <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button1} onPress={openRefundEventConfirmationModal}>
                                      <Text style={styles.buttonText}>Request Partial Refund</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1} onPress={closeEventRefundModal}>
                                    <Text style={styles.buttonText}> Exit</Text>
                                  </TouchableOpacity>
                                </View>

                 </View>

              )}

                {value.length <=0 && (
             

                          <View>
                               <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1} onPress={RequestedFullRefund}>
                                    <Text style={styles.buttonText}>Request Full Refund</Text>
                                  </TouchableOpacity>
                               </View>
                            
                               <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1} onPress={closeEventRefundModal}>
                                    <Text style={styles.buttonText}>Exit</Text>
                                  </TouchableOpacity>
                               </View>
                          </View> 


               )} 

                              </View>

                             </View> 
                      </View>
      
            
        </Modal>





                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={refundEventConfirmationModalVisible}
                          onRequestClose={closeEventRefundConfirmationModal}

                        >
                        <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                      <View>
                                      <View style={styles.buttonContainer}>

                                      <Text style={styles.label}> Are you sure you want to request a refund?</Text>
                                          <TouchableOpacity style={styles.button1} onPress={EventRequestPartialRefund}>
                                            <Text style={styles.buttonText}>Yes</Text>
                                          </TouchableOpacity>
                                      </View>
                                    
                                      <View style={styles.buttonContainer}>
                                          <TouchableOpacity style={styles.button1} onPress={closeRefundConfirmationModal}>
                                            <Text style={styles.buttonText}>No</Text>
                                          </TouchableOpacity>
                                      </View>
                        </View> 

                      </View>
                </View>
                          


          </Modal>
  </View>

      )}





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
    
    export default MyBookings;