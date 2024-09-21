import React, { useEffect,useState } from 'react';
import {ScrollView, StyleSheet, View, SafeAreaView, TextInput, Button, Text, TouchableOpacity, Modal,FlatList,Platform } from 'react-native';
import validator from 'validator';
import { PreventRemoveProvider, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';



const ManageBookings = ({ navigation }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [campData, setCampData] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [bookingData, setBookingData] = useState([]);
  
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editEventModalVisible, setEditEventModalVisible] = useState(false);
     

    const [campAttendanceModalVisible, setCampAttendanceModalVisible] = useState(false);
    const [eventAttendanceModalVisible, setEventAttendanceModalVisible] = useState(false);
  
    const [openDeleteCampModalVisible, setDeleteCampModal] = useState(false);
    const [selectedCamp, setSelectedCamp] = useState('');

    const [openDeleteEventModalVisible, setDeleteEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState('');



    //---- Android ------

    const [startAndroidDate, setStartAndroidDate] = useState(new Date());
    const [endAndroidDate, setEndAndroidDate] = useState(new Date());
    
    const [startAndroidTime, setStartAndroidTime] = useState(new Date());
    const [endAndroidTime, setEndAndroidTime] = useState(new Date());


    const [openAndroidDeleteCampModalVisible, setDeleteAndroidCampModal] = useState(false);
    const [openAndroidDeleteEventModalVisible, setDeleteAndroidEventModal] = useState(false);


    
    const [showStartDatePickerVisible, setShowStartDatePicker] = useState(false);
    const [showEndDatePickerVisible, setShowEndDatePicker] = useState(false);

    const [showStartTimePickerVisible, setShowStartTimePicker] = useState(false);
    const [showEndTimePickerVisible, setShowEndTimePicker] = useState(false);
// ---------


    //----- iOS ------
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

const [date, setDate] = useState(new Date(1598051730000));
const [mode, setMode] = useState('date');
const [show, setShow] = useState(false);


const [showTimePicker, setShowTimePicker] = useState(false);

const route = useRoute()
const dataT = route.params?.dataTrigger;
  
    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          setIsLoggedIn(!!jwtToken);
 
        
        } catch (error) {
          console.error('Error fetching JWT token:', error);
        }
      };


   



      if(dataT){
        handleCamps();
        handleEvents();
      }
  

  
      checkAuthentication(); // Call the function to check authentication status when component mounts
    
    handleCamps();
    handleEvents();
    
    
    }, [route.params]);
    
    // Empty dependency array ensures the effect runs only once when component mounts
//GET CAMPS || EVENTS 

