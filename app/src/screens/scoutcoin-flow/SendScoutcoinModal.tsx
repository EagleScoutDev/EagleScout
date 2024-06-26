import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import ProfilesDB from '../../database/Profiles';
import {supabase} from '../../lib/supabase';

interface LeaderboardUser {
  id: string;
  name: string;
  scoutcoins: number;
}

export const SendScoutcoinModal = ({
  targetUser,
  onClose,
}: {
  targetUser: LeaderboardUser;
  onClose: () => void;
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [currentScoutcoins, setCurrentScoutcoins] = useState<number>(0);
  const {colors} = useTheme();

  useEffect(() => {
    ProfilesDB.getCurrentUserProfile().then(profile => {
      setCurrentScoutcoins(profile.scoutcoins);
    });
  }, []);

  const sendScoutcoin = async () => {
    setSending(true);
    if (description === '') {
      Alert.alert('Please enter a reason!');
      setSending(false);
      return;
    }
    if (amount === '') {
      Alert.alert('Please enter an amount!');
      setSending(false);
      return;
    }
    if (parseInt(amount) <= 0) {
      Alert.alert('Please enter a positive amount!');
      setSending(false);
      return;
    }
    if (parseInt(amount) > currentScoutcoins) {
      Alert.alert('You do not have enough scoutcoins!');
      setSending(false);
      return;
    }
    await supabase.functions.invoke('send-scoutcoin', {
      body: JSON.stringify({
        targetUserId: targetUser.id,
        amount: parseInt(amount),
        description,
      }),
    });
    setSending(false);
    onClose();
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
    },
    input: {
      height: 40,
      width: 200,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Send Scoutcoin to {targetUser.name}
          </Text>
          <Text>Current Scoutcoins: {currentScoutcoins}</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Reason"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Send"
              onPress={sendScoutcoin}
              disabled={sending}
              color={colors.primary}
            />
            <Button
              title="Cancel"
              onPress={onClose}
              disabled={sending}
              color={colors.notification}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
