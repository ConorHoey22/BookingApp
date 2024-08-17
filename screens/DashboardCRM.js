import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal ,FlatList} from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';


const DashboardCRM = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [campData, setCampData] = useState([]);
  const [eventData, setEventData] = useState([]);

  const [openBookingOptionsModalVisible, setOpenBookingOptionsModalVisible] = useState(false);

  const [openCampList, setOpenCampVisible] = useState(true);

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
      

      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>Camp Name: </Text>
        {camp.campName}
      </Text>

      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>Location: </Text>
        {camp.location}
      </Text>

      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>Duration: </Text>
        {new Date(camp.startDate).toLocaleDateString('en-GB')} - {new Date(camp.endDate).toLocaleDateString('en-GB')}
      </Text>

      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>Start Time: </Text>
        {new Date(camp.startTime).toLocaleTimeString()}
      </Text>

      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>End Time: </Text>
        {new Date(camp.endTime).toLocaleTimeString()} 
      </Text>

      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>Full Price: </Text>
        £{camp.price5Day}
      </Text>

      <View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Create Booking', { camp })}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Book now </Text>
                <Ionicons name="arrow-forward-circle-outline" size={20} style={styles.icon} />
              </View>
            </TouchableOpacity>
      </View>


      <View>
            <TouchableOpacity style={styles.button} onPress={OpenBookingOptions}>
              <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Booking Options </Text>
              <Ionicons name="information-circle-outline" size={20} style={styles.icon} />
              </View>
            </TouchableOpacity>
      </View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={openBookingOptionsModalVisible}
        onRequestClose={closeOpenBookingOptions}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'column' }}>

       
            <Text style={styles.headerTextBlack2}>Booking Options</Text>
          
          

            <Text style={styles.headerTextBlack}>
              <Text style={styles.headerTextBlack2}>1 Day Camp Price: </Text>
              £{camp.price1Day}
            </Text>

            <Text style={styles.headerTextBlack}>
              <Text style={styles.headerTextBlack2}>2 Day Camp Price: </Text>
              £{camp.price2Day}
            </Text>

            <Text style={styles.headerTextBlack}>
              <Text style={styles.headerTextBlack2}>3 Day Camp Price: </Text>
              £{camp.price3Day}
            </Text>

            <Text style={styles.headerTextBlack}>
              <Text style={styles.headerTextBlack2}>4 Day Camp Price: </Text>
              £{camp.price4Day}
            </Text>

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

      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>Event Name: </Text>
        {event.eventName}
      </Text>


      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>Location: </Text>
        {event.location}
      </Text>

      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>Duration: </Text>
        {new Date(event.startDate).toLocaleDateString('en-GB')}
      </Text>

      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>Start Time: </Text>
        {new Date(event.startTime).toLocaleTimeString()}
      </Text>


      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>End Time: </Text>
        {new Date(event.endTime).toLocaleTimeString()}
      </Text>

      <Text style={styles.headerTextBlack}>
        <Text style={styles.headerTextBlack2}>Price: </Text>
        £{event.price}
      </Text>



      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Create Event', { event })}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Book now </Text>
            <Ionicons name="arrow-forward-circle-outline" size={20} style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>
  
    </View>
  );
  
  const uniqueKeyExtractor = (item, index) => (item.id ? item.id.toString() : index.toString());

  return (


    <View style={styles.container2}>

    <View style={styles.container}>

    <View style={styles.toggleContainer}>
      <TouchableOpacity style={styles.button} onPress={() => setOpenCampVisible(!openCampList)}>
        <Text style={styles.buttonText}>{openCampList ? 'Show Upcoming Events' : 'Show Upcoming Camps'}</Text>
      </TouchableOpacity>
    </View>

    {openCampList ? (
        <FlatList
          data={campData}
          renderItem={renderCampItem}
          keyExtractor={uniqueKeyExtractor}
        />
      ) : (
        <FlatList
          data={eventData}
          renderItem={renderEventItem}
          keyExtractor={uniqueKeyExtractor}
        />
      )}
  </View>

  </View> 


  );
};

export default DashboardCRM;

const styles = StyleSheet.create({
  
  toggleContainer: {
    width:'100%',
    marginTop:50,
    padding:10
  },
  
  
  containerCard: {
    borderWidth: 8,
    borderColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    margin: 20,
    width: 'auto',
    backgroundColor: '#ecf0ff',
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
      backgroundColor: 'black',
      borderRadius: 15,
      padding: 2,
      zIndex: 2, // Ensure dropdown is above other elements

    },

    button2: {
 
      width:'100%',
      borderRadius: 10,
      marginTop: 30,
      paddingVertical: 15,
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 4,
      padding: 5,
      zIndex: 2, // Ensure dropdown is above other elements

     
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
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


  },
  icon: {
    color: '#00e3ae', // Add spacing between icon and text
  
  },
    
  headerText2:{
    color: 'white',
    fontSize: 14,
    paddingLeft:20,
    fontWeight:'bold',
  },
  headerTextBlack:{
    color: 'black',
    fontSize: 14,
    justifyContent:'center',
    padding:5,
    marginBottom:5,
    marginTop:5

  },
  headerTextBlack2:{
    color: 'black',
    fontSize: 14,
    fontWeight:'bold',
    justifyContent:'center',
    padding:1,
    marginBottom:5,
    marginTop:5

  },
    container2:{
  
      flex: 1,
      width: '100%', // Width of the container (adjust as needed)
      height: '100%', // Height of the container (adjust as needed)
      backgroundColor: '#ecf0ff',
      alignItems: 'center',
      justifyContent: 'center',
  
  
    },
    buttonText:
    {
      color: 'white',
      fontSize: 14,
      alignItems: 'center',
      justifyContent: 'center',

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
