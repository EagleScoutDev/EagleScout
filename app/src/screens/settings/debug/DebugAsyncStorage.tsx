/**
 * This file will separate the forms the user has submitted into two:
 * 1) the forms they have submitted offline, but have not been pushed
 *    give option for "select all" and submit, or user can select manually
 * 2) the forms they have uploaded to the database in the past
 */
import {
    Button,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";

export function DebugOffline({ navigation }) {
    const [keys, setKeys] = useState([]);
    const [selected, setSelected] = useState();
    const [value, setValue] = useState();
    const { colors } = useTheme();

    const getAllKeys = async () => {
        try {
            setKeys(await AsyncStorage.getAllKeys());
        } catch (e) {
            // read key error
        }
        console.log('keys: ' + keys);
    };

    useEffect(() => {
        getAllKeys().then(r => console.log(r));
    }, []);

    async function handleClick(key) {
        setSelected(key);
        setValue(await AsyncStorage.getItem(key));
    }

    return (
        <SafeAreaView>
            <View style={{ flexDirection: 'column' }}>
                <Button title={'Force Refresh'} onPress={() => getAllKeys()} />
                <ScrollView>
                    {keys != null &&
                        keys.map((key, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => handleClick(key)}
                                    key={index}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            padding: 15,
                                            color: colors.primary,
                                            fontSize: 17,
                                        }}>
                                        {key}
                                    </Text>
                                    <Text
                                        style={{
                                            padding: 15,
                                            color: colors.notification,
                                            fontSize: 17,
                                        }}
                                        onPress={async () => {
                                            await AsyncStorage.removeItem(key);
                                            getAllKeys();
                                        }}>
                                        {key}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                </ScrollView>
                {selected !== '' && (
                    <Text style={{ color: colors.text }}>Selected: {selected}</Text>
                )}
                <View
                    style={{
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                        marginTop: 10,
                        marginBottom: 10,
                    }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 10,
                        // margin: 10,
                        // marginHorizontal: 30,
                        borderBottomColor: colors.border,
                        borderBottomWidth: 4,
                    }}>
                    <Text style={{ color: colors.text }}>DATA</Text>
                    <Button
                        title={'Copy to Clipboard'}
                        onPress={() => Clipboard.setString(value)}
                    />
                </View>
                <ScrollView style={{ paddingBottom: 30 }}>
                    <Text style={{ color: colors.text }}>{value}</Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};
