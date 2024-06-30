import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal ,FlatList} from 'react-native';
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


  const renderCampItem = ({ item: camp }) => (
    <View style={styles.containerCard}>
      <Text style={styles.headerTextBlack}>Weekly Camp</Text>

      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>Camp Name: </Text>
        {camp.campName}
      </Text>

      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>Location: </Text>
        {camp.location}
      </Text>

      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>Duration: </Text>
        {new Date(camp.startDate).toLocaleDateString('en-GB')} - {new Date(camp.endDate).toLocaleDateString('en-GB')}
      </Text>

      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>Start Time: </Text>
        {new Date(camp.startTime).toLocaleTimeString()} - 
        
        <Text style={styles.headerTextBlack}> End Time: </Text> 
        {new Date(camp.endTime).toLocaleTimeString()}
      </Text>

      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>Full Price: </Text>
        £{camp.price5Day}
      </Text>


      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Create Booking', { camp })}>
        <Text style={styles.buttonText}>Book now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={OpenBookingOptions}>
        <Text style={styles.buttonText}>Booking Options</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={openBookingOptionsModalVisible}
        onRequestClose={closeOpenBookingOptions}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.label}>Booking Options</Text>
              <Text>1 Day Camp Price: £{camp.price1Day}</Text>
              <Text>2 Day Camp Price: £{camp.price2Day}</Text>
              <Text>3 Day Camp Price: £{camp.price3Day}</Text>
              <Text>4 Day Camp Price: £{camp.price4Day}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={closeOpenBookingOptions}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  const renderEventItem = ({ item: event }) => (
    <View style={styles.containerCard}>
      <Text style={styles.headerTextBlack}>Day Event</Text>


      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>Event Name: </Text>
        {event.eventName}
      </Text>


      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>Location: </Text>
        {event.location}
      </Text>

      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>Duration: </Text>
        {new Date(event.startDate).toLocaleDateString('en-GB')}
      </Text>

      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>Start Time: </Text>
        {new Date(event.startTime).toLocaleDateString('en-GB')}
      </Text>

      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>End Time: </Text>
        {new Date(event.endTimeTime).toLocaleDateString('en-GB')}
      </Text>

      <Text style={styles.headerText}>
        <Text style={styles.headerTextBlack}>Price: </Text>
        {event.price}
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Create Event Booking', { event })}>
        <Text style={styles.buttonText}>Book now</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (


    <View style={styles.container2}>

    <View style={styles.container}>
    <FlatList
      data={campData}
      renderItem={renderCampItem}
      keyExtractor={(item, index) => `camp-${index}`}
      ListHeaderComponent={() => (
        <>
          {eventData.map((event, index) => renderEventItem({ item: event }))}
        </>
      )}
    />
  </View>

  </View> 


  );
};

export default DashboardCRM;

const styles = StyleSheet.create({
  containerCard: {
    borderWidth: 1,
    borderColor: '#fffff',
    borderRadius: 24,
    padding: 20,
    margin: 20,
    width: 'auto',
    backgroundColor: '#ffffff',
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
 

      borderRadius: 10,
      marginTop: 30,
      paddingVertical: 15,
      alignItems: 'center',
      backgroundColor: '#00e3ae',
      borderRadius: 4,
      padding: 5,
      zIndex: 2, // Ensure dropdown is above other elements

     
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

    
  headerText:{
    color: 'black',
        fontSize: 14,
        padding:5
  },
  headerTextBlack:{
    color: 'black',
    fontSize: 14,
   fontWeight:'bold',
   padding:5
  },
    container2:{
  
      flex: 1,
      width: '100%', // Width of the container (adjust as needed)
      height: '100%', // Height of the container (adjust as needed)
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
  
  
    },
    buttonText:
    {
      color: 'black',
      fontSize: 14,
      alignItems: 'center',
       justifyContent: 'center',
       fontWeight:'bold'
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
