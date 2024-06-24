import React, { useEffect,useState } from 'react';
import {ScrollView, StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal,FlatList } from 'react-native';
import validator from 'validator';
import { PreventRemoveProvider, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';




const ManageBookings = ({ navigation }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [campData, setCampData] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [bookingData, setBookingData] = useState([]);
  
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editEventModalVisible, setEditEventModalVisible] = useState(false);
      
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
 

    const [campAttendanceModalVisible, setCampAttendanceModalVisible] = useState(false);
    const [eventAttendanceModalVisible, setEventAttendanceModalVisible] = useState(false);
  
    const [openDeleteCampModalVisible, setDeleteCampModal] = useState(false);
    const [selectedCamp, setSelectedCamp] = useState('');

    const [openDeleteEventModalVisible, setDeleteEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState('');





const [date, setDate] = useState(new Date(1598051730000));
const [mode, setMode] = useState('date');
const [show, setShow] = useState(false);


const [startTime, setStartTime] = useState(new Date());
const [endTime, setEndTime] = useState(new Date());
const [showTimePicker, setShowTimePicker] = useState(false);

  
    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          setIsLoggedIn(!!jwtToken);
 
        
        } catch (error) {
          console.error('Error fetching JWT token:', error);
        }
      };
  
      checkAuthentication(); // Call the function to check authentication status when component mounts
    
    handleCamps();
    handleEvents();
    
    
    }, []);
    
    // Empty dependency array ensures the effect runs only once when component mounts
//GET CAMPS || EVENTS 

const handleCamps = async () => {

    // Fetch all camps 

    const apiGetCamps = 'http://localhost:3000/api/camps';
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    
    try {
      const response = await fetch(apiGetCamps, {
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
      setCampData(data);


  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }


  };


  
  
const handleEvents = async () => {

  // Fetch all events

  const apiGetEvents = 'http://localhost:3000/api/events';
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  
  try {
    const response = await fetch(apiGetEvents, {
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
    setEventData(data);


} catch (error) {
  console.error('There has been a problem with your fetch operation:', error);
}


};




  
  
  const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
  };
  
  const showDatepicker = () => {
      showMode('date');
  };
  
  const showTimepicker = () => {
      showMode('time');
  };
  //------------------------
  
// ------------- iOS Date Picker functions ---------------

const [startPickerVisible, setStartPickerVisible] = useState(false);
const [endPickerVisible, setEndPickerVisible] = useState(false);



  const showStartPicker = () => {
    setStartPickerVisible(true);
  };

  const showEndPicker = () => {
    setEndPickerVisible(true);
  };

  const handleStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);

  };

  const handleEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    
  };

  const onStartChange = (event, selectedTime) => {
    setShowTimePicker(false);
    const currentTime = selectedTime || startTime;
    setStartTime(currentTime);
  };
  
  const onEndChange = (event, selectedTime) => {
    setShowTimePicker(false);
    const currentTime = selectedTime || endTime;
    setEndTime(currentTime);
  };

// ---------------------------MODAL----------------------------- 

