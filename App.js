import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import PlayersScreen from './screens/PlayersScreen';
import PairsScreen from './screens/PairsScreen';
import MatchesScreen from './screens/MatchesScreen';
import AddMatchScreen from './screens/AddMatchScreen';
import { DataProvider } from './contexts/DataContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <DataProvider>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{ 
            headerShown: true,
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitle: () => (
              <Image
                source={require('./assets/images/logo.jpg')}
                style={styles.logo}
                resizeMode="contain"
              />
            ),
            tabBarStyle: {
              backgroundColor: '#000',
              borderTopColor: '#0287d6',
              borderTopWidth: 2,
            },
            tabBarActiveTintColor: '#0287d6',
            tabBarInactiveTintColor: '#888',
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Players" component={PlayersScreen} />
          <Tab.Screen name="Pairs" component={PairsScreen} />
          <Tab.Screen name="Matches" component={MatchesScreen} />
          <Tab.Screen name="Add Match" component={AddMatchScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 40,
  },
});
