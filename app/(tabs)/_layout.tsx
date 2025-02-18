import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
import RegisterScreen from './screens/register';
import HomeScreen from './screens/home';
import HistoryScreen from './screens/history';
import SettingsScreen from './screens/setting';
import Navbar from './screens/navbar';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => <Navbar />
        }}
      />
      <Stack.Screen name="History" component={HistoryScreen} options={{
          header: () => <Navbar />
        }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{
          header: () => <Navbar />
        }} />
    </Stack.Navigator>
  );
}
