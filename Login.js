/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { loadPartialConfigAsync } from '@babel/core';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
    Image,
    TouchableOpacity,
    Component,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
    Alert,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import PasswordInputText from 'react-native-hide-show-password-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            checkLogin: 0
        }
    }
    onSubmit = () => {
        axios
            .post('https://qlsc.maysoft.io/server/api/auth/login', {
                username: this.state.username,
                password: this.state.password
            })
            .then(({ data }) => {
                this.setState({ checkLogin: data.status ? 1 : 0 });
                if (this.state.checkLogin > 0) {
                    alert("Thông báo! Bạn đã đăng nhập thành công!");
                    AsyncStorage.setItem('access_token', data.data.access_token);
                    AsyncStorage.setItem('token_type', data.data.token_type);
                    this.props.navigation.replace('Home')
                }
                else {
                    alert(data.errors.message || data.errors[0]);
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }
    render() {

        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <View
                    style={{
                        width: '70%',
                        margin: 60,
                    }}>
                    <Image
                        source={{
                            uri: 'https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/33/b6/0c/33b60c91-3463-7f18-e1e4-13e923ce28c5/source/200x200bb.jpg',
                        }}
                        style={{
                            width: 60,
                            height: 100,
                            marginVertical: 60,
                            marginHorizontal: 100,
                        }}
                    />
                    <Text style={styles.titleInput}>Tên Tài Khoản</Text>
                    <TextInput
                        style={styles.inputDesign}
                        placeholder="Nhập tên tài khoản"
                        onChangeText={(username) => this.setState({ username: username })}
                    />
                    <Text style={styles.titleInput}>Mật Khẩu</Text>
                    <TextInput
                        style={styles.inputDesign}
                        placeholder="Nhập mật khẩu"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password: password })}
                    />

                    <TouchableOpacity
                        onPress={this.onSubmit}
                        style={styles.touchStyle}
                    >
                        <View style={styles.button}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: 'white',
                                    fontSize: 16,
                                    lineHeight: 30,
                                }}>
                                Đăng nhập
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
}


const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '800',
    },
    inputDesign: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        color: 'black',
        borderRadius: 4,
        paddingVertical: 10,
        marginBottom: 30,
    },
    titleInput: {
        fontWeight: 'bold',
        color: 'black',
        paddingVertical: 10,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#0a8e9d',
        padding: 10,
        borderRadius: 10,
        height: 50,
    },
    touchStyle: {
        marginTop: 30,
    }
});

