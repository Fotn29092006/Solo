import { createClient } from "@supabase/supabase-js";
import { clientEnv, hasSupabasePublicConfig } from "@/config/env";
import type { Database } from "@/shared/types/database";

export function createBrowserSupabaseClient() {
  if (!hasSupabasePublicConfig()) {
    return null;
  }

  return createClient<Database>(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
}

export const supabaseBrowserClient = createBrowserSupabaseClient();
