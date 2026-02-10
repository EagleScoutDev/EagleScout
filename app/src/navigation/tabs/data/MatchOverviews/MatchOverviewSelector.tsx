import React, {useEffect, useState} from 'react';
import {
    Pressable,
    View,
    TextInput,
    StyleSheet,
    Button,
    Text,
} from 'react-native';
// import {SimpleTeam, TBA} from '../../lib/TBAUtils';
import {ColorChooser} from '../../../../../src/ui/components/OrientationChooser';
import {useNavigation, useTheme} from '@react-navigation/native';
import {UIButton, UIButtonStyle, UIButtonSize} from "@/ui/components/UIButton";
import {useRootNavigation} from "@/navigation";

const MatchOverviewSelector = () => {
    const {colors} = useTheme();
    const styles = StyleSheet.create({
        input: {
            textAlign: 'left',
            paddingTop: '5%',
            paddingBottom: '2%',
            borderBottomWidth: 1,
            borderColor: 'gray',
            // margin: 10,
            marginHorizontal: 10,
            padding:10,
            color: colors.text,
        },
        titleText: {
            textAlign: 'left',
            padding: '5%',
            fontSize: 30,
            fontWeight: 'bold',
            color: 'colors.text',
            // marginVertical: 20,
        },
        button: {
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            backgroundColor: colors.primary,
        },
    });

    const rootNavigation = useRootNavigation();

    const [selectedAlliance, setSelectedAlliance] = useState<string>('Blue');
    const [matchNumber, setMatchNumber] = useState('');
    const [fieldOrientation, setFieldOrientation] = useState('red');
    useEffect(() => {
        if (!matchNumber || Number(matchNumber) > 400) {
            return;
        }
    }, [matchNumber]);

    return (
        <View style={{backgroundColor: colors.card, borderColor: colors.border, borderWidth:1, borderRadius:22, margin:30, padding: 20}}>
            <Text style={styles.titleText}>Match #: </Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={matchNumber}
                onChangeText={text => setMatchNumber(text)}
            />
            <Text style={styles.titleText}>Side: </Text>
            <ColorChooser
                selectedColor={selectedAlliance}
                setSelectedColor={setSelectedAlliance}
            />

                <UIButton
                    style={UIButtonStyle.fill}
                    text={"Generate Alliance Overview"}
                    size={UIButtonSize.xl}
                    onPress={() => {
                        console.log("pressed");
                        rootNavigation.push("MatchOverview", {
                            matchNumber: Number(matchNumber),
                            alliance: selectedAlliance
                        });
                    }}
                />

        </View>
    );
};
export default MatchOverviewSelector;
