import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './Screens/HomePage';
import MainPage from './Screens/MainPage';
import { Header } from './Components/Header';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <>
      <StatusBar backgroundColor='#161616' barStyle='light-content' />
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={{
          tabBarStyle: { backgroundColor: '#292929' },
          tabBarActiveTintColor: '#B427F1',
          tabBarInactiveTintColor: '#F6F7F8',
        }}
      >
        <Tab.Screen
          name='Home'
          component={HomePage}
          options={{
            tabBarLabel: 'Home',
            headerShown: false,
          }}
        />
        {/* <Tab.Screen
          name='Swipe'
          component={MainPage}
          options={{
            tabBarLabel: 'Swipe',
            headerShown: false,
          }}
        /> */}
      </Tab.Navigator>
    </>
  );
}

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle='dark' />
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='HomePage' component={TabNavigator} />
        <Stack.Screen name='MainPage' component={MainPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;