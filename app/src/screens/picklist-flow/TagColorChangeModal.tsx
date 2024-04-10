import React, {useEffect} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import ColorPicker, {HueSlider} from 'reanimated-color-picker';
import {useTheme} from '@react-navigation/native';
import {TagsDB, TagStructure} from '../../database/Tags';
const TagColorChangeModal = ({
  visible,
  setVisible,
  tag,
}: {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  tag: TagStructure | undefined;
}) => {
  const {colors} = useTheme();
  const [color, setColor] = React.useState(tag?.color ?? '#FF0000');

  useEffect(() => {
    setColor(tag?.color ?? '#FF0000');
  }, [visible, tag]);

  useEffect(() => {
    if (tag !== undefined && color !== tag.color) {
      TagsDB.updateColorOfTag(tag.id!, color!).then(r => {
        console.log('finished updating color of tag');
      });
    }
  }, [color]);

  const onChangeColor = ({hex}) => {
    setColor(hex);
  };

  const getIdealTextColor = (bgColor: string) => {
    const nThreshold = 105;
    const components = {
      R: parseInt(bgColor.substring(1, 3), 16),
      G: parseInt(bgColor.substring(3, 5), 16),
      B: parseInt(bgColor.substring(5, 7), 16),
    };
    const bgDelta =
      components.R * 0.299 + components.G * 0.587 + components.B * 0.114;
    return 255 - bgDelta < nThreshold ? '#000000' : '#ffffff';
  };

  return (
    <Modal visible={visible} transparent={true} animationType={'fade'}>
      <Pressable
        onPress={() => setVisible(false)}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            backgroundColor: colors.card,
            padding: '5%',
            margin: '5%',
            marginVertical: '20%',
            borderRadius: 10,
          }}>
          <View
            style={{
              backgroundColor: color,
              paddingHorizontal: '4%',
              paddingVertical: '2%',
              margin: '20%',
              borderRadius: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderWidth: 2,
              borderColor: color,
            }}>
            <Text
              style={{
                color: getIdealTextColor(color ?? ''),
              }}>
              {tag?.name}
            </Text>
          </View>
          <ColorPicker
            onChange={onChangeColor}
            value={color}
            onComplete={() => setVisible(false)}>
            <HueSlider />
          </ColorPicker>
        </View>
      </Pressable>
    </Modal>
  );
};

export default TagColorChangeModal;
