// js/captcha.js
import supabase from "./api.js";

export async function verifyCaptcha(token) {
  const { data, error } = await supabase.functions.invoke(
    "verify-captcha",
    {
      body: { token }
    }
  );

  if (error) throw error;

  return data.success;
}