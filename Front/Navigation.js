import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

// Importación de pantallas
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/ResgisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import AccountScreen from './src/screens/AccountScreen';
import TransactionScreen from './src/screens/TransactionScreen';
import LoanScreen from './src/screens/LoanScreen';
import ReportScreen from './src/screens/ReportScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistory';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabs({ navigation }) {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Inicio') {
            return <MaterialCommunityIcons name="home" size={size} color={color} />;
          } else if (route.name === 'Cuenta') {
            return <FontAwesome5 name="wallet" size={size} color={color} />;
          } else if (route.name === 'Transacciones') {
            return <Ionicons name="swap-horizontal" size={size} color={color} />;
          } else if (route.name === 'Prestamos') {
            return <FontAwesome5 name="hand-holding-usd" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#8A05BE',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen}
        initialParams={{ drawerNavigation: navigation }}
      />
      <Tab.Screen name="Cuenta" component={AccountScreen} />
      <Tab.Screen name="Transacciones" component={TransactionScreen} />
      <Tab.Screen name="Prestamos" component={LoanScreen} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerStyle: {
          backgroundColor: '#8A05BE',
          paddingVertical: 20,
        },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#E5C9F3',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        drawerIcon: ({ focused, color, size }) => {
          if (route.name === 'Inicio') {
            return <MaterialCommunityIcons name="home" size={size} color={color} />;
          } else if (route.name === 'Perfil') {
            return <FontAwesome5 name="user-alt" size={size} color={color} />;
          } else if (route.name === 'Cuenta') {
            return <FontAwesome5 name="wallet" size={size} color={color} />;
          } else if (route.name === 'Prestamos') {
            return <FontAwesome5 name="hand-holding-usd" size={size} color={color} />;
          } else if (route.name === 'Reportes') {
            return <Ionicons name="stats-chart" size={size} color={color} />;
          } else if (route.name === 'Transacciones') {
            return <Ionicons name="swap-horizontal" size={size} color={color} />;
          }
        },
      })}
    >
      <Drawer.Screen name="Inicio" component={MainTabs} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="Cuenta" component={AccountScreen} />
      <Drawer.Screen name="Prestamos" component={LoanScreen} />
      <Drawer.Screen name="Reportes" component={ReportScreen} />
      <Drawer.Screen name="Transacciones" component={TransactionScreen} />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}