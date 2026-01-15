import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import PatientsScreen from './src/screens/PatientsScreen';
import PharmacieScreen from './src/screens/PharmacieScreen';
import FinanceScreen from './src/screens/FinanceScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Accueil') iconName = focused ? 'home' : 'home-outline';
              else if (route.name === 'Patients') iconName = focused ? 'people' : 'people-outline';
              else if (route.name === 'Pharmacie') iconName = focused ? 'medkit' : 'medkit-outline';
              else if (route.name === 'Finance') iconName = focused ? 'cash' : 'cash-outline';
              else if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: 'gray',
            headerStyle: { backgroundColor: '#3B82F6' },
            headerTintColor: 'white',
          })}
        >
          <Tab.Screen 
            name="Accueil" 
            component={DashboardScreen}
            options={{ title: 'Dashboard', headerTitle: 'EPS Manager' }}
          />
          <Tab.Screen 
            name="Patients" 
            component={PatientsScreen}
            options={{ title: 'Patients' }}
          />
          <Tab.Screen 
            name="Pharmacie" 
            component={PharmacieScreen}
            options={{ title: 'Pharmacie' }}
          />
          <Tab.Screen 
            name="Finance" 
            component={FinanceScreen}
            options={{ title: 'Finance' }}
          />
          <Tab.Screen 
            name="Profil" 
            component={ProfileScreen}
            options={{ title: 'Profil' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});