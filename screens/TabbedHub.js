import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './ProfileScreen';
import ChatScreen from './ChatScreen';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function TabbedHub(props) {
    return (
        <NavigationContainer independent={true} >
            <Tab.Navigator tab tabBarOptions={{
                activeBackgroundColor: '#4f3976',
                inactiveBackgroundColor: '#4f3976',
                activeTintColor: '#e6b637',
                inactiveTintColor:'#ffffff',
                style: { borderTopWidth: 0 },
            }}
            lazy={true}>
                <Tab.Screen name="Perfil"
                    component={ProfileScreen}
                    initialParams={props.route.params}
                    options={{
                        tabBarLabel: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        ),
                    }} />
                <Tab.Screen name="Chat"
                    component={ChatScreen}
                    initialParams={props.route.params}
                    options={{
                        tabBarLabel: 'Chat',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="message" color={color} size={size} />
                        ),
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}