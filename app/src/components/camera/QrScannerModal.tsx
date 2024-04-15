import {useEffect} from 'react';
import {Text} from 'react-native-svg';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {Modal, StyleSheet} from 'react-native';

export const QrScannerModal = ({
  onCodeScanned,
}: {
  onCodeScanned: (codes: Code[]) => void;
}) => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned,
  });
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);
  if (!device || !codeScanner) {
    return null;
  }
  if (!hasPermission) {
    return <Text>Requesting camera permission...</Text>;
  }
  return (
    <Modal visible={true}>
      <Camera
        style={StyleSheet.absoluteFill}
        codeScanner={codeScanner}
        device={device}
        isActive={true}
      />
    </Modal>
  );
};