const [editedCampIndex, setEditedCampIndex] = useState(-1);
const [editedLocationText, setEditedLocationText] = useState(''); // Edited text for the camp being edited
const [edited5DayPriceText, setEdited5DayPrice] = useState(''); // Edited text for the camp being edited
const [edited4DayPriceText, setEdited4DayPrice] = useState(''); // Edited text for the camp being edited
const [edited3DayPriceText, setEdited3DayPrice] = useState(''); // Edited text for the camp being edited
const [edited2DayPriceText, setEdited2DayPrice] = useState(''); // Edited text for the camp being edited
const [edited1DayPriceText, setEdited1DayPrice] = useState(''); // Edited text for the camp being edited




    // Function to open the modal and set the index of the camp being edited
    const openEditModal = (index) => {  // CAMP Edit
      setEditModalVisible(true);
      setEditedCampIndex(index);

     // PREFILL EDIT FORM 
      if (index !== -1) {
        // Set editedText to the location of the camp being edited
        setEditedLocationText(campData[index].location);
        setEdited5DayPrice(campData[index].price5Day);
        setEdited4DayPrice(campData[index].price4Day);
        setEdited3DayPrice(campData[index].price3Day);
        setEdited2DayPrice(campData[index].price2Day);
        setEdited1DayPrice(campData[index].price1Day);
        

        
        setStartDate(new Date(campData[index].startDate));
        setEndDate(new Date(campData[index].endDate));

        setStartTime(new Date(campData[index].startTime));
        setEndTime(new Date(campData[index].endTime));


      }

      setStartPickerVisible(true);
      setEndPickerVisible(true);
      setShow(true);
  
    };



  
    // Function to close the modal and reset editedCampIndex
    const closeEditModal = () => {
      setEditModalVisible(false);

    };

    // Function to close the modal and reset editedEventIndex
    const closeEditEventModal = () => {
      setEditEventModalVisible(false);
  
    };
  




    const [editedEventIndex, setEditedEventIndex] = useState(-1);
    const [editedEventLocationText, setEditedEventLocationText] = useState(''); // Edited text for the camp being edited
    const [editedEventPriceText, setEditedEventPrice] = useState(''); // Edited text for the camp being edited

    // Function to open the modal and set the index of the event being edited
    const openEditEventModal = (index) => {
      setEditEventModalVisible(true);
      setEditedEventIndex(index);

     // PREFILL EDIT FORM 
      if (index !== -1) {

        // Set editedText to the location of the event being edited
        setEditedEventLocationText(eventData[index].location);
        setEditedEventPrice(eventData[index].price);
       
        setStartDate(new Date(eventData[index].startDate));


        setStartTime(new Date(eventData[index].startTime));
        setEndTime(new Date(eventData[index].endTime));


      }

      setStartPickerVisible(true);
      setEndPickerVisible(true);
      setShow(true);
  
    };


    // Function to close the modal
    const closeCampAttendanceModal = () => {
      setCampAttendanceModalVisible(false);
    
    };


    // Function to close the modal
    const closeCampAttendanceMoreInfoModal = () => {
      setAttendanceMoreInfoModalVisible(false);

    };

      // Function to close the modal
    const closeEventAttendanceModal = () => {
        setEventAttendanceModalVisible(false);
  
    };


  const ViewCampAttendance = async (index) => {

    setCampAttendanceModalVisible(true);

      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const id = campData[index]._id; // Assuming each camp has an '_id' property

      bookingData.length = 0;

      try {

        const response = await fetch(`http://localhost:3000/api/getCampAttendance/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          }
        });
    
        const data = await response.json();
      

        data.forEach(booking => {

          // Access participant array
          const participantArray = booking.participantArray;
        
          // Iterate over participant array
          participantArray.forEach(participant => {
            // Access participant details
            const participantName = participant.name;
            const participantAge = participant.age;
            const participantAttendanceStatus = participant.attendanceStatus
            const participantEmergencyContactNumber = participant.emergencyContactNumber
            // Access other participant details as needed

          // Create an object with participant details and push it to the bookingData array
          bookingData.push({
            name: participantName,
            age: participantAge,
            attendanceStatus: participantAttendanceStatus,
            emergencyContactNumber: participantEmergencyContactNumber
       
          });




          });
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        // Handle successful response
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error
      }
    
      
  };



    
  const ViewEventAttendance = async (index) => {

      setEventAttendanceModalVisible(true);
  
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        const id = eventData[index]._id; // Assuming each event has an '_id' property
  
        bookingData.length = 0;
  
        try {
  
          const response = await fetch(`http://localhost:3000/api/getEventAttendance/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            }
          });
      
          const data = await response.json();
        
  
          data.forEach(booking => {
  
            // Access participant array
            const participantArray = booking.participantArray;
          
            // Iterate over participant array
            participantArray.forEach(participant => {
              // Access participant details
              const participantName = participant.name;
              const participantAge = participant.age;
              const participantAttendanceStatus = participant.attendanceStatus
              const participantEmergencyContactNumber = participant.emergencyContactNumber
              // Access other participant details as needed
  
            // Create an object with participant details and push it to the bookingData array
            bookingData.push({
              name: participantName,
              age: participantAge,
              attendanceStatus: participantAttendanceStatus,
              emergencyContactNumber: participantEmergencyContactNumber
         
            });
  
  
  
  
            });
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          // Handle successful response
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle error
        }
      
        
    };
  
 
  
  const closeDeleteCampModal = async () => {

    setDeleteCampModal(false);

  };

  const closeDeleteEventModal = async () => {

    setDeleteEventModal(false);

  };


  const openDeleteCampModal = async (index) => {

    setDeleteCampModal(true);
    const id = campData[index]._id; // Assuming each camp has an '_id' property
    setSelectedCamp(id);

  };


  const openDeleteEventModal = async (index) => {

    setDeleteEventModal(true);
    const id = eventData[index]._id; // Assuming each event has an '_id' property
    setSelectedEvent(id);

  };


  const removeCamp = async (index) => {

    const jwtToken = await AsyncStorage.getItem('jwtToken');
    const id = selectedCamp; // Assuming each camp has an '_id' property

    try {

     
      await fetch(`http://localhost:3000/api/camps/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },


      });
  
      // Remove the camp from the local state
      setCampData((prevData) => {
        const newData = [...prevData];
        newData.splice(index, 1);

        setDeleteCampModal(false);
        return newData;
      });


      


    } catch (error) {
      console.error('Error removing camp:', error);
    }
  };



  const removeEvent = async (index) => {

    const jwtToken = await AsyncStorage.getItem('jwtToken');
    const id = selectedEvent; // Assuming each event has an '_id' property

    try {

     
      await fetch(`http://localhost:3000/api/events/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },


      });
  
      // Remove the event from the local state
      setEventData((prevData) => {
        const newData = [...prevData];
        newData.splice(index, 1);
        return newData;
      });


      


    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  const updateCamp = async (index) => {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
  
    if (index !== -1) {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const camp = campData[index]; // get the camp object

      if(camp)
      {
        if (camp) {
          const id = camp._id; // get the id of the camp object

          try {
              const response = await fetch(`http://localhost:3000/api/updateCamp/${id}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${jwtToken}`,
                  },
                  body: JSON.stringify({
                      location: editedLocationText,
                      price5Day: edited5DayPriceText,
                      price4Day: edited4DayPriceText,
                      price3Day: edited3DayPriceText,
                      price2Day: edited2DayPriceText,
                      price1Day: edited1DayPriceText,
                      startDate: startDate,
                      endDate: endDate,
                      startTime: startTime,
                      endTime: endTime

                  })
              });

              // Check if the request was successful
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              // Update the camp in the local state
              setCampData((prevData) => {
                  const newData = [...prevData];
                  newData[index] = {
                      ...newData[index],
                      location: editedLocationText,
                      price5Day: edited5DayPriceText,
                      price4Day: edited4DayPriceText,
                      price3Day: edited3DayPriceText,
                      price2Day: edited2DayPriceText,
                      price1Day: edited1DayPriceText,
                      startDate: startDate,
                      endDate: endDate,
                      startTime: startTime,
                      endTime: endTime
                  };
                  return newData;
              });

              // Close the modal
              closeEditModal();
          } catch (error) {
              console.error('Error updating camp:', error);
              // Display an error message to the user
              // This could be done with a Toast, Alert, or some other UI component
              // You could also use state to set an error message that is displayed in the modal
          }
      }
        }
      }




    };



  const updateEvent = async (index) => {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
  
    if (index !== -1) {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const event = eventData[index]; // get the event object

      if(event)
      {
        if (event) {
          const id = event._id; // get the id of the event object

          try {
              const response = await fetch(`http://localhost:3000/api/updateEvent/${id}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${jwtToken}`,
                  },
                  body: JSON.stringify({
                      location: editedEventLocationText,
                      price: editedEventPriceText,
                      startDate: startDate,
                      startTime: startTime,
                      endTime: endTime

                  })
              });

              // Check if the request was successful
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              // Update the camp in the local state
              setEventData((prevData) => {
                  const newData = [...prevData];
                  newData[index] = {
                      ...newData[index],
                      location: editedEventLocationText,
                      price: editedEventPriceText,
                      startDate: startDate,
                      startTime: startTime,
                      endTime: endTime
                  };
                  return newData;
              });

              // Close the Event modal
              closeEditEventModal();
          } catch (error) {
              console.error('Error updating event:', error);
              // Display an error message to the user
              // This could be done with a Toast, Alert, or some other UI component
              // You could also use state to set an error message that is displayed in the modal
          }
      }
        }
      }




    };


  

  

