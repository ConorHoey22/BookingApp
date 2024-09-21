import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Text, Platform ,TextInput ,TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation , useRoute } from '@react-navigation/native';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

import { Ionicons } from '@expo/vector-icons';

//Stripe imports
import { CardField, useStripe, StripeProvider, InitPaymentSheet , usePaymentSheet} from '@stripe/stripe-react-native';

const CreateCamp = ({navigation}) => {





  const [campName, setCampName] = useState('');
  const [location, setLocation] = useState('');
  const [price1Day, setPrice1Day] = useState('');
  const [price2Day, setPrice2Day] = useState('');
  const [price3Day, setPrice3Day] = useState('');
  const [price4Day, setPrice4Day] = useState('');
  const [price5Day, setPrice5Day] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [startPickerIOSVisible, setStartPickerIOSVisible] = useState(false);
  const [endPickerIOSVisible, setEndPickerIOSVisible] = useState(false);
  
  const [showStartTimeIOS, setShowStartTimeIOSPicker] = useState(false);
  const [showEndTimeIOS, setShowEndTimeIOSPicker] = useState(false);

  //Error Messages 
  const [campNameErrorMessage, setCampNameErrorMessage] = useState('');
  const [locationErrorMessage, setLocationErrorMessage] = useState('');
  const [priceErrorMessage, setPriceErrorMessage] = useState('');


  
  
  useEffect(() => {
    
    if(Platform.OS === 'ios' ){
      setStartPickerIOSVisible(true);
      setEndPickerIOSVisible(true);

      setShowStartTimeIOSPicker(true);
      setShowEndTimeIOSPicker(true); 

    }
     
    
   

    if(Platform.OS === 'android'){
      setStartPickerVisible(false);
      setEndPickerVisible(false);
    
      setShowStartTimePicker(false);
      setShowEndTimePicker(false); 
    }
     




    
   

    setCampName("");
    setLocation("");
    setPrice1Day("");
    setPrice2Day("");
    setPrice3Day("");
    setPrice4Day("");
    setPrice5Day("");


   

  }, []);



  
// ------------- iOS Date Picker functions ---------------


const [startIOSTime, setStartIOSTime] = useState(new Date());
const [endIOSTime, setEndIOSTime] = useState(new Date());
const [startIOSDate, setStartIOSDate] = useState(new Date());
const [endIOSDate, setEndIOSDate] = useState(new Date());



const [startPickerVisible, setStartPickerVisible] = useState(false);
const [endPickerVisible, setEndPickerVisible] = useState(false);

  const handleStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || startIOSDate;

      // User selects a date
      setStartIOSDate(currentDate);

    

  };

  const handleEndChange = (event, selectedDate) => {

    const currentDate = selectedDate || endIOSDate;
    setEndIOSDate(currentDate);
  };


  const showStartPicker = () => {
    setStartPickerVisible(true);
  };

  const showEndPicker = () => {
    setEndPickerVisible(true);
  };

  const showStartTimePicker = () => {
    setShowStartTimePicker(true);
  };

  const showEndTimePicker = () => {
    setShowEndTimePicker(true);
  };


  const onStartChange = (event, selectedTime) => {
    setShowTimePicker(false);
    const currentTime = selectedTime || startIOSTime;
    setStartIOSTime(currentTime);
  };

  const onEndChange = (event, selectedTime) => {
    setShowTimePicker(false);
    const currentTime = selectedTime || endIOSTime;
    setEndIOSTime(currentTime);
  };







  


//----------Android-------------------------
const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());

const [startTime, setStartTime] = useState(new Date());
const [endTime, setEndTime] = useState(new Date());

const handleStartAndroidChange = (event, selectedDate) => {
  const currentDate = selectedDate || startDate;

  setStartDate(currentDate);

  if (event.type === 'dismissed') {
    // User pressed the Cancel button
    setStartPickerVisible(false);
    return;
  }

  if (event.type === 'set' && currentDate) {
    // User pressed the OK button and selected a date

    setStartDate(currentDate);
    setStartPickerVisible(false);
  }

};

const handleEndAndroidChange = (event, selectedDate) => {
  const currentDate = selectedDate || endDate;

  setEndDate(currentDate);

  if (event.type === 'dismissed') {
    // User pressed the Cancel button
    setEndPickerVisible(false);
    return;
  }

  if (event.type === 'set' && currentDate) {
    // User pressed the OK button and selected a date

    setEndDate(currentDate);
    setEndPickerVisible(false);
  }
  
};

