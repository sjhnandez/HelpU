import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './ProfileScreen';
import BrowseScreen from './BrowseScreen';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { st } from '../config/Firebase'
import { AppLoading } from 'expo'

const Tab = createBottomTabNavigator();


export default class TabbedHub extends React.Component {
    render() {
        return (
            <Tab.Navigator tab tabBarOptions={{
                activeBackgroundColor: '#4f3976',
                inactiveBackgroundColor: '#4f3976',
                activeTintColor: '#e6b637',
                inactiveTintColor: '#ffffff',
                style: { borderTopWidth: 0 },
            }}
                lazy={true}>
                <Tab.Screen name="Perfil"
                    component={ProfileScreen}
                    initialParams={this.props.route.params}
                    options={{
                        tabBarLabel: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        ),
                    }} />
                <Tab.Screen name="Chat"
                    component={BrowseScreen}
                    initialParams={this.props.route.params}
                    options={{
                        tabBarLabel: 'Chat',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="message" color={color} size={size} />
                        ),
                    }} />
            </Tab.Navigator>
        );
    }
}