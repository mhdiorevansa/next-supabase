import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const createServerSupabaseClient = createServerComponentClient({
	cookies,
});

export default createServerSupabaseClient;
