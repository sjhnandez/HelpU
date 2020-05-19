import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TabbedHub from './screens/TabbedHub';


const Stack = createStackNavigator();



export default class App extends React.Component {
	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator headerMode='none'>
					<Stack.Screen name="HomeScreen" component={HomeScreen} />
					<Stack.Screen name="RegisterScreen" component={RegisterScreen} />
					<Stack.Screen name="LoginScreen" component={LoginScreen} />
					<Stack.Screen name='TabbedHub' component={TabbedHub} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}