const onStartTimeChange = (event , selectedTime) => {
    setShowStartTimePicker(false);
    const currentTime = selectedTime || startTime;
    setStartTime(currentTime);


    if (event.type === 'dismissed') {
      // User pressed the Cancel button
      setShowStartTimePicker(false);
      return;
    }
  
    if (event.type === 'set' && currentDate) {
      // User pressed the OK button and selected a date

      setStartTime(currentTime);
      setShowStartTimePicker(false);
    };

  };

  const onEndTimeChange = (event , selectedTime) => {
   
    setShowEndTimePicker(false);
    const currentTime = selectedTime || endTime;
    setEndTime(currentTime);

    if (event.type === 'dismissed') {
      // User pressed the Cancel button
      setShowEndTimePicker(false);
      return;
    }
  
    if (event.type === 'set' && currentDate) {
      // User pressed the OK button and selected a date

      setEndTime(currentTime);
      setShowEndTimePicker(false);
    };
  };

//-------------------------------------------------------
  

// -------------------------------------------------------- 

const [date, setDate] = useState(new Date(1598051730000));
const [mode, setMode] = useState('date');





const [showTimePicker, setShowTimePicker] = useState(false);
const [showStartTimePickerVisible, setShowStartTimePicker] = useState(false);

const [showEndTimePickerVisible, setShowEndTimePicker] = useState(false);
// -------------------------------------------------------- 



// -------------------------------------------------------- 
//iOS Show functions 



const showMode = (currentMode) => {
  setShow(true);
  setMode(currentMode);
};

const showDatepicker = () => {
  showMode('date');
};




//------------------------





