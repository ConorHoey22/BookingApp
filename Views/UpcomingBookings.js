import React from 'react';
import { Text, View, ScrollView, StyleSheet, SafeAreaView, Button } from 'react-native';

const UpcomingBooking = () => {
  const data = [
    { id: 1, bookingType: 'Party', date: '01-01-2024', time: '10:00 AM', attendance: 15, bookedBy: 'Alice' },
    { id: 2, bookingType: 'Party', date: '02-01-2024', time: '8:00 PM', attendance: 50, bookedBy: 'Bob' },
    { id: 3, bookingType: 'Conference', date: '03-01-2024', time: '9:00 AM', attendance: 100, bookedBy: 'Charlie' },
    // More data ...
  ];s

  return (
    
    <View style={styles.container}>
        {data.map(item => (

        <View style={styles.container} key={item.id}>
            <Text>Booking Type : {item.bookingType}</Text>
            <Text>Date : {item.date} </Text>
            <Text>Time : {item.time} </Text>
            <Text>Booked By: {item.bookedBy}</Text>
            <Button title='Manage Booking' />
        </View>

        ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  header: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
    padding: 10,
  },
});

export default UpcomingBooking;
