import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Logout = ({ setIsLoggedIn }) => {
  const navigation = useNavigation();

  useEffect(() => {
    handleLogin();
  }, []);

  const handleLogin = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      setIsLoggedIn(false);
  
    } catch (error) {
      console.error('Error logging out:', error);
    }

  };

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
};

export default Logout;
