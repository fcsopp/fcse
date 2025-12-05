import { useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { getUserId } from "../usr/utils/user";

export function useMigrateLocalData(usuarioId) {
  useEffect(() => {
    if (!usuarioId) return;

    const migrate = async () => {
      // Leer datos locales
      const localProgreso = JSON.parse(localStorage.getItem("progreso") || "{}");
      const localObjetivos = JSON.parse(localStorage.getItem("objetivos") || "{}");
      const organizacion = localStorage.getItem("organizacion") || "";

      const registros = Object.keys(localProgreso).map((clave) => ({
        id: `${usuarioId}-${clave}`,
        usuario_id: usuarioId,
        organizacion,
        clave,
        color: localProgreso[clave].color || "#444",
        contador: localProgreso[clave].contador || 0,
        objetivos: localObjetivos[clave] || [],
      }));

      if (registros.length === 0) return;

      // Insertar o actualizar en Supabase
      for (const registro of registros) {
        const { error } = await supabase
          .from("users_data")
          .upsert(registro, { onConflict: ["id"] });
        if (error) console.error("Error migrando datos:", error);
      }

      // Borrar datos locales después de migrar
      localStorage.removeItem("progreso");
      localStorage.removeItem("objetivos");
    };

    migrate();
  }, [usuarioId]);
}
