import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const SupabaseServerClient = createServerComponentClient({
	cookies,
});

export default SupabaseServerClient;
