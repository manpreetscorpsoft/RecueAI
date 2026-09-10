import { supabase } from "../lib/supabase";

/* =========================================================
   GET GROUP MEMBERS FOR LOGGED-IN GROUP ADMIN
========================================================= */

export async function getGroupMembers() {
  const { data, error } = await supabase.rpc("svc_get_my_group_members");


  if (error) {
    console.error("Get group members RPC error:");

    throw error;
  }

  if (!data || data.success !== true) {
    throw new Error(data?.message || "Unable to load group members");
  }

  return data;
}
