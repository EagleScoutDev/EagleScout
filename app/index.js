/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';
import App from './src/App';
import {supabase} from './src/lib/supabase';

(async () => {
  /*const { error } = await supabase.auth.signInWithPassword({
    email: "dev@team114.org",
    password: "password"
  });
  console.log(error);*/
  //const start = new Date();
  //const end = new Date();
  //const res = await supabase.from('competitions').insert({ start_time: start, end_time: end, name: "idaho" });
  //const res = await supabase.rpc('get_user_profiles_with_email');
  //console.log(res);
  //const { data, error } = await supabase.from('scout_reports').select('*');
  //console.log('scoutdata: ' + JSON.stringify(data));
  //const date = new Date(data[0].created_at);
  //console.log(date.toString());
  //await supabase.auth.signOut();
  //const { data: { user } } = await supabase.auth.getUser()
  //console.log(user);
  //const { data: { user } } = await supabase.auth.getUser();
  //console.log(user);
  //console.log(user.id);
  //const data = await supabase.rpc('register_user_with_organization', {organization_number: 114});
  //console.log(data);
  //const res = await supabase.from('profiles').update({lastname: 'Szita'}).eq('id', user.identities[0].id);
  //console.log(res);
  //const { data, error } = await supabase.from('user_attributes').select('organization_id, admin').eq('id', user.id);
  //console.log(data);
  //console.log(data);
  //console.log(error);
})();

AppRegistry.registerComponent(appName, () => App);
