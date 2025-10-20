import { Text, View } from 'react-native';

export interface PercentageWinBarProps {
    bluePercentage: number
    redPercentage: number
}
export function PercentageWinBar({
    bluePercentage,
    redPercentage,
}: PercentageWinBarProps) {
    const bothZero = bluePercentage === 0 && redPercentage === 0;

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    marginHorizontal: '10%',
                    justifyContent: 'center',
                }}>
                {redPercentage !== 100 && (
                    <View
                        style={{
                            backgroundColor: 'blue',
                            minWidth: bothZero ? '50%' : `${bluePercentage}%`,
                            height: 24,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            justifyContent: 'center',
                            borderRadius: bluePercentage === 100 ? 10 : 0,
                        }}>
                        <Text
                            style={{
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: bluePercentage > redPercentage ? 'bold' : 'normal',
                            }}>
                            {bluePercentage}%
                        </Text>
                    </View>
                )}
                {redPercentage !== 0 && (
                    <View
                        style={{
                            backgroundColor: 'red',
                            width: bothZero ? '50%' : `${redPercentage}%`,
                            height: 24,
                            borderBottomRightRadius: 10,
                            borderTopRightRadius: 10,
                            justifyContent: 'center',
                            borderRadius: redPercentage === 100 ? 10 : 0,
                        }}>
                        <Text
                            style={{
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: redPercentage > bluePercentage ? 'bold' : 'normal',
                            }}>
                            {redPercentage}%
                        </Text>
                    </View>
                )}
            </View>
            {/*<Text*/}
            {/*  style={{*/}
            {/*    color: bluePercentage > redPercentage ? colors.primary : 'red',*/}
            {/*    textAlign: 'center',*/}
            {/*    marginTop: 10,*/}
            {/*    fontSize: 20,*/}
            {/*  }}>*/}
            {/*  {bluePercentage > redPercentage ? bluePercentage : redPercentage}%{' '}*/}
            {/*  likelihood of {bluePercentage > redPercentage ? 'Blue' : 'Red'} Alliance*/}
            {/*  win*/}
            {/*</Text>*/}
        </View>
    );
};
