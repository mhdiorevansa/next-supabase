import { createClient } from "@supabase/supabase-js";

const Supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

export default Supabase;
