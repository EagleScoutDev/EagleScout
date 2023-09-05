/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { supabase } from './src/lib/supabase';

(async () => {
  const { error } = await supabase.auth.signUp({
    email: "example99@team114.org",
    password: "password"
  });
  
  console.log(error);
})();

AppRegistry.registerComponent(appName, () => App);
