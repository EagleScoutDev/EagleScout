import React, {useCallback} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {BottomSheetView} from '@gorhom/bottom-sheet';
import {StyleSheet, Text} from 'react-native';
import StandardButton from '../../../components/StandardButton';

export const BettingInfoStep = ({
  index,
  title,
  nextScreen,
  isFinalScreen,
  handleBottomSheetClose,
  children,
}: {
  index: number;
  title: string;
  nextScreen: string;
  isFinalScreen: boolean;
  handleBottomSheetClose: () => void;
  children: React.ReactNode;
}) => {
  const {colors} = useTheme();
  const {navigate} = useNavigation();

  const handleNavigatePress = useCallback(() => {
    requestAnimationFrame(() => navigate(nextScreen as never));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BottomSheetView style={styles.container}>
      <Text style={styles.heading}>How to Bet</Text>
      <Text style={styles.subheading}>{title}</Text>
      <BottomSheetView style={styles.infoBox}>{children}</BottomSheetView>
      <BottomSheetView style={styles.buttonBox}>
        <StandardButton
          width={'100%'}
          color={colors.primary}
          onPress={isFinalScreen ? handleBottomSheetClose : handleNavigatePress}
          text={isFinalScreen ? 'Close' : 'Next'}
        />
      </BottomSheetView>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    paddingBottom: 20,
  },
  subheading: {
    fontSize: 20,
    color: 'black',
    paddingBottom: 10,
  },
  infoBox: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 12,
    padding: 10,
    width: '100%',
  },
  buttonBox: {
    width: '100%',
    alignSelf: 'flex-end',
  },
});