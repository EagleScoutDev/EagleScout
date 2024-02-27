import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {CaretRight} from '../SVGIcons';
import React from 'react';
import {useTheme} from '@react-navigation/native';

interface ListItemProps {
  text: string;
  onPress: () => void;
  caretVisible: boolean;
  disabled: boolean;
}

const ListItem = ({
  text,
  onPress,
  caretVisible = true,
  disabled = false,
}: ListItemProps) => {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    list_item: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      backgroundColor: colors.card,
      padding: 15,
    },
    disabled_list_item: {
      fontSize: 15,
      fontWeight: '600',
      color: 'gray',
      backgroundColor: colors.card,
      padding: 15,
    },
  });
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
      <Text style={disabled ? styles.disabled_list_item : styles.list_item}>
        {text}
      </Text>
      {caretVisible && CaretRight()}
    </TouchableOpacity>
  );
};

export default ListItem;
