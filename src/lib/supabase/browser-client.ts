import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const createBrowserSupabaseClient = createClientComponentClient();

export default createBrowserSupabaseClient;