return (

    <ScrollView>
      <Text>Camps</Text>
        {campData.map((camp, index) => (
        <View key={index} style={styles.container}>  
            <Text>{camp.campName} </Text>
            <Text>Location: {camp.location}</Text> 
    
            <Text>Duration: {new Date(camp.startDate).toLocaleDateString('en-GB')} - {new Date(camp.endDate).toLocaleDateString('en-GB')}</Text>


            <Text>Start Time: {new Date(camp.startTime).toLocaleTimeString()} - End Time: {new Date(camp.endTime).toLocaleTimeString()}</Text>
            <Text>Full Camp Price: £{camp.price5Day} </Text>
            <Text>Booking Options</Text>
            <Text>4 Days Price: £{camp.price4Day} </Text>
            <Text>3 Days Price: £{camp.price3Day} </Text>
            <Text>2 Days Price: £{camp.price2Day} </Text>
            <Text>1 Day Price: £{camp.price1Day} </Text>

            <TouchableOpacity style={styles.button} onPress={() => openEditModal(index)}>
            <Text style={styles.buttonText} >Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}  onPress={() => ViewCampAttendance(index)}>
            <Text style={styles.buttonText}>View Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}  onPress={() => openDeleteCampModal(index)}>
            <Text style={styles.buttonText}>Delete Camp</Text>
            </TouchableOpacity>
        </View>
        ))}

        <Text>Events</Text>
        {eventData.map((event, index) => (
        <View key={index} style={styles.container}>  
    
            <Text>Event Name: {event.eventName}</Text>
            <Text>Location: {event.location} </Text> 
    
            <Text>Date: {new Date(event.startDate).toLocaleDateString('en-GB')}  </Text>


            <Text>Start Time: {new Date(event.startTime).toLocaleTimeString()}</Text>

            <Text>End Time: {new Date(event.endTime).toLocaleTimeString()}</Text>
            <Text>Price: £{event.price} </Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={() => openEditEventModal(index)}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}  onPress={() => ViewEventAttendance(index)}>
              <Text style={styles.buttonText}>View Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}  onPress={() => openDeleteEventModal(index)}>
              <Text style={styles.buttonText}>Delete Event</Text>
            </TouchableOpacity>
        </View>
        ))}
    

