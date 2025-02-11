import React from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import StandardButton from '../../components/StandardButton';

export const ExportCompetitionSheet = ({
  competitionName,
  onExportScoutReports,
  onExportPitScoutReports,
  onClose,
}: {
  competitionName: string;
  onExportScoutReports: () => void;
  onExportPitScoutReports: () => void;
  onClose: () => void;
}) => {
  const {colors} = useTheme();
  return (
    <BottomSheet
      index={0}
      enableDynamicSizing={false}
      snapPoints={['55%']}
      enablePanDownToClose={true}
      onClose={onClose}
      animateOnMount={true}
      handleIndicatorStyle={{
        backgroundColor: colors.text,
      }}
      backgroundStyle={{
        backgroundColor: colors.card,
      }}
      containerStyle={{
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
      <BottomSheetView
        style={{
          backgroundColor: colors.card,
          borderRadius: 10,
          padding: 20,
          height: 200,
        }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            marginBottom: 5,
            color: colors.text,
            textDecorationStyle: 'solid',
            textDecorationColor: colors.border,
          }}>
          Export Data for {competitionName}
        </Text>
        <Text
          style={{
            color: colors.text,
            marginBottom: 15,
          }}>
          Select the type of data you would like to export
        </Text>
        <StandardButton
          text="Export Scout Reports"
          color={colors.primary}
          onPress={() => {
            onExportScoutReports();
          }}
        />
        <StandardButton
          text="Export Pit Scout Reports"
          color={colors.primary}
          onPress={() => {
            onExportPitScoutReports();
          }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};
