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
                <TouchableOpacity activeOpacity={0.5} style={{ width: '90%', aspectRatio: 3, marginVertical: '3%' }}
                    onPress={this.props.showProfile}
                >
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#4f3976', borderRadius: 15, justifyContent: 'center' }}>
                        <Image style={{width:'20%', aspectRatio: 1, borderRadius: 10000, borderWidth: 1, borderColor: 'white', alignSelf:'center' , marginHorizontal:'4%'}}
                            source={this.props.profilePicture}
                            resizeMode='cover'
                        />
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                            <Text adjustsFontSizeToFit
                                numberOfLines={2}
                                style={{ fontFamily: 'AvenirBold', fontSize: RFPercentage(2.5), color: '#ffbc31', }}>
                                {this.props.name}
                            </Text>
                            <Text adjustsFontSizeToFit
                                numberOfLines={2}
                                style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#ffbc31', }}>
                                {this.props.info}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity >
            );
        } else {
            return <AppLoading />;
        }
    }
}
