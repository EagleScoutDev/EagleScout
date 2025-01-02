import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ProfileEmojiModal} from './shop-modals/ProfileEmojiModal';
import Svg, {Path, SvgProps} from 'react-native-svg';
import {Theme} from '@react-navigation/native/src/types';
import {useTheme} from '@react-navigation/native';
import {ScoutcoinIcon} from '../../SVGIcons';
import {ConfirmPurchaseModal} from './ConfirmPurchaseModal';
import {AppThemeModal} from './shop-modals/AppThemeModal';

type ModalProps = {
  onClose: () => void;
};

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.FC<SvgProps>;
  modal: React.FC<ModalProps>;
}

const shopItems = {
  'emoji-change': {
    id: 'emoji-change',
    name: 'Profile Emoji',
    description: 'Change your profile emoji!',
    cost: 5,
    icon: (props: SvgProps) => (
      <Svg viewBox="0 0 16 16" {...props}>
        <Path d="M12 1a1 1 0 0 1 1 1v10.755S12 11 8 11s-5 1.755-5 1.755V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
        <Path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
      </Svg>
    ),
    modal: ({onClose}: ModalProps) => <ProfileEmojiModal onClose={onClose} />,
  },
  'theme-change': {
    id: 'theme-change',
    name: 'App Theme',
    description: "Change the app theme! Who doesn't like a nice forest color?",
    cost: 8,
    icon: (props: SvgProps) => (
      <Svg viewBox="0 0 16 16" {...props}>
        <Path d="M6.192 2.78c-.458-.677-.927-1.248-1.35-1.643a3 3 0 0 0-.71-.515c-.217-.104-.56-.205-.882-.02-.367.213-.427.63-.43.896-.003.304.064.664.173 1.044.196.687.556 1.528 1.035 2.402L.752 8.22c-.277.277-.269.656-.218.918.055.283.187.593.36.903.348.627.92 1.361 1.626 2.068.707.707 1.441 1.278 2.068 1.626.31.173.62.305.903.36.262.05.64.059.918-.218l5.615-5.615c.118.257.092.512.05.939-.03.292-.068.665-.073 1.176v.123h.003a1 1 0 0 0 1.993 0H14v-.057a1 1 0 0 0-.004-.117c-.055-1.25-.7-2.738-1.86-3.494a4 4 0 0 0-.211-.434c-.349-.626-.92-1.36-1.627-2.067S8.857 3.052 8.23 2.704c-.31-.172-.62-.304-.903-.36-.262-.05-.64-.058-.918.219zM4.16 1.867c.381.356.844.922 1.311 1.632l-.704.705c-.382-.727-.66-1.402-.813-1.938a3.3 3.3 0 0 1-.131-.673q.137.09.337.274m.394 3.965c.54.852 1.107 1.567 1.607 2.033a.5.5 0 1 0 .682-.732c-.453-.422-1.017-1.136-1.564-2.027l1.088-1.088q.081.181.183.365c.349.627.92 1.361 1.627 2.068.706.707 1.44 1.278 2.068 1.626q.183.103.365.183l-4.861 4.862-.068-.01c-.137-.027-.342-.104-.608-.252-.524-.292-1.186-.8-1.846-1.46s-1.168-1.32-1.46-1.846c-.147-.265-.225-.47-.251-.607l-.01-.068zm2.87-1.935a2.4 2.4 0 0 1-.241-.561c.135.033.324.11.562.241.524.292 1.186.8 1.846 1.46.45.45.83.901 1.118 1.31a3.5 3.5 0 0 0-1.066.091 11 11 0 0 1-.76-.694c-.66-.66-1.167-1.322-1.458-1.847z" />
      </Svg>
    ),
    modal: ({onClose}: ModalProps) => <AppThemeModal onClose={onClose} />,
  },
  'icon-change': {
    id: 'icon-change',
    name: 'App Icon',
    description: 'Change the app icon!',
    cost: 20,
    icon: (props: SvgProps) => (
      <Svg viewBox="0 0 16 16" {...props}>
        <Path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
        <Path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
      </Svg>
    ),
    modal: ({onClose}: ModalProps) => <ProfileEmojiModal onClose={onClose} />,
  },
} as Record<string, ShopItem>;

export const ScoutcoinShop = () => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [activeItem, setActiveItem] = useState<ShopItem | null>(null);
  const [confirmPurchaseModalVisible, setConfirmPurchaseModalVisible] =
    useState(false);
  const [itemSpecificModalVisible, setItemSpecificModalVisible] =
    useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Items</Text>
      <View style={styles.itemsContainer}>
        {Object.entries(shopItems).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={styles.itemContainer}
            onPress={() => {
              setActiveItem(value);
              setConfirmPurchaseModalVisible(true);
            }}>
            <value.icon width={50} height={50} fill={theme.colors.text} />
            <Text style={styles.itemNameText}>{value.name}</Text>
            <View style={styles.coinContainer}>
              <Text style={styles.costText}>{value.cost}</Text>
              <ScoutcoinIcon width="12" height="12" fill={theme.colors.text} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {confirmPurchaseModalVisible && activeItem && (
        <ConfirmPurchaseModal
          item={activeItem}
          onClose={purchased => {
            setConfirmPurchaseModalVisible(false);
            if (purchased) {
              setItemSpecificModalVisible(true);
            } else {
              setActiveItem(null);
            }
          }}
        />
      )}
      {itemSpecificModalVisible && activeItem && (
        <activeItem.modal
          onClose={() => {
            setItemSpecificModalVisible(false);
          }}
        />
      )}
    </View>
  );
};

const makeStyles = ({colors}: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    heading: {
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: colors.text,
    },
    itemsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
    },
    itemContainer: {
      width: '30%',
      marginBottom: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.card,
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 20,
    },
    itemNameText: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.text,
    },
    coinContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    costText: {
      color: colors.text,
    },
  });
