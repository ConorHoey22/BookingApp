import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardCRM = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [campData, setCampData] = useState([]);
  const [eventData, setEventData] = useState([]);

  const [openBookingOptionsModalVisible, setOpenBookingOptionsModalVisible] = useState(false);


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
  
  
  }, []); // Empty dependency array ensures the effect runs only once when component mounts

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

          // Get current date and time
          const now = new Date();

          // Filter out camps with start dates in the past
            const filteredCampData = data.filter(camp => {
              const startDate = new Date(camp.startDate);
              const startTime = new Date(camp.startTime);
              const startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes());

              return startDateTime >= now;

        
            });


          // Set the campData state with the filtered data
          setCampData(filteredCampData);
        


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

        // Get current date and time
        const now = new Date();


          // const filteredCampData = data.filter(camp => new Date(camp.startDate) > new Date());
          // Filter out camps with start dates in the past
          const filteredEventData = data.filter(camp => {
            const startDate = new Date(camp.startDate);
            const startTime = new Date(camp.startTime);
            const startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes());

            return startDateTime >= now;

      
          });

         // Set the eventData state with the filtered data
         setEventData(filteredEventData);

  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }


  };

  const OpenBookingOptions = async () => {
    setOpenBookingOptionsModalVisible(true);
  };

  const closeOpenBookingOptions = async () => {
    setOpenBookingOptionsModalVisible(false);
  };


  const handleLogOut = async () => {
    await AsyncStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    navigation.navigate('Login');
  };

  return (
    <ScrollView>

    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText} onPress={() => navigation.navigate('MyBookings')}>My Bookings</Text>
    </TouchableOpacity>

    {campData.map((camp, index) => (
      <View key={index} style={styles.container}>  
        <Text>Weekly Camp</Text>
        <Text>{camp.campName} </Text>
        <Text>Location: {camp.location}</Text> 
        <Text>Duration: {new Date(camp.startDate).toLocaleDateString('en-GB')} - {new Date(camp.endDate).toLocaleDateString('en-GB')}</Text>
        <Text>Start Time: {new Date(camp.startTime).toLocaleTimeString()} - End Time: {new Date(camp.endTime).toLocaleTimeString()}</Text>
        <Text>Full Price: £{camp.price5Day} </Text>
     

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateBooking', { camp })}>
          <Text style={styles.buttonText} >Book now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={OpenBookingOptions}>
          <Text style={styles.buttonText}>Booking Options</Text>
        </TouchableOpacity>
    


          {/* Modal  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={openBookingOptionsModalVisible}
            onRequestClose={setOpenBookingOptionsModalVisible}

          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.label}>Booking Options</Text>
                  <Text>1 Day Camp Price: £{camp.price1Day} </Text>
                  <Text>2 Day Camp Price: £{camp.price2Day} </Text>
                  <Text>3 Day Camp Price: £{camp.price3Day} </Text>
                  <Text>4 Day Camp Price: £{camp.price4Day} </Text>
                </View>


              <TouchableOpacity style={styles.button} onPress={closeOpenBookingOptions}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              </View> 
        </View>
                                
      </Modal> 

      </View>

    ))}


      {eventData.map((event, index) => (
      <View key={index} style={styles.container}>  
        <Text>Day Event</Text>
        <Text>{event.eventName} </Text>
        <Text>Location: {event.location}</Text> 
        <Text>Duration: {new Date(event.startDate).toLocaleDateString('en-GB')} </Text>
        <Text>Start Time: {new Date(event.startTime).toLocaleTimeString()} - End Time: {new Date(event.endTime).toLocaleTimeString()}</Text>
        <Text>Price: £{event.price} </Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateEventBooking', { event })}>
          <Text style={styles.buttonText}>Book now</Text>
        </TouchableOpacity>
      </View>
    ))}




 
  </ScrollView>

  );
};

export default DashboardCRM;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 20,
    margin: 20,
    width: 'auto',
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
