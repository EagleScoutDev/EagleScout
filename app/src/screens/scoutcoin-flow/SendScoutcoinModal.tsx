import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, TextInput, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {supabase} from '../../lib/supabase';
import StandardButton from '../../components/StandardButton';
import {ScoutcoinIcon} from '../../SVGIcons';
import {useProfile} from '../../lib/hooks/useProfile';

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
  const {profile} = useProfile();
  const {colors} = useTheme();

  const sendScoutcoin = async () => {
    if (!profile) {
      return;
    }
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
    if (parseInt(amount, 10) <= 0) {
      Alert.alert('Please enter a positive amount!');
      setSending(false);
      return;
    }
    if (parseInt(amount, 10) > profile.scoutcoins) {
      Alert.alert('You do not have enough scoutcoins!');
      setSending(false);
      return;
    }
    await supabase.functions.invoke('send-scoutcoin', {
      body: JSON.stringify({
        targetUserId: targetUser.id,
        amount: parseInt(amount, 10),
        description,
      }),
    });
    setSending(false);
    onClose();
  };

  const styles = StyleSheet.create({
    centeredView: {
      margin: 20,
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
      width: '100%',
    },
    coinContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    input: {
      width: '100%',
      margin: 12,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: colors.text,
      padding: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    mask: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      color: colors.text,
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}>
      <View style={styles.mask} />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Send Scoutcoin to {targetUser.name}
          </Text>
          <View style={styles.coinContainer}>
            <Text style={styles.text}>
              Your Scoutcoin: {profile?.scoutcoins}
            </Text>
            <ScoutcoinIcon width="12" height="12" fill={colors.text} />
          </View>
          <TextInput
            style={styles.input}
            selectionColor={colors.text}
            cursorColor={colors.text}
            placeholderTextColor={colors.text}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.input}
            selectionColor={colors.text}
            cursorColor={colors.text}
            placeholderTextColor={colors.text}
            placeholder="Reason"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.buttonContainer}>
            <StandardButton
              width="40%"
              text="Cancel"
              onPress={onClose}
              disabled={sending}
              color={colors.notification}
            />
            <StandardButton
              width="50%"
              text="Send"
              onPress={sendScoutcoin}
              disabled={sending}
              color={colors.primary}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
