import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CaretRight} from '../SVGIcons';
import React from 'react';
import {useTheme} from '@react-navigation/native';

interface ListItemProps {
  text: string;
  onPress: () => void;
  caretVisible: boolean;
  disabled: boolean;
  icon: () => React.ReactNode;
}

const ListItem = ({
  text,
  onPress,
  caretVisible = true,
  disabled = false,
  icon = () => null,
}: ListItemProps) => {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    list_item_text: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    disabled_list_item_text: {
      fontSize: 15,
      fontWeight: '600',
      color: 'gray',
    },
    list_item: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      backgroundColor: colors.card,
      padding: '4%',
    },
    icon_styling: {
      paddingRight: '4%',
    },
  });
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={styles.list_item}>
      {icon && <View style={styles.icon_styling}>{icon()}</View>}
      <Text
        style={
          disabled ? styles.disabled_list_item_text : styles.list_item_text
        }>
        {text}
      </Text>
      {caretVisible && CaretRight()}
    </TouchableOpacity>
  );
};

export default ListItem;
