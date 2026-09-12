import { supabase } from "../lib/supabase";

export function formatLoginPhone(phone, countryCode) {
  const input = String(phone || "").trim();
  if (!/^[+\d\s().-]+$/.test(input)) throw new Error("auth.invalidPhone");
  const digits = input.replace(/\D/g, "");
  const fullPhone = input.startsWith("+") ? `+${digits}` : `${countryCode}${digits}`;
  if (!/^\+[1-9]\d{7,14}$/.test(fullPhone)) throw new Error("auth.invalidPhone");
  return fullPhone;
}

async function invokeOtp(name, body, fallback) {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error?.context?.status === 429) throw new Error("auth.tooManyAttempts");
  let payload = data;
  if (error?.context && typeof error.context.clone === "function") {
    try {
      payload = await error.context.clone().json();
    } catch {
      // Non-JSON responses use the normal OTP error below.
    }
  }
  if (name === "request-email-otp") {
    const details = [payload?.code, payload?.error_code, payload?.error, payload?.message,
      payload?.error?.code, payload?.error?.message, payload?.details,
      payload?.error?.details, typeof payload === "string" ? payload : null];
    const accountMissing = details.some((detail) => typeof detail === "string" &&
      /\b(?:user|account|email|phone|phone number|number)\b.{0,40}\b(?:not found|not registered|unregistered|does not exist|doesn't exist)\b|\bno (?:registered )?(?:user|account|email|phone)(?: address| number)? (?:found|exists)\b|\b(?:unregistered|not registered)\b.{0,40}\b(?:user|account|email|phone|number)\b/i
        .test(detail.replace(/[_-]/g, " ")));
    if (accountMissing) throw new Error("auth.accountNotRegistered");
  }
  if (error || !data || data.success === false || data.error) {
    throw new Error(fallback);
  }
  return data;
}

export async function requestEmailOtp(phone) {
  return invokeOtp("request-email-otp", { phone }, "auth.sendOtpError");
}

export async function verifyEmailOtp(phone, otp) {
  if (!/^\d{6}$/.test(otp)) throw new Error("auth.invalidOtp");
  const result = await invokeOtp("verify-email-otp", { phone, otp }, "auth.verifyOtpError");
  if (result.success !== true || result.verified !== true) {
    throw new Error("auth.verifyOtpError");
  }
  const tokens = result.session;
  const profile = result;
  const userId = Number(profile.user_id);
  if (!tokens?.access_token || !tokens?.refresh_token || !Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("auth.sessionError");
  }
  const { data, error } = await supabase.auth.setSession({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });
  if (error || !data?.session || !data.user?.id) throw new Error("auth.sessionError");
  if (profile.auth_user_id && profile.auth_user_id !== data.user.id) {
    await supabase.auth.signOut();
    throw new Error("auth.sessionError");
  }
  return {
    user_id: userId,
    auth_user_id: data.user.id,
    phone,
    language: profile.language,
    plan_id: profile.plan_id,
    default_currency: profile.default_currency,
  };
}
