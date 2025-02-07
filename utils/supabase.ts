import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const testSupabaseConnection = async () => {
  const { data, error } = await supabase.from('your_table').select('*').limit(1);

  if (error) {
    console.error('Error connecting to Supabase:', error);
    return { success: false, message: error.message };
  }

  return { success: true, data };
};

testSupabaseConnection().then((result) => {
  if (result.success) {
    console.log('Supabase connection successful:', result.data);
  } else {
    console.log('Supabase connection failed:', result.message);
  }
});
