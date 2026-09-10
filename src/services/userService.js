import { supabase } from "../lib/supabase";

export async function getUserFullDetails(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase.rpc(
    "svc_get_user_full_details",
    {
      p_user_id: userId,
    }
  );

  if (error) {
    console.error("Get user full details error:");

    throw error;
  }


  return data;
}