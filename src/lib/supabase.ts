import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ltbaymxtkftdtqyjjuoi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0YmF5bXh0a2Z0ZHRxeWpqdW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5MzYyNjMsImV4cCI6MjAwOTUxMjI2M30.sD-uRVwP_X-MWl9R6uPSRxRocNR7SHsRGZ-Sj5bqcKQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})