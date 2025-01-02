import React, {useMemo} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {Theme} from '@react-navigation/native/src/types';
import {useTheme} from '@react-navigation/native';

export const ShopModalBase = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => onClose()}>
      <View style={styles.mask} />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>{children}</View>
      </View>
    </Modal>
  );
};

const makeStyles = ({colors}: Theme) =>
  StyleSheet.create({
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
    mask: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });
