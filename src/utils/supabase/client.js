import { createClient } from "@supabase/supabase-js";

// Usando import.meta.env para Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para obtener el ID del usuario logueado
export async function getUserId() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    return null;
  }

  return user?.id || null;
}

// Función para actualizar datos de usuario
export async function updateUserData(userId, data) {
  const { error } = await supabase
    .from("usuarios") // nombre de tu tabla
    .upsert({ id: userId, ...data });

  if (error) console.error(error);
}
