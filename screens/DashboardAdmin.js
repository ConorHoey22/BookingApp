import React, { useState } from 'react';
import {StyleSheet, View, TextInput, Button,Text } from 'react-native';
import validator from 'validator';

const AdminDashboard = ({ navigation }) => {


  
    const handleSave = async () => {
  
    }

    return (
      <View styles={styles.container}>
      <Text>Admin Dashboard</Text>
      
      </View>
    );
  };
  
  export default AdminDashboard;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });