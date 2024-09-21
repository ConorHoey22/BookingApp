import React, { useState , Platform} from 'react';
import { View, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './screens/Home';
import Login from './screens/Login';
import SignUp from './screens/SignUp';

import MyBookings from './screens/MyBookings';
import DashboardCRM from './screens/DashboardCRM';
import DashboardAdmin from './screens/DashboardAdmin';



import CreateBooking from './screens/CreateBooking';
import CreateCamp from './Views/CreateCamp';
import CreateEvent from './Views/CreateAnEvent';

import CreateEventBooking from './screens/CreateEventBooking';
import ManageBookings from './screens/ManageBookings';
import CreateAnOffer from './Views/CreateAnOffer';


import Logout from './screens/Logout';
import LogOutAdmin from './screens/LogOutAdmin';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ForgotPassword from './screens/ForgotPassword';

const Tab = createBottomTabNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setAdminIsLoggedIn] = useState(false);

  const screenOptions = ({ route }) => ({

      headerShown: false,

    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Login') {
        iconName = focused ? 'log-in' : 'log-in-outline';
      } else if (route.name === 'SignUp') {
        iconName = focused ? 'person-add' : 'person-add-outline';
      } else if (route.name === 'Dashboard') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'MyBookings') {
        iconName = focused ? 'book' : 'book-outline';
      } else if (route.name === 'Create an Event') {
        iconName = focused ? 'today' : 'today-outline';
      } else if (route.name === 'Create a Camp') {
        iconName = focused ? 'today' : 'today-outline';
      } else if (route.name === 'Admin Dashboard') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Logout' || route.name === 'LogOutAdmin') {
        iconName = focused ? 'log-out' : 'log-out-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
  });

  if (!isLoggedIn && !isAdminLoggedIn) {
    return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Login">
            {(props) => <Login {...props} setIsAdminLoggedIn={setAdminIsLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          </Tab.Screen>
          <Tab.Screen name="Admin Dashboard" component={DashboardAdmin} options={{ tabBarButton: () => null }} />
          <Tab.Screen name="Forgot Password" component={ForgotPassword} options={{ tabBarButton: () => null }} />
          <Tab.Screen name="Reset Password" component={ResetPasswordScreen} options={{ tabBarButton: () => null }} />
          <Tab.Screen name="SignUp" component={SignUp} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }



  if (isAdminLoggedIn) {
    return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Admin Dashboard" component={DashboardAdmin} />
          <Tab.Screen name="Create a Camp" component={CreateCamp} />
          <Tab.Screen name="Create an Event" component={CreateEvent} />
          <Tab.Screen name="Create an Offer" component={CreateAnOffer} options={{ tabBarButton: () => null }} />
          <Tab.Screen name="Manage Bookings" component={ManageBookings} options={{ tabBarButton: () => null }} />
          <Tab.Screen name="Logout">
            {(props) => <LogOutAdmin {...props} setIsAdminLoggedIn={setAdminIsLoggedIn} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }

  return (

    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Dashboard" component={DashboardCRM} />
            <Tab.Screen name="MyBookings" component={MyBookings} />
            <Tab.Screen name="Create Booking" component={CreateBooking} options={{ tabBarButton: () => null }} />
            <Tab.Screen name="Create Event" component={CreateEventBooking} options={{ tabBarButton: () => null }} />
            <Tab.Screen name="Admin Dashboard" component={DashboardAdmin} options={{ tabBarButton: () => null }} />
            <Tab.Screen name="Logout">
              {(props) => <Logout {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blueHalf: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#ADD8E6',
  },
  whiteHalf: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#FFFFFF',
  },
  svgCurve: {
    position: 'absolute',
    bottom: -1, // Adjust this to make the curve appear smooth
  },
});


export default App;