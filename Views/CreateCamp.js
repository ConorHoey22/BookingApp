import React, { useState } from 'react';


import { StyleSheet, View, Button, Text, Platform ,TextInput , SafeAreaView} from 'react-native';

import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';


const CreateCamp = () => {

  

  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');










// ------------- iOS Date Picker functions ---------------

const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());
const [startPickerVisible, setStartPickerVisible] = useState(false);
const [endPickerVisible, setEndPickerVisible] = useState(false);

  const handleStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    setStartPickerVisible(false);
  };

  const handleEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    setEndPickerVisible(false);
  };

  const showStartPicker = () => {
    setStartPickerVisible(true);
  };

  const showEndPicker = () => {
    setEndPickerVisible(true);
  };

// -------------------------------------------------------- 


///--------- WEB  -------------


const [date, setDate] = useState(new Date(1598051730000));
const [mode, setMode] = useState('date');
const [show, setShow] = useState(false);


const [startTime, setStartTime] = useState(new Date());
const [endTime, setEndTime] = useState(new Date());
const [showTimePicker, setShowTimePicker] = useState(false);

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






  const handleSubmit = () => {
    if (!location || !date || !time || !price) {
      setError('Please fill out all fields');
      return;
    }
    // Add your logic here to handle the form submission
  };

  return (
    <View style = {styles.container}>
      <View style= {styles.topContainer}>


      <View style={styles.fieldRow}>
        <Text>Location:</Text>
        <TextInput
        styles={styles.input}
          placeholder=" Enter the Location here"
          value={location}
          onChangeText={setLocation} />
      </View>

      <View style={styles.fieldRow}>
          <Text>Enter a price:</Text>
          <TextInput
            placeholder=" Enter the Price"
            value={price}/>
      </View>


    <View style={styles.fieldRow}>
      {/* Web  */}

          {Platform.OS === 'web' && 
          <SafeAreaProvider>
              <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                <Button title = "Pick a Date Range" onPress={() => setOpen(true)} uppercase={false} mode="outlined" />
                  
                
                <DatePickerModal
                  disableStatusBarPadding
                  locale="en"
                  mode="range"
                  visible={open}
                  onDismiss={onDismiss}
                  startDate={range.startDate}
                  endDate={range.endDate}
                  onConfirm={onConfirm}
                  startYear={2024}
                  endYear={2050} />
              </View>
            
            </SafeAreaProvider>
            }

            {/* ios */}
                        
            {Platform.OS === 'ios' && 
                <SafeAreaView>
                  <View style={{ padding: 16 }}>
                      <Button onPress={showStartPicker} title="Select Start Date" />
                      <Button onPress={showTimepicker} title="Select Start Time" />
                      {startPickerVisible && (
                        <DateTimePicker
                          testID="dateTimePickerStart"
                          value={startDate}
                          mode={'date'}
                          display="default"
                          onChange={handleStartChange}
                        />
                      )}
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
              </SafeAreaView>
            }

            {/* Andriod */}
            {Platform.OS === 'android' &&
            <SafeAreaView>
            <Button onPress={showDatepicker} title="Show date picker!" />
            <Button onPress={showTimepicker} title="Show time picker!" />
            <Text>selected: {date.toLocaleString()}</Text>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
              />
            )}
            </SafeAreaView>
            }





    </View>
      


<View style={styles.fieldRow}>

<Button onPress={showEndPicker} title="Select End Date" />

</View>

<View style={styles.fieldRow}>
      <Button onPress={showTimepicker} title="Select End Time" />
</View>

<View style={styles.fieldRow}>


      {endPickerVisible && (
        <DateTimePicker
          testID="dateTimePickerEnd"
          value={endDate}
          mode={'date'}
          display="default"
          onChange={handleEndChange}
        />
      )}
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

    

  

<View style = {styles.container}>
      <View style= {styles.DateSelectionContainer}>

      
    

    </View>

    

      <Text>Selected Start Date: {startDate.toLocaleDateString('en-GB')}</Text>
      <Text>Selected End Date: {endDate.toLocaleDateString('en-GB')}</Text>
    
    <Text> Start Time : {new Date(startTime).toLocaleTimeString()}</Text>
    <Text> End Time : {new Date(endTime).toLocaleTimeString()}</Text>

    
    </View>
  



    </View>

    <View style={styles.fieldRow}>
            
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <Button
              title="Create Camp"
              onPress={handleSubmit} />
    </View>


    
    
    
    
    
    
    </View>


    
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%'
  },

  topContainer:{
    flex: 1,
   

    width:'100%'
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
    paddingVertical: 10,

    borderColor:"black",
    borderWidth:0.5
  }, 
  
 
});

export default CreateCamp;




