import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal } from 'react-native';
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

   
      
      const [selectedParticipants, setSelectedParticipantsArray] = useState([]);
    
      const [refundReasonErrorMessage , setRefundReasonErrorMessage] = useState('');
      const [refundModalVisible, setRefundModalVisible] = useState(false);


      const [refundConfirmationModalVisible, setRefundConfirmationModalVisible] = useState(false);
     

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
              throw new Error('Network response was not ok');
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
            if (!campsResponse.ok) {
              throw new Error('Network response was not ok');
            }
            const campsData = await campsResponse.json();
            setCampData(campsData);
            console.log('Selected participants have been added:', selectedParticipants);
            // Process booking data
            processBookings(bookingData, campsData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData(); // Fetch data when component mounts
      }, []);
    
      const processBookings = (bookingData, campData) => {
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
      };

    // Function to close the modal 
      const closeRefundModal = () => {
      setRefundModalVisible(false);

    };

     // Function to close the modal 
     const closeRefundConfirmationModal = () => {
      setRefundConfirmationModalVisible(false);

    };



    const RequestRefundCancellationModalVisible = async(booking) => {
       
        setSelectedBookingRecord(booking);
        setRefundModalVisible(true);
      };


      const RequestPartialRefund = async() => {

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

            

            const participantIDs = [];
              // Loop through selectedParticipantsArray and store _id values in participantIDs array
              selectedParticipants.forEach(participant => {
                participantIDs.push(participant._id);
              });





            // Update Status so that it changes on the Record from Booked to Partial Refund Request Sent 
            // Update Person AttendanceStatus value 
  
              const jwtToken = await AsyncStorage.getItem('jwtToken');

          
                    try {
                        const response = await fetch(`http://localhost:3000/api/updateBookingRecord/${selectedBookingRecord._id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${jwtToken}`,
                            },
                            body: JSON.stringify({
                              // Include the data you want to send in the body
                              // For example:
                              _id: selectedBookingRecord._id,
                              participantID: participantIDs
                              // Other properties...
                          })
                           
                        });


                        
                    
                        const updatedRecord = await response.json();
                        console.log('Updated booking record:', updatedRecord);

                        // IT WIll Return NULL but what we will do to over come this is have a Are you sure Modal then rerun the function ( it will be a dup function but it wont have validation or like rerun again as we would have a loop )
 
 
                        setRefundModalVisible(false);

                        setRefundConfirmationModalVisible(true);

                        if(updatedRecord == null)
                        {
                          setRefundConfirmationModalVisible(true);
                        }
                        else{
                          setRefundConfirmationModalVisible(false);
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



          


            // Notify Admin 



              // How do we update list of attendance and have a (Partial Refund Request sent)

            // PUT 


            // obtain index if the the array booking 



            
            // Where will we update ParticipantsBooked Array? as they shouldnt update until after refund is confirmed by ADMIN 
          

            // Create a Provisional Record which will then become the Primary record if the Partial Record is successful? 
              
          
         // }
    
           
              // Create a Provisional Record which will then become the Primary record if the Partial Record is successful? 
              
              // Send Message to Admin

              // Create Refund Record for Admin to review 

              // Close Modal 

              // Update Status : Partial Refund Requested

        
      


        // Create refund Record for Admin to review 

        // Close Modal 

        // Update Status : Partial Refund Requested

      //  }

     // };

     

      const RequestedFullRefund = async() => { 

        //Validation Check - Reason is a required Entry 
        // IF Populated allow user to submit 
        // Else update validationMessage 

        // Send Message to Admin

        // Create refund Record for Admin to review 

        // Close Modal 

        // Update Status : Partial Refund Requested



      };



    
   

// Define initial values
const initialValue = []; // Provide an initial value for 'value' state
const initialItems = []; // Provide an initial value for 'items' state

const [open, setOpen] = useState(false);
const [value, setValue] = useState(initialValue);
const [items, setItems] = useState(initialItems);

const [selectedBookingRecord, setSelectedBookingRecord]= useState();
const [selectedParticipantID, setSelectedParticipantID] = useState(initialValue);






// Usage example of setValue
const updateValue = (newValue) => {
  setValue(newValue);
};

// Usage example of setItems
const updateItems = (newItems) => {
  setItems(newItems);
};






return (





<ScrollView>
  {bookingCampData.map((camp, index) => (
    <View key={index} style={styles.container}>  
      <Text>{camp.campName} </Text>
      <Text>Location: {camp.location}</Text> 
      <Text>Duration: {new Date(camp.startDate).toLocaleDateString('en-GB')} - {new Date(camp.endDate).toLocaleDateString('en-GB')}</Text>
      <Text>Start Time: {new Date(camp.startTime).toLocaleTimeString()} - End Time: {new Date(camp.endTime).toLocaleTimeString()}</Text>

      {/* Iterate over bookings associated with this camp */}
      {bookingData.filter(booking => booking.campID === camp._id).map((booking, bookingIndex) => (
        <View key={bookingIndex}>
          <Text>Status: {booking.bookingStatus}</Text>
          <Text>Booking ID: {booking._id}</Text>
          <Text>Participants: {booking.participantsBooked}</Text>
          <Text>Price: £{booking.totalPrice}</Text>


                                <View>
                                  {/* Render other camp details */}
                                  <TouchableOpacity style={styles.button1} onPress={() => RequestRefundCancellationModalVisible(booking)}>
                                    <Text style={styles.buttonText}>View Refund Options</Text>
                                  </TouchableOpacity>
                               </View>
          {/* Add other booking details as needed */}
          </View>
          ))}
          </View>

          ))}


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
                                    <TouchableOpacity style={styles.button1}>
                                      <Text style={styles.buttonText} onPress={RequestPartialRefund}>Request Partial Refund</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1}>
                                    <Text style={styles.buttonText} onPress={RequestedFullRefund}>Request Full Refund</Text>
                                  </TouchableOpacity>
                                </View>

                                <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1}>
                                    <Text style={styles.buttonText} onPress={closeRefundModal}>Exit</Text>
                                  </TouchableOpacity>
                                </View>

                 </View>

              )}

                {value.length <=0 && (
             

                          <View>
                               <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1}>
                                    <Text style={styles.buttonText} onPress={RequestedFullRefund}>Request Full Refund</Text>
                                  </TouchableOpacity>
                               </View>
                            
                               <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1}>
                                    <Text style={styles.buttonText} onPress={closeRefundModal}>Exit</Text>
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

                               <Text style={styles.buttonText}> Are you sure you want to request a refund?</Text>
                                  <TouchableOpacity style={styles.button1}>
                                    <Text style={styles.buttonText} onPress={RequestPartialRefund}>Yes</Text>
                                  </TouchableOpacity>
                               </View>
                            
                               <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.button1}>
                                    <Text style={styles.buttonText} onPress={closeRefundConfirmationModal}>No</Text>
                                  </TouchableOpacity>
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
    
    export default MyBookings;