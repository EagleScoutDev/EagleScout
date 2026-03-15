import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

const AllianceSummaryCard = ({
  form,
  data,
  teams,
}: {
  form: any;
  data: number[][];
  teams: number[];
}) => {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    container: {
      width: '95%',
      paddingHorizontal: 30,
      paddingVertical: 20,
      height: 'auto',
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      color: colors.text,
      marginBottom: 20,
      alignSelf: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      paddingBottom: 4,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: colors.border,
      borderTopWidth: 1,
      // borderBottomWidth: ,
    },
    column: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: colors.border,
      borderLeftWidth: 1,
      // borderBottomWidth: ,
    },
    text: {
      fontSize: 20,
      textAlign: 'center',
      color: colors.text,
    },
    entry: {
      height: 40,
      width: 60,
      paddingHorizontal: 3,
      justifyContent: 'center',
    },
  });
  useEffect(() => {
    console.log('card');
    console.log(form);
    console.log(data);
  });
  if (form.type === 'heading') {
    return (
      <View
        key={form.key}
        style={{
          width: '95%',
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 7,
          height: 'auto',
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            paddingBottom: 4,
          }}>
          {form.title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'left',
            color: colors.primary,
          }}>
          {form.description}
        </Text>
      </View>
    );
  } else if (form.type === 'number') {
    return (
      // <View style={{height: 'auto', width:'20%', backgroundColor: 'red'}}><Text>AMONGUS</Text></View>
      <View style={styles.container}>
        <Text style={styles.title}>{form.question}</Text>
        <View style={{flexDirection: 'column', marginTop: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={styles.entry}>
              <Text
                style={{
                  color: colors.primary,
                  textAlign: 'left',
                  fontSize: 16,
                }}>
                TEAM
              </Text>
            </View>
            <View style={styles.entry}>
              <Text
                style={{
                  color: colors.primary,
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                MAX
              </Text>
            </View>
            <View style={styles.entry}>
              <Text
                style={{
                  color: colors.primary,
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                AVG
              </Text>
            </View>
            <View style={styles.entry}>
              <Text
                style={{
                  color: colors.primary,
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                MIN
              </Text>
            </View>
          </View>
          {teams.map((team, index) => {
            return (
              <View style={[styles.row, {paddingVertical: 2}]}>
                <View style={styles.entry}>
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: 'left',
                      color: colors.text,
                    }}>
                    {team}
                  </Text>
                </View>
                {data[index].map((datum, key) => {
                    console.log(datum, Number.isNaN(datum));
                    return (
                    <View style={styles.entry} key={key}>
                      <Text style={styles.text}>{Number.isFinite(datum) ? datum.toFixed(2) : "-"}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
          <View style={[styles.row, {borderTopWidth: 3}]}>
            <View style={styles.entry}>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 18,
                  color: colors.primary,
                    paddingTop:10
                }}>
                TOTAL:
              </Text>
            </View>
            {[0, 1, 2].map(index => {
                let x = (
                    data
                        .map(datum => datum[index])
                        .reduce((a, b) => a + b, 0) / 3
                ).toFixed(2)
              return (
                <View style={styles.entry}>
                  <Text style={styles.text}>
                      {Number.isFinite(x) ? x : "-"}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  } else if (form.type === 'radio' || form.type === 'checkboxes') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{form.question}</Text>
        <View style={{flexDirection: 'column', marginTop: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderColor: colors.border,
              borderBottomWidth: 1,
            }}>
            {teams.map(team => {
              return (
                <View style={styles.entry}>
                  <Text
                    style={{
                      fontSize: 22,
                      textAlign: 'center',
                      color: colors.primary,
                    }}>
                    {team}
                  </Text>
                </View>
              );
            })}
          </View>
          {form.options.map((option: string, index: number) => {
            return (
              <View
                style={{
                  borderColor: colors.border,
                  borderTopWidth: 1,
                  paddingTop: 10,
                  paddingBottom: 5,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.text,
                    paddingBottom: 4,
                  }}>
                  {option}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  {data.map(datum => {
                    return (
                      <View style={styles.entry}>
                        <Text style={styles.text}>
                            {Number.isFinite(datum[index]) ? datum[index].toFixed(2)+"%" : "-"}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  } else {
    return (
      <View />
      // <View>
      //   <Text style={{color: 'blue'}}>WIP (categorical data stuff)</Text>
      // </View>
    );
  }
};
export default AllianceSummaryCard;
