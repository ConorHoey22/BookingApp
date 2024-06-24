import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import DashboardCRM from './DashboardCRM';
import DashboardAdmin from './DashboardAdmin';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Tab = createBottomTabNavigator();

const LoggedInAdminTabs = ({ setIsAdminLoggedIn }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Login') {
            iconName = 'log-in';
          } else if (route.name === 'Sign Up') {
            iconName = 'person-add-sharp';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >

    <Tab.Screen
        name="DashboardAdmin"
        component={DashboardAdmin} // Use the stack navigator here
        options={{
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

        <Tab.Screen
            name="Login"
              component={Login} // Use the stack navigator here
              options={{
                tabBarButton: () => null, // Hide the tab button
                tabBarLabel: () => null, // This removes the label
              }}
            />

        <Tab.Screen
            name="Logout"
            component={Home}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="log-out" size={size} color={color} />
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                const handleLogout = async () => {
                  try {
                    await AsyncStorage.removeItem('jwtToken');
                    setIsAdminLoggedIn(false);
                    navigation.navigate('Login'); // Navigate to the Login screen after logout
                  } catch (error) {
                    console.error('Error removing JWT token:', error);
                  }
                };
                handleLogout();
              },
            })}
          />

    </Tab.Navigator>
  );
};

export default LoggedInAdminTabs;