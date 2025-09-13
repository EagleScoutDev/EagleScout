import React from 'react';
import {type PitScoutReportReturnData} from '../database/PitScoutReports';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {PitScoutViewer} from './modals/PitScoutViewer';

export const PitScoutReportList = ({
  reports,
  isOffline,
}: {
  reports: PitScoutReportReturnData[] | null;
  isOffline: boolean;
}) => {
  const {colors} = useTheme();
  const [chosenReport, setChosenReport] =
    React.useState<PitScoutReportReturnData | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  if (!reports || reports.length === 0) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.card,
          width: '80%',
          alignSelf: 'center',
          borderRadius: 15,
          padding: 20,
          marginTop: 20,
        }}>
        <Text
          style={{
            paddingHorizontal: '10%',
            color: 'red',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          No reports found.
        </Text>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        marginTop: 20,
      }}>
      <FlatList
        data={reports}
        ListHeaderComponent={() => (
          <View>
            <View
              style={{
                display: 'flex',
                width: '90%',
                alignSelf: 'center',
                borderRadius: 15,
                paddingHorizontal: 20,
                paddingBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1.5,
                  borderRadius: 15,
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Competition
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 2,
                  borderRadius: 15,
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Date
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setChosenReport(item);
              setModalVisible(true);
            }}
            style={{
              display: 'flex',
            }}>
            <View
              style={{
                display: 'flex',
                backgroundColor: colors.card,
                width: '90%',
                alignSelf: 'center',
                borderRadius: 15,
                padding: 20,
                marginVertical: 5,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: 'bold',
                  flex: 1.5,
                }}>
                {item.competitionName}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: 'bold',
                  flex: 2,
                  textAlign: 'right',
                }}>
                {item.createdAt.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <PitScoutViewer
        visible={modalVisible}
        setVisible={setModalVisible}
        data={chosenReport}
      />
    </View>
  );
};
