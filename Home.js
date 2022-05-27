/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { loadPartialConfigAsync } from '@babel/core';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
    Image,
    TouchableOpacity,
    Component,
    Button,
    StatusBar,
    SafeAreaView,
    ScrollView,
    RefreshControl,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
    Alert,
} from 'react-native/Libraries/NewAppScreen';

import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-neat-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import axios from 'axios';
import { RadioButton } from 'react-native-paper';
import BodyItem from './BodyItem';


export default Home = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateString, setDateString] = useState("24/05/2020 - 30/05/2022");
    const [allReports, setAllReports] = useState([]);
    const [curReports, setCurReports] = useState([]);
    const [common, setCommon] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [statusChecked, setStatusChecked] = React.useState('');
    const [statusArray, setStatusArray] = React.useState([]);


    const toggleModal = () => {
        if(isModalVisible&&statusChecked){
            let newReport = allReports.filter(report =>report.status===statusChecked)
            setCurReports(newReport);
        }
        setModalVisible(!isModalVisible);
    }

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const onRefresh = React.useCallback(() => {
        getData();
        setDateString("24/05/2020 - 30/05/2022");
        setRefreshing(true);
        setStatusChecked('');
        wait(1000).then(() => setRefreshing(false));
    }, [])


    const openDatePicker = () => {
        setShowDatePicker(true);
    }
    const onCancel = () => {
        // You should close the modal in here
        setShowDatePicker(false);
    }
    const onConfirm = (output) => {
        setShowDatePicker(false)
        setDateString(output.startDateString + ' - ' + output.endDateString);
        let startDate = new Date(output.startDate);
        let endDate = new Date(output.endDate);
        let newReport = allReports.filter(report => {
            let curDate = new Date(report.reportTime * 1000);
            return (curDate >= startDate && curDate <= endDate);
        })
        setCurReports(newReport);
    }
    const getData = async () => {
        const access_token = await AsyncStorage.getItem('access_token');
        const token_type = await AsyncStorage.getItem('token_type');
        const Authorization = token_type + ' ' + access_token;
        axios
            .post(
                'https://qlsc.maysoft.io/server/api/getAllReports',
                { 'page': 1 },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Authorization
                    }
                }
            )
            .then(({ data }) => {
                setAllReports(data.data.data);
                setCurReports(data.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
        axios
            .post(
                'https://qlsc.maysoft.io/server/api/getCommon',
                { 'groups': 'incidentObject, reportStatus, reportType' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Authorization
                    }
                }
            )
            .then(({ data }) => {
                setCommon(data.data);
                setStatusArray(data.data.reportStatus);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(getData,[]);

    return (
        <SafeAreaView style={styles.container}>
            <View >
                <Modal isVisible={isModalVisible} animationIn='zoomIn' animationOut='zoomOut' onBackdropPress={() => setModalVisible(false)}>
                    <View style={styles.modalStyle}>
                        <Text style={{fontSize:20,backgroundColor:'#0a8e9d', color:'white',textAlign:'center'}}>Lọc Theo Trạng Thái</Text>
                        {
                            statusArray.map(statusItem => 
                                <View style={{display:'flex',flexDirection:'row', marginLeft:'30%',alignItems:'center'}}>
                                    <RadioButton
                                    value={statusItem.code}
                                    status={statusChecked === statusItem.code ? 'checked' : 'unchecked'}
                                    onPress={() => setStatusChecked(statusItem.code)}
                                    />
                                    <Text style={{fontSize:16}}>{statusItem.name}</Text>
                                </View>
                            )
                        }
                        
                        <Button title="Tìm Kiếm" onPress={toggleModal} />
                    </View>
                </Modal>
            </View>
            <View style={styles.header}>
                <View style={styles.calendarStyle}>
                    <Text style={styles.calendarText}>{dateString}</Text>
                    <TouchableOpacity onPress={openDatePicker}>
                        <Text style={{
                            marginTop: 4
                        }}>
                            <Icon name="calendar" size={24} color='#0a8e9d' />
                        </Text>
                    </TouchableOpacity>
                    <DatePicker
                        isVisible={showDatePicker}
                        mode={'range'}
                        onCancel={onCancel}
                        onConfirm={onConfirm}
                        dateStringFormat='dd-MM-yyyy'
                    />
                </View>
                <TouchableOpacity onPress={toggleModal}>
                    <Icon name="filter" size={30} color='#0a8e9d' />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                // onPress={this.onSubmit}
                style={styles.plusIcon}
            >
                <View >
                    <Text style={styles.plusIconText}>
                        +
                    </Text>
                </View>
            </TouchableOpacity>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >

                {
                    curReports.map(reportItem => {
                        return <BodyItem
                            report={reportItem}
                            common={common}
                        />
                    })
                }

            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity onPress={getData}>
                    <Text style={[styles.footerItemIcon, styles.active]}>
                        <Icon name="list" size={20} />
                    </Text>
                    <Text style={[styles.footerItemTitle, styles.active]}>Danh Sách</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.footerItemIcon}>
                        <Icon name="tv" size={20} />
                    </Text>
                    <Text style={styles.footerItemTitle}>Theo dõi & ..</Text>
                </View>
                <View>
                    <Text style={styles.footerItemIcon}>
                        <Icon name="pie-chart" size={20} />
                    </Text>
                    <Text style={styles.footerItemTitle}>Biểu đồ</Text>
                </View>
                <View>
                    <Text style={styles.footerItemIcon}>
                        <Icon name="bell-o" size={20} />
                    </Text>
                    <Text style={styles.footerItemTitle}>Thông báo</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center' }}>
                        <Icon name="user" size={20} />
                    </Text>
                    <Text style={styles.footerItemTitle}>Cá Nhân</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
        marginHorizontal: 12,
        flex: 8,
        marginTop: 10,
    },
    text: {
        fontSize: 42,
    },
    header: {
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '90%',
        marginLeft: '5%',
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray'
    },
    footer: {
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginLeft: '2%',
        width: '96%',
        borderTopWidth: 0.5,
        borderTopColor: 'gray'
    },
    footerItemIcon: {
        textAlign: 'center'
    },
    footerItemTitle: {
        fontSize: 12,
    },
    active: {
        color: 'blue'
    },
    calendarStyle: {
        width: '80%',
        borderColor: '#0a8e9d',
        borderWidth: 2,
        borderRadius: 8,
        padding: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    calendarText: {
        fontSize: 16,
        color: 'black',
        padding: 8
    },
    bodyItem: {
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'red',
        padding: 8,
        borderRadius: 4,
        marginBottom: 10
    },
    bodyItemLeft: {
        flex: 8,
    },
    bodyItemRight: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyItemHeader: {
        display: 'flex',
        flexDirection: 'row',
    },
    bodyItemHeaderID: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
    },
    bodyItemHeaderStatus: {
        color: '#ebd694',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 20,
    },
    bodyItemDate: {
        fontStyle: 'italic'
    },
    bodyItemHeaderNC: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 20,
    },
    plusIcon: {
        position: 'absolute',
        bottom: 80,
        right: 40,
        backgroundColor: '#0a8e9d',
        width: 60,
        height: 60,
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    plusIconText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 36,
    },
    modalStyle: {
        backgroundColor: 'white',


    }
});

