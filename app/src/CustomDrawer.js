import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from '@react-navigation/drawer';
import {Linking, View, Text, TouchableOpacity} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import DBManager from './DBManager';
import {PencilNotepad, QuestionMarkCircle} from './SVGIcons';

function CustomDrawerContent(props) {
  const [pitScoutURL, setPitScoutURL] = useState(null);

  useEffect(() => {
    DBManager.getCompetitionFromDatabase().then(r => {
      //setPitScoutURL(r.pitscoutingform);
      // TODO
      setPitScoutURL('');
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/*{admin !== '0' && admin !== false && (*/}
        {/*  <Drawe rItem*/}
        {/*    label={'User Management'}*/}
        {/*    focused={*/}
        {/*      props.state.routeNames[props.state.index] === 'User Management'*/}
        {/*    }*/}
        {/*    onPress={() => props.navigation.navigate('User Management')}*/}
        {/*    icon={() => (*/}
        {/*      <Svg width={'8%'} height="100%" viewBox="0 0 16 16">*/}
        {/*        <Path*/}
        {/*          fill="gray"*/}
        {/*          d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"*/}
        {/*        />*/}
        {/*      </Svg>*/}
        {/*    )}*/}
        {/*  />*/}
        {/*)}*/}
        {/*<DrawerItem*/}
        {/*  label={'Settings'}*/}
        {/*  onPress={() => props.navigation.navigate('Settings')}*/}
        {/*  icon={() => (*/}
        {/*    <Svg width={'8%'} height="100%" viewBox="0 0 16 16">*/}
        {/*      <Path*/}
        {/*        fill={'gray'}*/}
        {/*        d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z"*/}
        {/*      />*/}
        {/*    </Svg>*/}
        {/*  )}*/}
        {/*/>*/}
      </DrawerContentScrollView>
      <View
        style={{
          paddingBottom: '15%',
          borderTopWidth: 1,
          borderColor: 'gray',
          // backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8%',
        }}>
        {pitScoutURL && (
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(pitScoutURL);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '10%',
            }}>
            <PencilNotepad />
            <Text
              style={{
                color: 'gray',
                fontSize: 16,
                marginLeft: '4%',
              }}>
              Pit Scouting
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://forms.gle/3uUBSLKgvicrYAQt8');
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <QuestionMarkCircle />
          <Text style={{color: 'gray', marginLeft: '4%', fontSize: 16}}>
            Feedback
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomDrawerContent;
