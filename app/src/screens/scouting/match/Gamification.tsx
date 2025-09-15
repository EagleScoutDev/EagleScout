import {
    Keyboard,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import FormSection from '../../../components/form/FormSection';
import React, { useState } from 'react';
import FormComponent from '../../../components/form/FormComponent';
import StandardButton from '../../../components/StandardButton';
import MatchInformation from '../../../components/form/MatchInformation';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ReefscapeAutoModal from '../../../components/games/reefscape/ReefscapeAutoModal';

// TODO: add three lines to open drawer
const Tab = createMaterialTopTabNavigator();

function Gamification({
    match,
    setMatch,
    team,
    setTeam,
    teamsForMatch,
    colors,
    styles,
    navigation,
    competition,
    data,
    arrayData,
    setArrayData,
    submitForm,
    isSubmitting,
    startRelativeTime,
    setStartRelativeTime,
    timeline,
    setTimeline,
    fieldOrientation,
    setFieldOrientation,
    selectedAlliance,
    setSelectedAlliance,
    autoPath,
    setAutoPath,
}) {
    const [activePage, setActivePage] = useState('Match');
    const [modalIsOpen, setModalIsOpen] = useState(true);

    return (
        <>
            <Tab.Navigator
                // change the position to be on the bottom
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: colors.background,
                        borderTopColor: colors.background,
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.text,
                    // make the distance between each tab smaller
                    tabBarGap: 0,
                    tabBarLabelStyle: {
                        fontSize: 10,
                    },
                }}>
                <Tab.Screen
                    name={'Match'}
                    options={{
                        headerTintColor: colors.text,
                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontWeight: 'bold',
                        },

                        tabBarStyle: {
                            backgroundColor: colors.background,
                        },
                    }}
                    children={() => (
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <View
                                    style={{
                                        width: '100%',
                                    }}>
                                    {competition != null && (
                                        <Text
                                            style={{
                                                color: colors.text,
                                                fontWeight: 'bold',
                                                fontSize: 20,
                                                textAlign: 'center',
                                                margin: '5%',
                                            }}>
                                            {competition.name}
                                        </Text>
                                    )}
                                    <MatchInformation
                                        match={match}
                                        setMatch={setMatch}
                                        team={team}
                                        setTeam={setTeam}
                                        teamsForMatch={teamsForMatch}
                                        selectedOrientation={fieldOrientation}
                                        setSelectedOrientation={setFieldOrientation}
                                        selectedAlliance={selectedAlliance}
                                        setSelectedAlliance={setSelectedAlliance}
                                    />
                                </View>
                                <View style={{ width: '100%', marginBottom: '5%' }}>
                                    <StandardButton
                                        text={'Next'}
                                        onPress={() => {
                                            navigation.navigate(Object.keys(data)[0]);
                                            setActivePage(Object.keys(data)[0]);
                                            setModalIsOpen(true);
                                        }}
                                        color={colors.primary}
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />
                {data &&
                    Object.entries(data).map(([key, value], index) => {
                        return (
                            <Tab.Screen
                                key={key}
                                name={key}
                                options={{
                                    // change font color in header
                                    headerTintColor: colors.text,
                                    tabBarLabelStyle: {
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                    },

                                    tabBarStyle: {
                                        backgroundColor: colors.background,
                                    },
                                }}
                                listeners={{
                                    tabPress: e => {
                                        setActivePage(key);
                                        setModalIsOpen(true);
                                    },
                                }}
                                children={() => (
                                    // <KeyboardAvoidingView behavior={'height'}>
                                    <ScrollView keyboardShouldPersistTaps="handled">
                                        <View
                                            style={{
                                                marginHorizontal: '5%',
                                            }}>
                                            <FormSection colors={colors} title={''} key={key.length}>
                                                {value.map(item => {
                                                    return (
                                                        <View
                                                            key={item.question}
                                                            style={{
                                                                marginVertical: '5%',
                                                            }}>
                                                            <FormComponent
                                                                key={item.question}
                                                                colors={colors}
                                                                item={item}
                                                                styles={styles}
                                                                arrayData={arrayData}
                                                                setArrayData={setArrayData}
                                                            />
                                                        </View>
                                                    );
                                                })}
                                            </FormSection>
                                        </View>
                                        {/*if the index is not the last one, add a button that navigates users to the next tab*/}
                                        {index !== Object.keys(data).length - 1 && (
                                            <View style={{ width: '100%', marginBottom: '5%' }}>
                                                <StandardButton
                                                    text={'Next'}
                                                    width={'85%'}
                                                    onPress={() => {
                                                        navigation.navigate(Object.keys(data)[index + 1]);
                                                        setActivePage(Object.keys(data)[index + 1]);
                                                    }}
                                                    color={colors.primary}
                                                />
                                            </View>
                                        )}
                                        {/*  if the index is the last one, show a touchable opacity*/}
                                        {index === Object.keys(data).length - 1 && (
                                            <View style={{ width: '100%', marginBottom: '50%' }}>
                                                <StandardButton
                                                    text={'Submit'}
                                                    width={'85%'}
                                                    color={colors.primary}
                                                    isLoading={isSubmitting}
                                                    onPress={submitForm}
                                                />
                                            </View>
                                        )}
                                    </ScrollView>
                                    // </KeyboardAvoidingView>
                                )}
                            />
                        );
                    })}
            </Tab.Navigator>
            <ReefscapeAutoModal
                isActive={activePage === 'Auto' && modalIsOpen}
                setIsActive={setModalIsOpen}
                fieldOrientation={fieldOrientation}
                setFieldOrientation={setFieldOrientation}
                selectedAlliance={selectedAlliance}
                setSelectedAlliance={setSelectedAlliance}
                autoPath={autoPath}
                setAutoPath={setAutoPath}
                arrayData={arrayData}
                setArrayData={setArrayData}
                form={data && data.Auto}
            />
        </>
    );
}

export default Gamification;
