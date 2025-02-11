import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';
import {SUPABASE_ANON_KEY, SUPABASE_URL} from '@env';
import {AppState} from 'react-native';

const supabaseUrl = 'https://ltbaymxtkftdtqyjjuoi.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0YmF5bXh0a2Z0ZHRxeWpqdW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2OTE5NDksImV4cCI6MjA1MTI2Nzk0OX0.dmJGiYmwxk-AOAOn1AXToR6pcB-jBADDavbkD4xC4OA';

console.log(
  'Supabase url:',
  SUPABASE_URL,
  'Supabase anon key:',
  SUPABASE_ANON_KEY,
);
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
