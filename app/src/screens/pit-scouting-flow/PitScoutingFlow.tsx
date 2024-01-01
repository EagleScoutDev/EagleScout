import {useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PitScoutingCamera from './PitScoutingCamera';

export default function PitScoutingFlow() {
  const [images, setImages] = useState<string[]>(['plus']);
  const [cameraOpen, setCameraOpen] = useState(false);
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.imageList}
        ItemSeparatorComponent={() => <View style={{width: 10}} />}
        data={images}
        renderItem={({item}) => {
          if (item === 'plus') {
            return (
              <Pressable onPress={() => setCameraOpen(true)}>
                <View style={styles.plusButton}>
                  <Text>+</Text>
                </View>
              </Pressable>
            );
          }
          return <Image source={{uri: item}} style={styles.image} />;
        }}
        keyExtractor={item => item}
        horizontal={true}
      />
      <Button title={'Submit'} onPress={() => {}} />
      {cameraOpen && (
        <Modal animationType="slide" visible={cameraOpen}>
          <PitScoutingCamera
            onPhotoTaken={photoData => {
              setImages(['plus', photoData, ...images.slice(1)]);
              setCameraOpen(false);
            }}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
  },
  image: {
    width: 200,
    height: 250,
  },
  plusButton: {
    width: 200,
    height: 250,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
