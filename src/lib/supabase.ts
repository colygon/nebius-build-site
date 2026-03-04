import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function makeMissingSupabaseClient() {
  const missingConfigError = {
    message:
      "Supabase environment variables are missing (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Database features are unavailable in this environment.",
  };

  const result = { data: null, error: missingConfigError };

  const builder: any = {
    select: () => builder,
    insert: () => builder,
    upsert: () => builder,
    update: () => builder,
    delete: () => builder,
    order: () => builder,
    eq: () => builder,
    maybeSingle: () => builder,
    single: () => builder,
    then: (resolve: (value: unknown) => void, reject: (reason?: unknown) => void) => {
      Promise.resolve(result).then(resolve, reject);
    },
  };

  return {
    from: () => builder,
  } as any;
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : makeMissingSupabaseClient();
