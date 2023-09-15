import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from '@react-navigation/drawer';
import {Linking, View, Text, TouchableOpacity} from 'react-native';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useEffect, useState} from 'react';
import DBManager from './DBManager';

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
            <Svg width={'8%'} height="100%" viewBox="0 0 16 16">
              <Path
                fill={'grey'}
                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
              />
              <Path
                fill={'grey'}
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
              />
            </Svg>
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
          <Svg width={'8%'} height="100%" viewBox="0 0 16 16">
            <Path
              fill={'gray'}
              d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
            />
            <Path
              fill="gray"
              d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"
            />
          </Svg>
          <Text style={{color: 'gray', marginLeft: '4%', fontSize: 16}}>
            Feedback
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomDrawerContent;