const handleCamps = async () => {

    // Fetch all camps       
    const apiGetCamps =
    Platform.OS === 'ios'
      ? 'http://localhost:3000/api/camps'  // iOS simulator uses localhost
      : 'http://192.168.1.186:3000/api/camps';  // Android emulator 

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

  const apiGetEvents =
  Platform.OS === 'ios'
    ? 'http://localhost:3000/api/events'  // iOS simulator uses localhost
    : 'http://192.168.1.186:3000/api/events';  // Android emulator 


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
    setShowStartDatePicker(true);
  };

  const showEndPicker = () => {
    setShowEndDatePicker(true);
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





  const showStartTimePicker = () => {
    setShowStartTimePicker(true);
  };

  const showEndTimePicker = () => {
    setShowEndTimePicker(true);
  };


  //----------- Android ----
  const handleAndroidStartChange = (event, selectedDate) => {

    const currentDate = selectedDate || startAndroidDate;
    // setStartAndroidDate(currentDate);

    if (event.type === 'dismissed') {
      setShowStartDatePicker(false);
      return;
    }

    if (event.type === 'set') {
      
    
      setShowStartDatePicker(false);
      setStartAndroidDate(currentDate);
      // console.log(selectedDate);
      // console.log(startAndroidDate);
      // setShowStartDatePicker(false);


    }


  };



  //----------- Android ----
 

  const handleAndroidEndChange = (event, selectedDate) => {
    
    const currentDate = selectedDate || endAndroidDate;
    setEndAndroidDate(currentDate);
    setShowEndDatePicker(false);


    if (event.type === 'dismissed') {
      setShowEndDatePicker(false);
      return;
    }

    if (event.type === 'set' && currentDate) {
      
      setEndAndroidDate(currentDate);
      setShowEndDatePicker(false);

    }

    
  };

  const onStartAndroidChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    const currentTime = selectedTime || startAndroidTime;
    setStartAndroidTime(currentTime);

    if (event.type === 'dismissed') {
      setShowStartTimePicker(false);
  
    }

    if (event.type === 'set' && currentDate) {
      setShowStartTimePicker(false);
      setStartAndroidTime(currentTime);
    }

  };
  
  const onEndAndroidChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    const currentTime = selectedTime || endAndroidTime;
    setEndAndroidTime(currentTime);



    if (event.type === 'dismissed') {
      setShowEndTimePicker(false);
  
    }

    if (event.type === 'set' && currentDate) {
      setShowEndTimePicker(false);
      setEndAndroidTime(currentTime);
    }
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
      
      if(Platform.OS === 'android'){

        setShowStartDatePicker(false);
        setShowEndDatePicker(false);
        setShowStartTimePicker(false);
        setShowEndTimePicker(false);
      }

      if(Platform.OS === 'ios'){
        //ioS
        setStartPickerVisible(true);
        setEndPickerVisible(true);
        setShow(true);
      }
       
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


        setStartAndroidDate(new Date(campData[index].startDate));
        setEndAndroidDate(new Date(campData[index].endDate));

        setStartAndroidTime(new Date(campData[index].startTime));
        setEndAndroidTime(new Date(campData[index].endTime));

      }


  


  
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


      if(Platform.OS === 'android'){

        setShowStartDatePicker(false);
        setShowEndDatePicker(false);
        setShowStartTimePicker(false);
        setShowEndTimePicker(false);
      }

      if(Platform.OS === 'ios'){
        //ios
        setStartPickerVisible(true);
        setEndPickerVisible(true);
        setShow(true);
      }

     // PREFILL EDIT FORM 
      if (index !== -1) {

        // Set editedText to the location of the event being edited
        setEditedEventLocationText(eventData[index].location);
        setEditedEventPrice(eventData[index].price);
       
        setStartDate(new Date(eventData[index].startDate));
        setStartTime(new Date(eventData[index].startTime));
        setEndTime(new Date(eventData[index].endTime));
               
        setStartAndroidDate(new Date(eventData[index].startDate));
        setEndAndroidDate(new Date(eventData[index].endDate));
        
        setStartAndroidTime(new Date(eventData[index].startTime));
        setEndAndroidTime(new Date(eventData[index].endTime));


      }

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

        const apiGetCampAttendance =
        Platform.OS === 'ios'
          ? `http://localhost:3000/api/getCampAttendance/${id}`  // iOS simulator uses localhost
          : `http://http://192.168.1.186:3000//api/getCampAttendance/${id}`; // Android emulator 

        const response = await fetch(apiGetCampAttendance, {
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
            const participantAttendanceStatus = participant.attendanceStatus;
            const participantEmergencyContactNumber = participant.emergencyContactNumber;
            const participantsDaysSelected = participant.daysSelectedArray;
            const participantsAdditionalInfo = participant.additionalInfo;
            // Access other participant details as needed

          // Create an object with participant details and push it to the bookingData array
          bookingData.push({
            name: participantName,
            age: participantAge,
            attendanceStatus: participantAttendanceStatus,
            emergencyContactNumber: participantEmergencyContactNumber,
            participantsDaysSelected: participantsDaysSelected,
            participantsAdditionalInfo: participantsAdditionalInfo
            
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



        const getEventAttendance =
        Platform.OS === 'ios'
          ? `http://localhost:3000/api/getEventAttendance/${id}`  // iOS simulator uses localhost
          : `http://http://192.168.1.186:3000/api/getEventAttendance/${id}`;  // Android emulator 
  
          const response = await fetch(getEventAttendance, {
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
            const numberOfEventParticipants = participantArray.length;
            // Iterate over participant array
            participantArray.forEach(participant => {
              // Access participant details
              const participantName = participant.name;
              const participantAge = participant.age;
              const participantAttendanceStatus = participant.attendanceStatus;
              const participantEmergencyContactNumber = participant.emergencyContactNumber;
              const participantsAdditionalInfo = participant.additionalInfo;
              const participantsAllergies = participant.allergies;

              // Access other participant details as needed
  
            // Create an object with participant details and push it to the bookingData array
            bookingData.push({
              name: participantName,
              age: participantAge,
              attendanceStatus: participantAttendanceStatus,
              emergencyContactNumber: participantEmergencyContactNumber,
              additionalInfo: participantsAdditionalInfo,
              allergies: participantsAllergies
      
         
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

  const closeDeleteAndroidCampModal = async () => {

    setDeleteAndroidCampModal(false);

  };

  const closeDeleteEventModal = async () => {

    setDeleteEventModal(false);

  };


  const closeAndroidDeleteEventModal = async () => {

    setDeleteAndroidEventModal(false);

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

  const openDeleteAndriodCampModal = async (index) => {

    setDeleteAndroidCampModal(true);
    const id = campData[index]._id; // Assuming each camp has an '_id' property
    setSelectedCamp(id);


  };


  const openDeleteAndroidEventModal = async (index) => {

    setDeleteAndroidEventModal(true);
    const id = eventData[index]._id; // Assuming each event has an '_id' property
    setSelectedEvent(id);


  };



  const removeCamp = async (index) => {

    const jwtToken = await AsyncStorage.getItem('jwtToken');
    const id = selectedCamp; // Assuming each camp has an '_id' property


    const apiGetCampToDelete =
    Platform.OS === 'ios'
      ? `http://localhost:3000/api/camps/${id}`  // iOS simulator uses localhost
      : `http://192.168.1.186:3000/api/camps/${id}`;  // Android emulator 



    try {

     
      await fetch(apiGetCampToDelete, {
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

      handleCamps();
      navigation.navigate('Admin Dashboard');

      


    } catch (error) {
      console.error('Error removing camp:', error);
    }
  };


  // Android 
  const removeCampAndroid = async (index) => {

    const jwtToken = await AsyncStorage.getItem('jwtToken');
    const id = selectedCamp; // Assuming each camp has an '_id' property

    try {
     
      await fetch(`http://192.168.1.186:3000/api/camps/${id}`, { // Android emulator , {
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

        setDeleteAndroidCampModal(false);

        return newData;
      });

      handleCamps();
      navigation.navigate('Admin Dashboard');

      


    } catch (error) {
      console.error('Error removing camp:', error);
    }
  };





  const removeEvent = async (index) => {

    const jwtToken = await AsyncStorage.getItem('jwtToken');
    const id = selectedEvent; // Assuming each event has an '_id' property


    const apiGetEventToDelete =
    Platform.OS === 'ios'
      ? `http://localhost:3000/api/events/${id}`  // iOS simulator uses localhost
      : `http://192.168.1.186:3000/api/events/${id}`; // Android emulator 



    try {

     
      await fetch(apiGetEventToDelete, {
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

      setDeleteEventModal(false);
      handleEvents();
      navigation.navigate('Admin Dashboard');
      


    } catch (error) {
      console.error('Error removing event:', error);
    }
  };



//Android 

const removeEventAndroid = async (index) => {

  const jwtToken = await AsyncStorage.getItem('jwtToken');
  const id = selectedEvent; // Assuming each event has an '_id' property


  try {

   
    await fetch(`http://192.168.1.186:3000/api/events/${id}` , {
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

      setDeleteAndroidEventModal(false);
      return newData;
    });


    handleEvents();
    navigation.navigate('Admin Dashboard');
    


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
              const response =  fetch(`http://192.168.1.186:3000/api/updateCamp/${id}` , {
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



    const updateCampAndroid = async (index) => {

      const jwtToken = await AsyncStorage.getItem('jwtToken');
    
      if (index !== -1) {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        const camp = campData[index]; // get the camp object
  
  
        if(camp)
        {
          if (camp) {
            const id = camp._id; // get the id of the camp object
  
            try {
                const response = await fetch(`http://192.168.1.186:3000/api/updateCampAndroid/${id}` , {
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
                        startDate: startAndroidDate,
                        endDate: endAndroidDate,
                        startTime: startAndroidTime,
                        endTime: endAndroidTime
  
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
                        startDate: startAndroidDate,
                        endDate: endAndroidDate,
                        startTime: startAndroidTime,
                        endTime: endAndroidTime
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
              const response = await fetch(`http://localhost:3000/api/updateEvent/${id}`  , {
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

              // Update the event in the local state
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




  const updateAndroidEvent = async (index) => {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
  
    if (index !== -1) {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const event = eventData[index]; // get the event object
     
      if(event)
      {

        if (event) {

          const id = event._id; // get the id of the event object

      

          try {

              const response = await fetch(`http://192.168.1.186:3000/api/updateEventAndroid/${id}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${jwtToken}`,
                  },
                  body: JSON.stringify({
                      location: editedEventLocationText,
                      price: editedEventPriceText,
                      startDate: startAndroidDate,
                      startTime: startAndroidTime,
                      endTime: endAndroidTime

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
                      startDate: startAndroidDate,
                      startTime: startAndroidTime,
                      endTime: endAndroidTime
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
      <View style={styles.container2}>
        <View style={styles.container}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Camps</Text>
        </View>


        {Platform.OS === 'ios' &&  
          <SafeAreaView>
           {campData.map((camp, index) => (
            <View key={index} style={styles.containerCard}> 

                <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>{camp.campName} </Text>
                </View>

                <View style={styles.BookingOptionsContainerLine}></View>

                <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>Location: {camp.location}</Text> 
                </View>

                <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>Duration: {new Date(camp.startDate).toLocaleDateString('en-GB')} - {new Date(camp.endDate).toLocaleDateString('en-GB')}</Text>
                </View>
        
               
                <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>Time: {new Date(camp.startTime).toLocaleTimeString()} - {new Date(camp.endTime).toLocaleTimeString()}</Text>
                </View>
            
                <View style={styles.BookingOptionsContainer}>
                  <Text>
                    <Text style={styles.headerText}>Full Camp Price: </Text>
                    £{camp.price5Day}
                  </Text> 
                </View>

                <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Participants Booked:  </Text>
                    {camp.participantsBooked}
                  </Text>
                </View>

                <View style={styles.BookingOptionsContainerLine}></View>

                <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>Booking Options</Text>
                </View>

                <View style={styles.BookingOptionsContainerLine}></View>
                

                <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>4 Days Price: </Text>
                    £{camp.price4Day}
                  </Text> 
                </View>
        

                <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>3 Days Price: </Text>
                    £{camp.price3Day}
                  </Text>
                </View>
              

                <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>2 Days Price: </Text>
                    £{camp.price2Day}
                  </Text>
                </View>


                <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>1 Day Price: </Text>
                    £{camp.price1Day}
                  </Text>
                </View>


          
                <View style={styles.BookingButtons}>
                  
                  <View>
                      <TouchableOpacity style={styles.button} onPress={() => openEditModal(index)}>
                        <View style={styles.buttonContent}>
                          <Text style={styles.buttonText}>Edit Camp Details </Text>
                          <Ionicons name="create-outline" size={20} style={styles.icon} color="#ecf0ff" />
                        </View>
                      </TouchableOpacity>
                  </View>
              

                  <View>
                    <TouchableOpacity style={styles.button} onPress={() => ViewCampAttendance(index)}>
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>View Attendance </Text>
                        <Ionicons name="today-outline" size={20} style={styles.icon} color="#ecf0ff" />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View>
                    <TouchableOpacity style={styles.button} onPress={() => openDeleteCampModal(index)}>
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Delete Camp </Text>
                        <Ionicons name="trash-outline" size={20} style={styles.icon} color="#ecf0ff" />
                      </View>
                    </TouchableOpacity>
                  </View>
    
        
                </View>


            </View>

            ))}
    


    {/* Events */}

        <Text style={styles.headerText}>Events</Text>
            {eventData.map((event, index) => (
            <View key={index} style={styles.containerCard}>  
        
    
          <View>



              <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Event Name: </Text>
                    {event.eventName}
                  </Text>
                </View>


              <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Location: </Text>
                    {event.location}
                  </Text>
              </View>

              <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Date: </Text>
                    {new Date(event.startDate).toLocaleDateString('en-GB')}
                  </Text>
              </View>

              <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>Time: {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}</Text>
                </View>


              <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Price:  </Text>
                    £{event.price}
                  </Text>
              </View>

              
              <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Participants Booked:  </Text>
                    {event.participantsBooked}
                  </Text>
              </View>

        
                </View>


                  <View>
                      <TouchableOpacity style={styles.button} onPress={() => openEditEventModal(index)}>
                        <View style={styles.buttonContent}>
                          <Text style={styles.buttonText}>Edit Event </Text>
                          <Ionicons name="create-outline" size={20} style={styles.icon} color="#ecf0ff" />
                        </View>
                      </TouchableOpacity>
                  </View>
              
                  <View>
                      <TouchableOpacity style={styles.button} onPress={() => ViewEventAttendance(index)}>
                        <View style={styles.buttonContent}>
                          <Text style={styles.buttonText}>View Attendance </Text>
                          <Ionicons name="today-outline" size={20} style={styles.icon} color="#ecf0ff" />
                        </View>
                      </TouchableOpacity>
                  </View>

                  <View>
                      <TouchableOpacity style={styles.button} onPress={() => openDeleteEventModal(index)}>
                        <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Delete Event</Text>
                          <Ionicons name="trash-outline" size={20} style={styles.icon} color="#ecf0ff" />
                        </View>
                      </TouchableOpacity>
                  </View>

            </View>
            ))}
        


            </SafeAreaView>

            }


        {/* Andriod Overview - ManageBookings */}

        {Platform.OS === 'android' &&  
          <SafeAreaView>
           {campData.map((camp, index) => (
            <View key={index} style={styles.containerCard}> 

                <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>{camp.campName} </Text>
                </View>

                <View style={styles.BookingOptionsContainerLine}></View>

                <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>Location: {camp.location}</Text> 
                </View>

                <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>Duration: {new Date(camp.startDate).toLocaleDateString('en-GB')} - {new Date(camp.endDate).toLocaleDateString('en-GB')}</Text>
                </View>


                <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>Time: {new Date(camp.startTime).toLocaleTimeString()} - {new Date(camp.endTime).toLocaleTimeString()}</Text>
                </View>

            
                <View style={styles.BookingOptionsContainer}>
                  <Text>
                    <Text style={styles.headerText}>Full Camp Price: </Text>
                    £{camp.price5Day}
                  </Text> 
                </View>

                <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Participants Booked:  </Text>
                    {camp.participantsBooked}
                  </Text>
                </View>

                <View style={styles.BookingOptionsContainerLine}></View>

                <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>Booking Options</Text>
                </View>

                <View style={styles.BookingOptionsContainerLine}></View>
                

                <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>4 Days Price: </Text>
                    £{camp.price4Day}
                  </Text> 
                </View>
        

                <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>3 Days Price: </Text>
                    £{camp.price3Day}
                  </Text>
                </View>
              

                <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>2 Days Price: </Text>
                    £{camp.price2Day}
                  </Text>
                </View>


                <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>1 Day Price: </Text>
                    £{camp.price1Day}
                  </Text>
                </View>


          
                <View style={styles.BookingButtons}>
                  
                  <View>
                      <TouchableOpacity style={styles.button} onPress={() => openEditModal(index)}>
                        <View style={styles.buttonContent}>
                          <Text style={styles.buttonText}>Edit Camp Details </Text>
                          <Ionicons name="create-outline" size={20} style={styles.icon} color="#ecf0ff" />
                        </View>
                      </TouchableOpacity>
                  </View>
              

                  <View>
                    <TouchableOpacity style={styles.button} onPress={() => ViewCampAttendance(index)}>
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>View Attendance </Text>
                        <Ionicons name="today-outline" size={20} style={styles.icon} color="#ecf0ff" />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View>
                    <TouchableOpacity style={styles.button} onPress={() => openDeleteAndriodCampModal(index)}>
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Delete Camp </Text>
                        <Ionicons name="trash-outline" size={20} style={styles.icon} color="#ecf0ff" />
                      </View>
                    </TouchableOpacity>
                  </View>
    
        
                </View>


            </View>

            ))}
    


    {/* Events */}

        <Text style={styles.headerText}>Events</Text>
            {eventData.map((event, index) => (
            <View key={index} style={styles.containerCard}>  
        
    
          <View>



              <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Event Name: </Text>
                    {event.eventName}
                  </Text>
                </View>


              <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Location: </Text>
                    {event.location}
                  </Text>
              </View>

              <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Date: </Text>
                    {new Date(event.startDate).toLocaleDateString('en-GB')}
                  </Text>
              </View>

              <View style={styles.BookingOptionsContainer}>
                  <Text style={styles.headerText}>Time: {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}</Text>
                </View>

              <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Price:  </Text>
                    £{event.price}
                  </Text>
              </View>

              
              <View style={styles.BookingOptionsText}>
                  <Text>
                    <Text style={styles.headerText}>Participants Booked:  </Text>
                    {event.participantsBooked}
                  </Text>
              </View>

        
                </View>


                  <View>
                      <TouchableOpacity style={styles.button} onPress={() => openEditEventModal(index)}>
                        <View style={styles.buttonContent}>
                          <Text style={styles.buttonText}>Edit Event </Text>
                          <Ionicons name="create-outline" size={20} style={styles.icon} color="#ecf0ff" />
                        </View>
                      </TouchableOpacity>
                  </View>
              
                  <View>
                      <TouchableOpacity style={styles.button} onPress={() => ViewEventAttendance(index)}>
                        <View style={styles.buttonContent}>
                          <Text style={styles.buttonText}>View Attendance </Text>
                          <Ionicons name="today-outline" size={20} style={styles.icon} color="#ecf0ff" />
                        </View>
                      </TouchableOpacity>
                  </View>

                  <View>
                      <TouchableOpacity style={styles.button} onPress={() => openDeleteAndroidEventModal(index)}>
                        <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Delete Event</Text>
                          <Ionicons name="trash-outline" size={20} style={styles.icon} color="#ecf0ff" />
                        </View>
                      </TouchableOpacity>
                  </View>

            </View>
            ))}
        


            </SafeAreaView>

            }
          

          




    {/* Modal - Edit Camp Modal */}


    <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={closeEditModal}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          
          <ScrollView>
          
          <View style={styles.formContent}>
            <Text style={styles.validationText}>* Edit by the Prices by clicking on the value you would like to change:</Text>
          </View>

          <View style={styles.formContent}>
              <Text style={styles.headerText}>Location: </Text>
              <TextInput
                style={styles.textInput}
                value={editedLocationText}
                onChangeText={setEditedLocationText}
                placeholder='Enter here..'
              />
            </View>



            <View style={styles.formContent}>
              <Text style={styles.headerText}>Full Price(£) </Text>
                <TextInput
                style={styles.textInput}
                value={edited5DayPriceText}
                onChangeText={setEdited5DayPrice}
                placeholder='Enter here..'
              />
              </View>
              

              <View style={styles.formContent}>

              <Text style={styles.headerText}>4 Day Camp Price(£) </Text>
                <TextInput
                style={styles.textInput}
                value={edited4DayPriceText}
                onChangeText={setEdited4DayPrice}
                placeholder='Enter here..'
              />
              </View>

              <View style={styles.formContent}>
              <Text style={styles.headerText}>3 Day Camp Price(£) </Text>
                <TextInput
                style={styles.textInput}
                value={edited3DayPriceText}
                onChangeText={setEdited3DayPrice}
                placeholder='Enter here..'
              />
              </View>

              <View style={styles.formContent}>
                <Text style={styles.headerText}>2 Day Camp Price(£) </Text>
                  <TextInput
                  style={styles.textInput}
                  value={edited2DayPriceText}
                  onChangeText={setEdited2DayPrice}
                  placeholder='Enter here..'
                />
              </View>

              <View style={styles.formContent}>
              <Text style={styles.headerText}>1 Day Camp Price(£) </Text>
                <TextInput
                style={styles.textInput}
                value={edited1DayPriceText}
                onChangeText={setEdited1DayPrice}
                placeholder='Enter here..'
              />
              </View>

                            
          




          {Platform.OS === 'ios' &&  
          <SafeAreaView>
            

            <View style={styles.formContent}>
              <Text style={styles.headerText}>Start Date: </Text>
      
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

            <View style={styles.formContent}>
              <Text style={styles.headerText}>End Date: </Text>
      
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





            <View style={styles.formContent}>
            <Text style={styles.headerText}>Select a start time: </Text>
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


              <View style={styles.formContent}>
                <Text style={styles.headerText}>Select a end time: </Text>
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

              <View>
                <TouchableOpacity style={styles.button}  onPress={() => updateCamp(editedCampIndex)}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Update Camp </Text>
                        <Ionicons name="create-outline" size={20} style={styles.icon} color="#ecf0ff" />
                  </View>
                </TouchableOpacity>
              </View>

              <View>
                  <TouchableOpacity style={styles.button} onPress={closeEditModal}>
                    <View style={styles.buttonContent}>
                      <Text style={styles.buttonText}>Exit </Text>
                    <Ionicons name="close-circle-outline" size={20} style={styles.icon} color="#ecf0ff" />
                  </View>
                </TouchableOpacity>
              </View>
          
              </SafeAreaView>
              }



            
                  
          


          {Platform.OS === 'android' &&  

          <SafeAreaView>

              <View style={styles.BookingOptionsText}>
                  <Text>
                  <Text style={styles.headerText}>Start Date:  </Text> 
                      {new Date(startAndroidDate).toLocaleDateString('en-GB')}     
                  </Text>
              </View>


              <View style={styles.BookingOptionsText}>
                  <Text>
                  <Text style={styles.headerText}>End Date:  </Text> 
                      {new Date(endAndroidDate).toLocaleDateString('en-GB')}     
                  </Text>
              </View>

     

              <View style={styles.BookingOptionsText}>
                  <Text>
                  <Text style={styles.headerText}>Start Time:  </Text> 
                      {new Date(startAndroidTime).toLocaleTimeString()}     
                  </Text>
              </View>

              <View style={styles.BookingOptionsText}>
                <Text>
                  <Text style={styles.headerText}>End Time:  </Text> 
                    {new Date(endAndroidTime).toLocaleTimeString()}     
                </Text>
              </View>


              {/* Android */}
              <View style={styles.formContent}>
              
        
                {showStartDatePickerVisible && (
                  
                  <DateTimePicker
                    testID="dateTimePickerStart"
                    value={startAndroidDate}
                    mode={'date'}
                    display="default"
                    onChange={handleAndroidStartChange}
              
                  />
                  
                )}
                  
              </View>

              <View style={styles.formContent}>

        
                {showEndDatePickerVisible && (
                  
                  <DateTimePicker
                    testID="dateTimePickerStart"
                    value={endAndroidDate}
                    mode={'date'}
                    display="default"
                    onChange={handleAndroidEndChange}
              
                  />
                  
                )}

              </View>


              <View style={styles.formContent}>
      
                      {showStartTimePickerVisible && (
                      <DateTimePicker
                      testID="dateTimePicker"
                      value={startAndroidTime}
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={onStartAndroidChange}
                    />
                  )}
                  
              </View>


              <View style={styles.formContent}>

                  {showEndTimePickerVisible && (
                  <DateTimePicker
                  testID="dateTimePicker"
                  value={endAndroidTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onEndAndroidChange}
                />
              )}
              </View>



                        <TouchableOpacity onPress={showStartPicker} style={styles.button}>
                              <View style={styles.buttonContent}>
                                  <Text style={styles.buttonText}> Select a start date </Text>
                                  <Ionicons name="book-outline" size={20} style={styles.icon} />
                              </View>
                        </TouchableOpacity>
                
                        <TouchableOpacity onPress={showEndPicker} style={styles.button}>
                              <View style={styles.buttonContent}>
                                  <Text style={styles.buttonText}> Select a end date </Text>
                                  <Ionicons name="book-outline" size={20} style={styles.icon} />
                              </View>
                        </TouchableOpacity>



            

                        <TouchableOpacity onPress={showStartTimePicker} style={styles.button}>
                              <View style={styles.buttonContent}>
                                  <Text style={styles.buttonText}> Select a start time </Text>
                                  <Ionicons name="book-outline" size={20} style={styles.icon} />
                              </View>
                        </TouchableOpacity>

                    

                        <TouchableOpacity onPress={showEndTimePicker} style={styles.button}>
                              <View style={styles.buttonContent}>
                                  <Text style={styles.buttonText}> Select a end time </Text>
                                  <Ionicons name="book-outline" size={20} style={styles.icon} />
                              </View>
                        </TouchableOpacity>

                  
              <View>
                <TouchableOpacity style={styles.button}  onPress={() => updateCampAndroid(editedCampIndex)}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Update Camp </Text>
                        <Ionicons name="create-outline" size={20} style={styles.icon} color="#ecf0ff" />
                  </View>
                </TouchableOpacity>
              </View>




              <View>
                  <TouchableOpacity style={styles.button} onPress={closeEditModal}>
                    <View style={styles.buttonContent}>
                      <Text style={styles.buttonText}>Exit </Text>
                    <Ionicons name="close-circle-outline" size={20} style={styles.icon} color="#ecf0ff" />
                  </View>
                </TouchableOpacity>
              </View>



            </SafeAreaView>
      }

      </ScrollView>
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
          <View style={styles.containerGap}></View>
          <View style={styles.containerGap}></View>

            <View>
                <TouchableOpacity style={styles.button} onPress={closeCampAttendanceModal}>
                  <View style={styles.buttonContent}>
                      <Text style={styles.buttonText}>Exit </Text>
                      <Ionicons name="close-circle-outline" size={20} style={styles.icon} color="#ecf0ff" />
                    </View>
              </TouchableOpacity>
            </View>

            <View style={styles.containerCardAttendanceGap}></View>
            <Text style={styles.headerText}>Number of bookings: {bookingData.length}</Text>
            <View style={styles.containerCardAttendanceGap}></View>




            {bookingData.length === 0 ? (
              <Text style={styles.noBookingsText}>No bookings have been made.</Text>
            ) : (

                <FlatList
                  data={bookingData}
                  style={styles.containerCardAttendance}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.containerCardBooking}>
                  
                    <Text>
                      <Text style={styles.headerText}>Name: </Text>    
                      {item.name}
                    </Text>


                    <View style={styles.containerCardAttendanceGap}></View>

                    <Text>
                      <Text style={styles.headerText}>Attendance Status: </Text>    
                      {item.attendanceStatus}
                    </Text>


                    <View style={styles.containerCardAttendanceGap}></View>

                    <Text>
                      <Text style={styles.headerText}>Contact Number: </Text>    
                      {item.emergencyContactNumber}
                    </Text>

                    <View style={styles.containerCardAttendanceGap}></View>

                    <Text>
                      <Text style={styles.headerText}>Days Selected: </Text>    
                      {Array.isArray(item.participantsDaysSelected) ? item.participantsDaysSelected.join(', ') : ''}
                    </Text>


                    <View style={styles.containerCardAttendanceGap}></View>

                    <Text>
                      <Text style={styles.headerText}>Info: </Text>    
                      {item.participantsAdditionalInfo}
                    </Text>
           

                      <View style={styles.containerCardAttendanceGap}></View>
                      {/* Other participant details */}
                    </View>
                    )}
                    />
                  )}
              </View>
            </View>
      
          </Modal>



          {/* Delete Modal - iOS */}
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



          {/* Delete Modal - Android */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={openAndroidDeleteCampModalVisible}
            onRequestClose={closeDeleteAndroidCampModal}

          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.label}>Are you sure you want to delete this Camp? 
                    Once deleted this is removed from the Database and effect current bookings not advised* Contact HoeyTech for more info </Text>
                      <TouchableOpacity style={styles.button} onPress={removeCampAndroid}>
                        <Text style={styles.buttonText}>Yes</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button} onPress={closeDeleteAndroidCampModal}>
                        <Text style={styles.buttonText}>No</Text>
                      </TouchableOpacity>
                  </View>

              </View> 
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
          <View style={styles.containerGap}></View>
          <View style={styles.containerGap}></View>
          
        
              <View>
                <TouchableOpacity style={styles.button} onPress={closeEventAttendanceModal}>
                    <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Exit </Text>
                      <Ionicons name="close-circle-outline" size={20} style={styles.icon} color="#ecf0ff" />
                    </View>
                </TouchableOpacity>
              </View>

             

              <View style={styles.containerCardAttendanceGap}></View>

              <Text> 
              <Text style={styles.headerText}>Number of bookings: </Text>
               {bookingData.length}
              </Text>
            

              <View style={styles.containerCardAttendanceGap}></View>
              
              {bookingData.length === 0 ? (
              <Text style={styles.noBookingsText}>No bookings have been made.</Text>
            ) : (


                <FlatList
                  data={bookingData}
                  style={styles.containerCardAttendance}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    
                    <View style={styles.containerCardBooking}>
                        <Text>
                            <Text style={styles.headerText}>Name: </Text>
                            <Text>{item.name}</Text>
                        </Text>

                        <View style={styles.containerCardAttendanceGap}></View>

                        <Text>
                            <Text style={styles.headerText}>Attendance Status: </Text>
                            <Text>{item.attendanceStatus}</Text>
                        </Text>

                        <View style={styles.containerCardAttendanceGap}></View>
                        
                        <Text>
                            <Text style={styles.headerText}>Contact Number: </Text>
                            <Text>{item.emergencyContactNumber}</Text>
                        </Text>

                        <View style={styles.containerCardAttendanceGap}></View>

                        <Text>
                            <Text style={styles.headerText}>Allergies: </Text>
                            <Text>{item.allergies}</Text>
                        </Text>

                        <View style={styles.containerCardAttendanceGap}></View>
        
                        <Text>
                            <Text style={styles.headerText}>Additional Info: </Text>
                            <Text>{item.additionalInfo}</Text>
                        </Text>

                      {/* Other participant details */}

                          </View>
                        )}
                      />
                      )}


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
      <View style={styles.modalContent}>

        <View style={styles.formContent}>
          <Text style={styles.validationText}>* Edit by clicking the value you would like to change:</Text>
        </View>

        <View style={styles.formContent}>
            <Text style={styles.label}>Location: </Text>
            <TextInput
              style={styles.textInput}
              value={editedEventLocationText}
              onChangeText={setEditedEventLocationText}
              placeholder='Enter here..'
            />
          </View>

         
          
          {Platform.OS === 'ios' &&  
              <SafeAreaView>

                <View style={styles.formContent}>
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

                <View style={styles.formContent}>
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

                  <View style={styles.formContent}>
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



                  <View style={styles.formContent}>
                    <Text style={styles.label}>Full Price: £</Text>
                      <TextInput
                      style={styles.textInput}
                      value={editedEventPriceText}
                      onChangeText={setEditedEventPrice}
                      placeholder='Enter here..'
                    />
                  </View>
            </SafeAreaView>
            }

           


            {Platform.OS === 'ios' &&  
              <SafeAreaView>
                <View>
                  <TouchableOpacity style={styles.button} onPress={() => updateEvent(editedEventIndex)}>
                        <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Update Event </Text>
                        <Ionicons name="create-outline" size={20} style={styles.icon} color="#ecf0ff" />
                      </View>
                    </TouchableOpacity>
                </View>

                <View>
                  <TouchableOpacity style={styles.button} onPress={closeEditEventModal}>
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Exit </Text>
                      <Ionicons name="close-circle-outline" size={20} style={styles.icon} color="#ecf0ff" />
                    </View>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>

            }



            {Platform.OS === 'android' &&  

              <SafeAreaView>

     
                <View style={styles.formContent}>
                  <Text style={styles.label}>Full Price: £</Text>
                    <TextInput
                    style={styles.textInput}
                    value={editedEventPriceText}
                    onChangeText={setEditedEventPrice}
                    placeholder='Enter here..'
                  />
                </View>

            
                <View style={styles.BookingOptionsText}>
                    <Text>
                    <Text style={styles.headerText}>Start Date:  </Text> 
                        {new Date(startAndroidDate).toLocaleDateString('en-GB')}     
                    </Text>
                </View>
                
 
                    {showStartDatePickerVisible && (
                      
                      <DateTimePicker
                        testID="dateTimePickerStart"
                        value={startAndroidDate}
                        mode={'date'}
                        display="default"
                        onChange={handleAndroidStartChange}
                      /> 
                    )}
            
                
                <View style={styles.BookingOptionsText}>
                   
                    <Text>
                    <Text style={styles.headerText}>Start Time:  </Text> 
                        {new Date(startAndroidTime).toLocaleTimeString()}     
                    </Text>
                </View>
                        
                            {showStartTimePickerVisible && (
                            <DateTimePicker
                            testID="dateTimePicker"
                            value={startAndroidTime}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onStartAndroidChange}
                          />
                        )}
              



                  <View style={styles.BookingOptionsText}>
                    <Text>
                      <Text style={styles.headerText}>End Time:  </Text> 
                        {new Date(endAndroidTime).toLocaleTimeString()}     
                    </Text>
                  </View>
        
                      {showEndTimePickerVisible && (
                      <DateTimePicker
                      testID="dateTimePicker"
                      value={endAndroidTime}
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={onEndAndroidChange}
                    />
                  )}
                



      


                  <TouchableOpacity onPress={showStartPicker} style={styles.button}>
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}> Select a start date </Text>
                            <Ionicons name="book-outline" size={20} style={styles.icon} />
                        </View>
                  </TouchableOpacity>
           
                  <TouchableOpacity onPress={showStartTimePicker} style={styles.button}>
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}> Select a start time </Text>
                            <Ionicons name="book-outline" size={20} style={styles.icon} />
                        </View>
                  </TouchableOpacity>

               

                  <TouchableOpacity onPress={showEndTimePicker} style={styles.button}>
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}> Select a end time </Text>
                            <Ionicons name="book-outline" size={20} style={styles.icon} />
                        </View>
                  </TouchableOpacity>

             
  
                <View>
                  <TouchableOpacity style={styles.button}  onPress={() => updateAndroidEvent(editedEventIndex)}>
                        <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Update Event </Text>
                        <Ionicons name="create-outline" size={20} style={styles.icon} color="#ecf0ff" />
                      </View>
                    </TouchableOpacity>
                </View>



                <View>
                  <TouchableOpacity style={styles.button}  onPress={closeEditEventModal}>
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Exit </Text>
                      <Ionicons name="close-circle-outline" size={20} style={styles.icon} color="#ecf0ff" />
                    </View>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>

            }

          

          </View>
      
        </View>
    </Modal>


         {/* Modal  - IOS  Delete Event confirmation  */}
         <Modal
            animationType="slide"
            transparent={true}
            visible={openDeleteEventModalVisible}
            onRequestClose={closeDeleteEventModal}

          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.label}>Are you sure you want to delete this Event? 
                    Once deleted this is removed from the Database and effect current bookings not advised* Contact HoeyTech for more info </Text>
                      <TouchableOpacity style={styles.button} onPress={removeEvent}>
                        <Text style={styles.buttonText}>Yes</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button} onPress={closeDeleteEventModal}>
                        <Text style={styles.buttonText}>No</Text>
                      </TouchableOpacity>
                  </View>

              </View> 
        </View>
                                
      </Modal> 



         {/* Modal  - Android Delete Event confirmation  */}
         <Modal
            animationType="slide"
            transparent={true}
            visible={openAndroidDeleteEventModalVisible}
            onRequestClose={closeAndroidDeleteEventModal}

          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.label}>Are you sure you want to delete this Event? 
                    Once deleted this is removed from the Database and effect current bookings not advised* Contact HoeyTech for more info </Text>
                      <TouchableOpacity style={styles.button} onPress={removeEventAndroid}>
                        <Text style={styles.buttonText}>Yes</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button} onPress={closeAndroidDeleteEventModal}>
                        <Text style={styles.buttonText}>No</Text>
                      </TouchableOpacity>
                  </View>

              </View> 
        </View>
                                
      </Modal> 





 


        </View>

      </View>




    </ScrollView>







  );
};


const styles = StyleSheet.create({

  container: {
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
    padding: 10,
    paddingTop: 5,
    marginBottom:10,
    width: '',
    backgroundColor: 'white',
  },



  containerCard: {
    borderWidth: 8,
    borderColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    margin: 0,
    marginBottom:100,
    width: '100%',
    backgroundColor: '#ecf0ff',
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
    

  },


  contentPosition:{
    marginTop:100
  },
  containerCard: {
    borderWidth: 8,
    borderColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    margin: 0,
    marginTop:10,
    marginBottom:10, 
    width: '80%',
    backgroundColor: '#ecf0ff',
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
  
    marginTop:40
  
  },

  containerCardAttendanceGap:{
  
    marginTop:20
  
  },
  DateSelectionContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    width:'100%'
  },

  fieldRow:{
    flexDirection: 'row', // Display items in a row
    alignItems: 'center', // Align items in the center of the row
    paddingHorizontal: 20,
    paddingVertical: 20,

    borderColor:"black",
    borderWidth:0.5
  }, 
  formContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',

  },

  formValidation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
});
  
export default ManageBookings;
