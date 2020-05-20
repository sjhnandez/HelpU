import React from 'react';
import { TouchableOpacity, Text, Image, View } from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import * as Font from 'expo-font';
import { AppLoading } from 'expo'

export default class SelectableProfile extends React.Component {
    state = {
        fontsLoaded: false,
    }

    async componentDidMount() {
        await Font.loadAsync({
            'AvenirBold': require('../assets/fonts/AvenirNextLTPro-Bold.otf'),
            'AvenirItalic': require('../assets/fonts/AvenirNextLTPro-It.otf'),
            'AvenirReg': require('../assets/fonts/AvenirNextLTPro-Regular.otf')
        });
        this.setState({ fontsLoaded: true });
    }
    render() {
        if (this.state.fontsLoaded) {
            return (
                <TouchableOpacity activeOpacity={0.5} style={{ width: '90%', height: undefined, aspectRatio: 3, marginHorizontal: '5%', marginVertical: '3%' }}
                    onPress={this.props.showProfile}
                >
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#4f3976' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ height: '65%', width: undefined, aspectRatio: 1, borderRadius: 10000, overflow:'hidden' }}
                                source={this.props.profilePicture}
                                resizeMode='stretch'
                            />
                        </View>
                        <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'center' }}>
                            <Text adjustsFontSizeToFit
                            numberOfLines={2}
                            style={{ fontFamily: 'AvenirBold', fontSize: RFPercentage(2.5), color: '#ffbc31', marginRight: '5%'}}>
                                {this.props.name}
                            </Text>
                            <Text adjustsFontSizeToFit
                            numberOfLines={2}
                            style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#ffbc31', marginRight: '6%' }}>
                                {this.props.description}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity >
            );
        } else {
            return <AppLoading/>;
        }
    }
}