useEffect(() => {
  const checkAuthentication = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      setIsLoggedIn(!!jwtToken);

      // Obtain and store UserID ? aysc or maybe a GET? then pass it to the POST
    
    
    } catch (error) {
      console.error('Error fetching JWT token:', error);
    }
  };

  checkAuthentication(); // Call the function to check authentication status when component mounts
}, []); // Empty dependency array ensures the effect runs only once when component mounts


  const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });

  const [open, setOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange]
  );



  const handleAndroidSubmit = async () => {


    const apiCreateCamp =
      Platform.OS === 'ios'
        ? 'http://localhost:3000/api/createCampAndroid' // iOS simulator uses localhos
        : 'http://192.168.1.186:3000/api/createCampAndroid';  // Android emulator

    try {

      const jwtToken = await AsyncStorage.getItem('jwtToken');
  
      if (!jwtToken) {
        throw new Error('JWT token not found');
      }

      // Reset error messages
      setCampNameErrorMessage("");
      setLocationErrorMessage("");
      setPriceErrorMessage("");

      //Form Validation before User can Handle Submition
      
      //If CampName is blank
      if(campName == "")
      {
        const errorMessage1 = "Please enter a camp name";
        setCampNameErrorMessage(errorMessage1);
      }
      else if(location == "")
      {
        const errorMessage2 = "Please enter a location";
        setLocationErrorMessage(errorMessage2);
      }
      else if(price1Day == "" || price2Day == "" || price3Day == "" || price4Day == "" || price5Day == "") 
      {
        const errorMessage3 = "Please enter a price";
        setPriceErrorMessage(errorMessage3);
      }
      else {

  
        const response = await fetch(apiCreateCamp, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ 
            campName,
            location, 
            price1Day,
            price2Day,
            price3Day,
            price4Day,
            price5Day,
            startDate,
            startTime,
            endDate,
            endTime,
            
          }),
        });
    
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log('Camp Created', jsonResponse);
          navigation.navigate('Manage Bookings', { dataTrigger: true}); 
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
        console.error('Network Error:', error.message);
        // Handle the error here. For example, set an error message state
        setErrorMessage(error.message);
      }

      
  };

  const handleSubmit = async () => {


    const apiCreateCamp = 'http://localhost:3000/api/createCampIOS'; // iOS simulator uses localhos


    try {

      const jwtToken = await AsyncStorage.getItem('jwtToken');
  
      if (!jwtToken) {
        throw new Error('JWT token not found');
      }

      // Reset error messages
      setCampNameErrorMessage("");
      setLocationErrorMessage("");
      setPriceErrorMessage("");

      //Form Validation before User can Handle Submition
      
      //If CampName is blank
      if(campName == "")
      {
        const errorMessage1 = "Please enter a camp name";
        setCampNameErrorMessage(errorMessage1);
      }
      else if(location == "")
      {
        const errorMessage2 = "Please enter a location";
        setLocationErrorMessage(errorMessage2);
      }
      else if(price1Day == "" || price2Day == "" || price3Day == "" || price4Day == "" || price5Day == "") 
      {
        const errorMessage3 = "Please enter a price";
        setPriceErrorMessage(errorMessage3);
      }
      else {

  
        const response = await fetch(apiCreateCamp, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ 
            campName,
            location, 
            price1Day,
            price2Day,
            price3Day,
            price4Day,
            price5Day,
            startIOSDate,
            startIOSTime,
            endIOSDate,
            endIOSTime,
            
          }),
        });
    
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log('Camp Created', jsonResponse);
          navigation.navigate('Manage Bookings', { dataTrigger: true}); 
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
        console.error('Network Error:', error.message);
        // Handle the error here. For example, set an error message state
        setErrorMessage(error.message);
      }

      
  };

 


  return (

        <ScrollView>
        <View style = {styles.container2}>
          <View style={styles.container}>

          <View style={styles.contentPosition}>
            <View style={styles.containerCard}>
              
            
                <View style={styles.formContent}>
                    <Text style={styles.headerText}>Camp Name: </Text>
                      <TextInput
                          placeholder=" Enter the Camp name here"
                          value={campName}
                          onChangeText={setCampName} />
                </View>

                <View style={styles.formValidation}>
                  <Text style={styles.validationText}>{campNameErrorMessage}</Text>
                </View>

                <View style={styles.formContent}>
                  <Text style={styles.headerText}>Location:</Text>
                  <TextInput
                    placeholder=" Enter the Location here"
                    value={location}
                    onChangeText={setLocation} />
                </View>

                <View style={styles.formValidation}>
                  <Text style={styles.validationText}>{locationErrorMessage}</Text>
                </View>



                <View style={styles.formContent}>
                  <Text style={styles.headerText}>Enter a price for 1 Day :</Text>
                  <TextInput
                    placeholder=" £0.00"
                    value={price1Day}
                    onChangeText={setPrice1Day} />
                </View>

                <View style={styles.formValidation}>
                  <Text style={styles.validationText}>{priceErrorMessage}</Text>
                </View>


                <View style={styles.formContent}>
                <Text style={styles.headerText}>Enter a price for 2 Days :</Text>
                  <TextInput
                  placeholder=" £0.00"
                  value={price2Day}
                  onChangeText={setPrice2Day} />
                </View>

                <View style={styles.formValidation}>
                  <Text style={styles.validationText}>{priceErrorMessage}</Text>
                </View>

               <View style={styles.formContent}>
               <Text style={styles.headerText}>Enter a price for 3 Days :</Text>
                <TextInput
                  placeholder=" £0.00"
                  value={price3Day}
                  onChangeText={setPrice3Day} />
              </View>

              <View style={styles.formValidation}>
                  <Text style={styles.validationText}>{priceErrorMessage}</Text>
              </View>


              <View style={styles.formContent}>
              <Text style={styles.headerText}>Enter a price for 4 Days :</Text>
                  <TextInput
                    placeholder=" £0.00"
                    value={price4Day}
                    onChangeText={setPrice4Day} />
              </View>

              <View style={styles.formValidation}>
                  <Text style={styles.validationText}>{priceErrorMessage}</Text>
              </View>


              <View style={styles.formContent}>
              <Text style={styles.headerText}>Enter a price for 5 Days :</Text>
                <TextInput
                  placeholder=" £0.00"
                  value={price5Day}
                  onChangeText={setPrice5Day} />
              </View>

              <View style={styles.formValidation}>
                  <Text style={styles.validationText}>{priceErrorMessage}</Text>
              </View>




            {/* ios */}
        
          {Platform.OS === 'ios' &&  
                <SafeAreaView style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                  <Text style={styles.headerText}>Select a start date:</Text>
                    <View style={styles.formContent}>
                      
                       {startPickerIOSVisible && (
                        <DateTimePicker
                           testID="dateTimePicker"
                           value={startIOSDate}
                           mode={'date'}
                           display="default"
                           onChange={handleStartChange}
                        />
                       )}
                    </View>

                  <Text style={styles.headerText}>Select a end date:</Text>
                  <View style={styles.formContent}>
                     {endPickerIOSVisible && (
                       <DateTimePicker
                         testID="dateTimePicker"
                         value={endIOSDate}
                         mode={'date'}
                         display="default"
                         onChange={handleEndChange}
                       />
                     )}
                  </View>

                <Text style={styles.headerText}>Select a start time:</Text>

                <View style={styles.formContent}>
                        {showStartTimeIOS && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={startIOSTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onStartChange}
                      />
                    )}
                </View>

                <Text style={styles.headerText}>Select a end time:</Text>

                <View style={styles.formContent}>

                    {showEndTimeIOS && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={endIOSTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onEndChange}
                  />
                  )}

                </View>


           
                    <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                          <View style={styles.buttonContent}>
                              <Text style={styles.buttonText}>Create Camp </Text>
                              <Ionicons name="book-outline" size={20} style={styles.icon} />
                          </View>
                    </TouchableOpacity>
        


         
    
        </SafeAreaView>
 }

      {/* Android */}

       {Platform.OS === 'android' &&
        
        <SafeAreaView>
          <View>  

                    <View style={styles.formContent2}>
                      <Text style={styles.headerText}>Start Date: </Text> 
                      <Text>{new Date(startDate).toLocaleDateString('en-GB')}</Text>
                    </View>

                    <TouchableOpacity onPress={showStartPicker} style={styles.button}>
                          <View style={styles.buttonContent}>
                              <Text style={styles.buttonText}> Click here to select a start date </Text>
                              <Ionicons name="book-outline" size={20} style={styles.icon} />
                          </View>
                    </TouchableOpacity>

                    <View style={styles.formContent2}>
                      <Text style={styles.headerText}>End Date:  </Text> 
                      <Text>{new Date(endDate).toLocaleDateString('en-GB')}</Text>
                    </View>

             
                    <TouchableOpacity onPress={showEndPicker} style={styles.button}>
                          <View style={styles.buttonContent}>
                              <Text style={styles.buttonText}> Click here to select a end date </Text>
                              <Ionicons name="book-outline" size={20} style={styles.icon} />
                          </View>
                    </TouchableOpacity>

                    <View style={styles.formContent2}>
                      <Text style={styles.headerText}>Start Time: </Text> 
                      <Text>{new Date(startTime).toLocaleTimeString()}</Text>
                    </View>

                    <TouchableOpacity onPress={showStartTimePicker} style={styles.button}>
                          <View style={styles.buttonContent}>
                              <Text style={styles.buttonText}> Click here to select a start time </Text>
                              <Ionicons name="book-outline" size={20} style={styles.icon} />
                          </View>
                    </TouchableOpacity>

                    <View style={styles.formContent2}>
                      <Text style={styles.headerText}>End Time: </Text> 
                      <Text>{new Date(endTime).toLocaleTimeString()}</Text>
                    </View>

                    <TouchableOpacity onPress={showEndTimePicker} style={styles.button}>
                          <View style={styles.buttonContent}>
                              <Text style={styles.buttonText}> Click here to select a end time </Text>
                              <Ionicons name="book-outline" size={20} style={styles.icon} />
                          </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleAndroidSubmit} style={styles.button}>
                          <View style={styles.buttonContent}>
                              <Text style={styles.buttonText}>Create Camp </Text>
                              <Ionicons name="book-outline" size={20} style={styles.icon} />
                          </View>
                    </TouchableOpacity>





              {startPickerVisible && (
                    <DateTimePicker
                    mode="date"
                    value={startDate}
                    onChange={handleStartAndroidChange}
                    />
              )}

              {endPickerVisible && (
                    <DateTimePicker
                      mode="date"
                      value={endDate}
                      onChange={handleEndAndroidChange}
                    />
              )}

                {showStartTimePickerVisible && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={startTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onStartTimeChange}
                      />
                    )}

                    {/* End time  */}

                    {showEndTimePickerVisible && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={endTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onEndTimeChange}
                      />
                    )}
                    


        



          </View>     
          </SafeAreaView>
      }


              


      </View>
              
      </View>
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
  buttonText: {
    color: 'white',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    
    
  },


  headerText:{
    color: 'black',
    fontSize: 14,
    fontWeight:'bold'

  },

  headerText2:{
    color: 'white',
    fontSize: 24,
    fontWeight:'bold',

    justifyContent: 'center',
},

  contentPosition:{
    marginTop:80,
    marginBottom:30
  },
  containerCard: {
    borderWidth: 8,
    borderColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    margin: 0,
    width: 'auto',
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

  containerButton:{
    flex: 1,
    marginTop:10,
    // marginBottom:-30,
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
  
  DateSelectionContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    width:'100%'
  },

  fieldRow:{
    flexDirection: 'column', // Display items in a row
    alignItems: 'center', // Align items in the center of the row
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop:200,
    borderColor:"black",
    borderWidth:1
  }, 
  formContent: {
    flexDirection: 'row',
    alignItems: 'center',


  },
  formContent2: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom:-15,
    marginTop:10,
    paddingLeft:10


  },

  formValidation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },      

});

export default CreateCamp;