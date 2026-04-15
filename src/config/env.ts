export const clientEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
};

export function hasSupabasePublicConfig() {
  return Boolean(clientEnv.supabaseUrl && clientEnv.supabaseAnonKey);
}
