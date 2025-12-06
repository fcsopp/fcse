import { useEffect } from "react";
import { supabase } from "../supabaseClient"; // Ajusta la ruta según tu proyecto

export default function useSyncSupabase(userId, progreso, objetivos) {

  useEffect(() => {
    if (!userId) return;

    const guardarDatos = async () => {
      try {
        // Primero intentar insertar, si ya existe, actualizar
        const { data, error } = await supabase
          .from("users_data")
          .upsert([
            {
              user_id: userId,
              progreso,
              objetivos
            }
          ], { onConflict: "user_id" }); // clave única user_id

        if (error) console.error("Error guardando en Supabase:", error);
      } catch (err) {
        console.error("Error inesperado al guardar en Supabase:", err);
      }
    };

    // Guardar antes de cerrar la ventana
    window.addEventListener("beforeunload", guardarDatos);

    return () => {
      window.removeEventListener("beforeunload", guardarDatos);
      // También guardar cuando el componente se desmonta
      guardarDatos();
    };
  }, [userId, progreso, objetivos]);
}
