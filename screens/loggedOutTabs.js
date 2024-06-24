// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import Home from './Home';
// import Login from './Login';
// import SignUp from './SignUp';

// import DashboardCRMMain from './DashboardCRM';
// const Tab = createBottomTabNavigator();

// const LoggedOutTabs = ({ setIsLoggedIn }) => {
//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={({ route }) => ({
//         tabBarActiveTintColor: 'blue',
//         tabBarInactiveTintColor: 'gray',
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === 'Home') {
//             iconName = 'home';
//           } else if (route.name === 'Login') {
//             iconName = 'log-in';
//           } else if (route.name === 'SignUp') {
//             iconName = 'person-add-sharp';
//           }
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={Home} />

//       <Tab.Screen name="DashboardCRM" component={DashboardCRMMain} />
//       <Tab.Screen name="Login" component={Login}/>
//       <Tab.Screen name="SignUp" component={SignUp} />
//     </Tab.Navigator>
//   );
// };

// export default LoggedOutTabs;