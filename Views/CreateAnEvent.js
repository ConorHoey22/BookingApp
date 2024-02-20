import React, { useState } from 'react';
import { View, Button, Text, Platform , TextInput} from 'react-native';

const CreateEvent = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = () => {
    if (!location || !date || !time || !price) {
      setError('Please fill out all fields');
      return;
    }
    // Add your logic here to handle the form submission
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Enter a location:</Text>
      <TextInput
        placeholder="Enter the Location here"
        value={location}
        onChangeText={setLocation}
      />
  
      <Text>Enter a time:</Text>
      <TextInput
        placeholder="Time"
        value={time}
        onChangeText={setTime}
      />
      <Text>Enter a price:</Text>
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button
        title="Submit"
        onPress={handleSubmit}
      />
    </View>
  );
};

export default CreateEvent;