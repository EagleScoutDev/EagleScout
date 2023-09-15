import React, {Text} from 'react-native';

function MinimalSectionHeader(props) {
  return (
    <Text
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        color: 'gray',
        fontWeight: 'bold',
        fontSize: 12,
        paddingLeft: '2%',
        paddingTop: '2%',
      }}>
      {props.title.toUpperCase()}
    </Text>
  );
}

export default MinimalSectionHeader;
