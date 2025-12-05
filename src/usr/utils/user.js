import { supabase } from "../../utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

export async function getUserId() {
  // 1️⃣ Intentar obtener el ID de Supabase Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id) return user.id;

  // 2️⃣ Si no hay usuario logueado, usar el ID antiguo de localStorage
  let userId = localStorage.getItem("usuarioId");
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("usuarioId", userId);
  }
  return userId;
}