{/* Modal - Edit Camp Modal */}


<Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible}
      onRequestClose={closeEditModal}
    >
     <View style={styles.modalContainer}>
      <ScrollView>

      <View style={styles.modalContent}>
      <View style={{ flexDirection: 'column' }}>
      <View style={styles.fieldRow}>
       
          <Text style={styles.label}>Location</Text>
      </View>
          <View>
          <TextInput
            style={styles.textInput}
            value={editedLocationText}
            onChangeText={setEditedLocationText}
            placeholder='Enter here..'
          />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Start Date:</Text>
  
          {startPickerVisible && (
            
            <DateTimePicker
              testID="dateTimePickerStart"
              value={startDate}
              mode={'date'}
              display="default"
              onChange={handleStartChange}
         
            />
            
          )}
              
        </View>



        <View style={styles.fieldRow}>
          <Text style={styles.label}>End Date:</Text>
  
          {startPickerVisible && (
            
            <DateTimePicker
              testID="dateTimePickerStart"
              value={endDate}
              mode={'date'}
              display="default"
              onChange={handleEndChange}
         
            />
            
          )}
              
        </View>





        <View style={styles.fieldRow}>
        <Text style={styles.label}>Select a start time:</Text>
                  {show && (
                  <DateTimePicker
                  testID="dateTimePicker"
                  value={startTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onStartChange}
                />
              )}
              
          </View>


          <View style={styles.fieldRow}>
            <Text style={styles.label}>Select a end time:</Text>
              {show && (
              <DateTimePicker
              testID="dateTimePicker"
              value={endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onEndChange}
            />
          )}
          </View>

          <Text style={styles.label}>Full Price(£)</Text>
          <View>
            <TextInput
            style={styles.textInput}
            value={edited5DayPriceText}
            onChangeText={setEdited5DayPrice}
            placeholder='Enter here..'
          />
          </View>
          

          <Text style={styles.label}>4 Day Camp Price(£)</Text>
          <View>
            <TextInput
            style={styles.textInput}
            value={edited4DayPriceText}
            onChangeText={setEdited4DayPrice}
            placeholder='Enter here..'
          />
          </View>

          <Text style={styles.label}>3 Day Camp Price(£)</Text>
          <View>
            <TextInput
            style={styles.textInput}
            value={edited3DayPriceText}
            onChangeText={setEdited3DayPrice}
            placeholder='Enter here..'
          />
          </View>

          <Text style={styles.label}>2 Day Camp Price(£)</Text>
          <View>
            <TextInput
            style={styles.textInput}
            value={edited2DayPriceText}
            onChangeText={setEdited2DayPrice}
            placeholder='Enter here..'
          />
          </View>

          <Text style={styles.label}>1 Day Camp Price(£)</Text>
          <View>
            <TextInput
            style={styles.textInput}
            value={edited1DayPriceText}
            onChangeText={setEdited1DayPrice}
            placeholder='Enter here..'
          />
          </View>


          <View style={styles.fieldRow}>

            <TouchableOpacity style={styles.button}  onPress={() => updateCamp(editedCampIndex)}>
              <Text style={styles.buttonText}>Update Camp</Text>
            </TouchableOpacity>

          </View>




          <View style={styles.fieldRow}>

            <TouchableOpacity style={styles.button}  onPress={closeEditModal}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>

          </View>



      </View>



     
