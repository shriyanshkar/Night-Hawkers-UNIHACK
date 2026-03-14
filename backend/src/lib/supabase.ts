import "dotenv/config";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY are required.");
}

const baseAuthConfig = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

export const supabaseAuth = createClient(supabaseUrl!, (supabaseAnonKey || supabaseServiceKey)!, baseAuthConfig);

export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl!, supabaseServiceKey, baseAuthConfig)
  : null;

export const createUserScopedClient = (accessToken: string) =>
  createClient(supabaseUrl!, (supabaseAnonKey || supabaseServiceKey)!, {
    ...baseAuthConfig,
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
