import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ตรวจสอบให้แน่ใจว่าทั้งสองตัวแปรมีค่า
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL หรือ Anon Key หายไป");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
