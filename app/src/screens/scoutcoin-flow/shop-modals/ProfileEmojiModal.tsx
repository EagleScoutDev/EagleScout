import React from 'react';
import {ShopModalBase} from './ShopModalBase';
import {Text} from 'react-native';

export const ProfileEmojiModal = ({onClose}: {onClose: () => void}) => {
  console.log('ProfileEmojiModal');
  return (
    <ShopModalBase onClose={onClose}>
      <Text>Hello</Text>
    </ShopModalBase>
  );
};
