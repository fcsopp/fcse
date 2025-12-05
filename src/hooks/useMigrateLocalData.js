import { useEffect } from "react";
import { supabase } from "../utils/supabase/client";

export function useMigrateLocalData(usuarioId) {
  useEffect(() => {
    if (!usuarioId) return;

    const migrate = async () => {
      // Leer datos locales
      const localProgreso = JSON.parse(localStorage.getItem("progreso") || "{}");
      const localObjetivos = JSON.parse(localStorage.getItem("objetivos") || "{}");

      // Si no hay nada, salir
      if (Object.keys(localProgreso).length === 0 && Object.keys(localObjetivos).length === 0) return;

      // Insertar o actualizar en Supabase
      const { error } = await supabase
        .from("users_data")
        .upsert(
          {
            user_id: usuarioId,
            progreso: localProgreso,
            objetivos: localObjetivos,
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("Error migrando datos:", error);
      } else {
        console.log("Datos migrados correctamente a Supabase:", { localProgreso, localObjetivos });
        // Borrar datos locales después de migrar
        localStorage.removeItem("progreso");
        localStorage.removeItem("objetivos");
      }
    };

    migrate();
  }, [usuarioId]);
}
