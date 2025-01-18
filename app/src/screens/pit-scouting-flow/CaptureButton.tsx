import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';

export default function CaptureButton({
  onPress,
  loading,
}: {
  onPress: () => void;
  loading: boolean;
}) {
  return (
    <Pressable
      style={[
        {
          borderColor: loading ? 'transparent' : 'white',
        },
        styles.captureButton,
      ]}
      onPress={onPress}>
      <ActivityIndicator
        animating={loading}
        style={StyleSheet.absoluteFill}
        size="large"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 10,
    zIndex: 1,
  },
});
