import { supabase } from './supabase';

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('Data:', data);
    }
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
  }
}

testConnection(); 