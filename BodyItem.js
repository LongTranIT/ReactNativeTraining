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
    TouchableHighlight,
    Component,
    StatusBar,
    SafeAreaView,
    ScrollView
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


const BodyItem = ({report,common}) => {
    const date=new Date(report.reportTime*1000);
    const reportTypeCode=parseInt(report.reportType);
    const incidentObjectCode=parseInt(report.incidentObject);
    const reportStatusCode=parseInt(report.status);
    return (
        <View style={styles.bodyItem}>
            <View style={styles.bodyItemLeft}>
                <View style={styles.bodyItemHeader}>
                    <Text style={styles.bodyItemHeaderID}>
                        {report.reportNo}
                    </Text>
                    <Text style={[styles.bodyItemHeaderStatus,reportStatusCode?{color:'#ebd694'}:{color:'#0a8e9d'}]}>
                        {common.reportStatus[reportStatusCode].name}
                    </Text>
                    <Text style={styles.bodyItemHeaderNC}>
                        NC3
                    </Text>
                </View>
                <View>
                    <Text style={styles.bodyItemDate}>
                        {date.getDate()}
                        /
                        {date.getMonth()+1}
                        /
                        {date.getFullYear()}
                        {' '}
                        {date.getHours()}:{date.getMinutes()}
                    </Text>
                    <Text>{common.reportType[reportTypeCode].name} | {common.incidentObject[incidentObjectCode].name}</Text>
                    <Text>{report.detector}</Text>
                    <Text>{report.shortDescription}</Text>
                </View>
            </View>
            <View style={styles.bodyItemRight}>
                <Icon name="ellipsis-v" size={24} color='#0a8e9d' />
            </View>
        </View>

    );
};

export default BodyItem;


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
    activeColor:{
        color: 'green'
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
    PlusIconText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 36,
    }
});

