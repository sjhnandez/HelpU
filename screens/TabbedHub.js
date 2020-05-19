import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './ProfileScreen';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function TabbedHub(props) {
    console.log(props);
    return (
        <NavigationContainer independent={true} >
            <Tab.Navigator tab tabBarOptions={{
                activeBackgroundColor: '#4f3976',
                activeTintColor: '#ffffff',
                style: { borderTopWidth: 0 },
            }}>
                <Tab.Screen name="Perfil"
                    component={ProfileScreen}
                    initialParams={props.route.params}
                    options={{
                        tabBarLabel: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        ),
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}