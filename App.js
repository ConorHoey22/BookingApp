import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import DashboardCRM from './screens/DashboardCRM';
import DashboardAdmin from './screens/DashboardAdmin';
import Logout from './screens/Logout';
import LogOutAdmin from './screens/LogOutAdmin';

const Tab = createBottomTabNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setAdminIsLoggedIn] = useState(false);

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Login') {
        iconName = focused ? 'log-in' : 'log-in-outline';
      } else if (route.name === 'SignUp') {
        iconName = focused ? 'person-add' : 'person-add-outline';
      } else if (route.name === 'DashboardCRM') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'DashboardAdmin') {
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
          <Tab.Screen name="DashboardAdmin" component={DashboardAdmin} options={{ tabBarButton: () => null }} />
          <Tab.Screen name="SignUp" component={SignUp} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }



  if (isAdminLoggedIn) {
    return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="DashboardAdmin" component={DashboardAdmin} />
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
        <Tab.Screen name="DashboardCRM" component={DashboardCRM} />
        <Tab.Screen name="DashboardAdmin" component={DashboardAdmin} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="Logout">
          {(props) => <Logout {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;