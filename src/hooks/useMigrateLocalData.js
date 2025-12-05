import { useEffect } from "react";
import { supabase } from "../utils/supabase/client";

export function useMigrateLocalData(usuarioId) {
  useEffect(() => {
    if (!usuarioId) return;

    const migrate = async () => {
      const localProgreso = JSON.parse(localStorage.getItem("progreso") || "{}");
      const localObjetivos = JSON.parse(localStorage.getItem("objetivos") || "{}");

      if (!Object.keys(localProgreso).length && !Object.keys(localObjetivos).length) return;

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

      if (error) console.error("Error migrando datos:", error);
      else {
        console.log("Datos migrados a Supabase correctamente.");
        // Borrar datos locales después de migrar
        localStorage.removeItem("progreso");
        localStorage.removeItem("objetivos");
      }
    };

    migrate();
  }, [usuarioId]);
}