</View>
      


      
     
  
  </ScrollView>
   
  </View>
    </Modal>







  {/* Attendance Event View Modal */}

  <Modal
      animationType="slide"
      transparent={true}
      visible={eventAttendanceModalVisible}
      onRequestClose={closeEventAttendanceModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          {/* Iterate over all participants  */}
 
          <View>
            <Text>Event Attendance</Text>
          </View>
      


            <FlatList
              data={bookingData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'column' }}>
                  <Text>Name: {item.name}</Text>
                  <Text>Attendance Status: {item.attendanceStatus}</Text>
                  <Text>Contact Number: {item.emergencyContactNumber}</Text>
                  {/* Other participant details */}
          
                
          </View>
        )}
      />

                
          <View>
            <TouchableOpacity style={styles.button}  onPress={closeEventAttendanceModal}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>
          </View> 
          </View>
        </View>
      
    </Modal>





          {/* Modal  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={openDeleteCampModalVisible}
            onRequestClose={closeDeleteCampModal}

          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.label}>Are you sure you want to delete this Camp? 
                    Once deleted this is removed from the Database and effect current bookings not advised* Contact HoeyTech for more info </Text>
                      <TouchableOpacity style={styles.button} onPress={removeCamp}>
                        <Text style={styles.buttonText}>Yes</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button} onPress={closeDeleteCampModal}>
                        <Text style={styles.buttonText}>No</Text>
                      </TouchableOpacity>
                  </View>

              </View> 
        </View>
                                
      </Modal> 




          {/* Modal  - Delete Event confirmation  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={openDeleteEventModalVisible}
            onRequestClose={closeDeleteEventModal}

          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.label}>Are you sure you want to delete this Camp? 
                    Once deleted this is removed from the Database and effect current bookings not advised* Contact HoeyTech for more info </Text>
                      <TouchableOpacity style={styles.button} onPress={removeEvent}>
                        <Text style={styles.buttonText}>Yes</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button} onPress={closeDeleteCampModal}>
                        <Text style={styles.buttonText}>No</Text>
                      </TouchableOpacity>
                  </View>

              </View> 
        </View>
                                
      </Modal> 





  {/* Attendance Camp View Modal  */}

  <Modal
      animationType="slide"
      transparent={true}
      visible={campAttendanceModalVisible}
      onRequestClose={closeCampAttendanceModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          {/* Iterate over all participants  */}
 
          <View>
            <Text>Attendance</Text>
          </View>
      


            <FlatList
              data={bookingData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'column' }}>
                  <Text>Name: {item.name}</Text>
                  <Text>Attendance Status: {item.attendanceStatus}</Text>
                  <Text>Contact Number: {item.emergencyContactNumber}</Text>
                  {/* Other participant details */}
          
                
          </View>
        )}
      />

                
          <View>
            <TouchableOpacity style={styles.button}  onPress={closeCampAttendanceModal}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>
          </View> 
          </View>
        </View>
      
    </Modal>



    {/* Modal - Edit Event Modal */}

    <Modal
      animationType="slide"
      transparent={true}
      visible={editEventModalVisible}
      onRequestClose={closeEditEventModal}
    >
    <View style={styles.modalContainer}>
      <ScrollView>

      <View style={styles.modalContent}>
      <View style={{ flexDirection: 'column' }}>
      <View style={styles.fieldRow}>
       
      <Text style={styles.label}>Location</Text>
      </View>
          <View>
          <TextInput
            style={styles.textInput}
            value={editedEventLocationText}
            onChangeText={setEditedEventLocationText}
            placeholder='Enter here..'
          />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Start Date:</Text>
  
          {startPickerVisible && (
            
            <DateTimePicker
              testID="dateTimePickerStart"
              value={startDate}
              mode={'date'}
              display="default"
              onChange={handleStartChange}
         
            />
            
          )}
              
        </View>




        <View style={styles.fieldRow}>
        <Text style={styles.label}>Select a start time:</Text>
                  {show && (
                  <DateTimePicker
                  testID="dateTimePicker"
                  value={startTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onStartChange}
                />
              )}
              
          </View>


          <View style={styles.fieldRow}>
            <Text style={styles.label}>Select a end time:</Text>
              {show && (
              <DateTimePicker
              testID="dateTimePicker"
              value={endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onEndChange}
            />
          )}
          </View>

          <Text style={styles.label}>Full Price(£)</Text>
          <View>
            <TextInput
            style={styles.textInput}
            value={editedEventPriceText}
            onChangeText={setEditedEventPrice}
            placeholder='Enter here..'
          />
          </View>
          

          <View style={styles.fieldRow}>

            <TouchableOpacity style={styles.button}  onPress={() => updateEvent(editedEventIndex)}>
              <Text style={styles.buttonText}>Update Event</Text>
            </TouchableOpacity>

          </View>




          <View style={styles.fieldRow}>

            <TouchableOpacity style={styles.button}  onPress={closeEditModal}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>

          </View>



      </View>



     
</View>
      


      
     
  
  </ScrollView>
   
  </View>
    </Modal>




    </ScrollView>





  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      // borderWidth: 2,
      // borderColor: '#ccc',
      // padding: 20,
      // margin: 20,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      width: '100%',

    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '100%',
    },
    fieldRow: {
      flexDirection: 'row',
       marginTop: 15,
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
    },
    button: {
      backgroundColor: '#4CAF50',
      borderRadius: 4,
      padding: 10,
      marginBottom: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
  });
  


export default ManageBookings;