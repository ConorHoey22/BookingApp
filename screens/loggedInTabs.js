// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import Home from './Home';
// import Login from './Login';
// import Logout from './Logout';
// import SignUp from './SignUp';

// import DashboardCRMMain from './DashboardCRM';

// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Tab = createBottomTabNavigator();



// const LoggedInTabs = ({ setIsLoggedIn }) => {

//       const handleLogout = async (navigation) => {

//         console.log("YEOP")
//         try {
//           await AsyncStorage.removeItem('jwtToken');
//           setIsLoggedIn(false);
//           navigation.navigate('Home');
//           // navigation.reset({
//           //   index: 0,
//           //   routes: [{ name: 'Home' }],
//           // });

 

//         } catch (error) {
//           console.error('Error removing JWT token:', error);
//         }
//       };

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
//           } else if (route.name === 'DashboardCRM') {
//             iconName = 'analytics';
//           } else if (route.name === 'Logout') {
//             iconName = 'log-out';
//           }
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={Home} />
//       <Tab.Screen name="DashboardCRM" component={DashboardCRMMain} />
//       <Tab.Screen
//         name="Logout" component={Logout} 
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="log-out" size={size} color={color} />
//           ),
//         }}
//         listeners={({ navigation }) => ({
//           tabPress: (e) => {
//             e.preventDefault();
//             handleLogout(navigation);
//           },
//         })}
//       />
//    {/* <Tab.Screen name="Login">
//         {() => <Login />}
//       </Tab.Screen> */}
    
//     </Tab.Navigator>
//   );
// };

// export default LoggedInTabs;
// // const LoggedInTabs = ({ setIsLoggedIn }) => {
// //   return (
// //         <Tab.Navigator
// //           initialRouteName="Home"
// //           screenOptions={({ route }) => ({
// //             tabBarActiveTintColor: 'blue',
// //             tabBarInactiveTintColor: 'gray',
// //             tabBarIcon: ({ color, size }) => {
// //               let iconName;
// //               if (route.name === 'Home') {
// //                 iconName = 'home';
// //               } else if (route.name === 'Login') {
// //                 iconName = 'log-in';
// //               } else if (route.name === 'Sign Up') {
// //                 iconName = 'person-add-sharp';
// //               }
// //               return <Ionicons name={iconName} size={size} color={color} />;
// //             },
// //           })}
// //         >
// //           <Tab.Screen
// //             name="Login"
// //               component={Login} // Use the stack navigator here
// //               options={{
// //                 tabBarButton: () => null, // Hide the tab button
// //                 tabBarLabel: () => null, // This removes the label
// //               }}
// //             />

// //           <Tab.Screen
// //               name="DashboardCRM"
// //               component={DashboardCRM} // Use the stack navigator here
// //               options={{
// //                       tabBarIcon: ({ color, size }) => (
// //                       <Ionicons name="home" size={size} color={color} />
// //                 ),
// //               }}
// //             />
// //             <Tab.Screen
// //               name="Logout"
// //               options={{
// //                 tabBarIcon: ({ color, size }) => (
// //                   <Ionicons name="log-out" size={size} color={color} />
// //                 ),
// //               }}
// //             >
// //               {() => <Logout setIsLoggedIn={setIsLoggedIn} />}
// //             </Tab.Screen>

// //     </Tab.Navigator>
// //   );
// // };

// // export default LoggedInTabs;