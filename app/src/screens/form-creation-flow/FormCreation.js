import React from 'react';
import FormCreationMain from './FormCreationMain';
import {createStackNavigator} from '@react-navigation/stack';
import FormList from './FormList';

const Stack = createStackNavigator();

function FormCreation() {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          component={FormList}
          options={{
            headerShown: false,
          }}
          name={'Form List'}
        />
        <Stack.Screen
          component={FormCreationMain}
          options={{
            headerShown: false,
          }}
          name={'Form Creation Main'}
        />
      </Stack.Navigator>
    </>
  );
}

export default FormCreation;
