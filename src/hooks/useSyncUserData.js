import { useEffect } from "react";
import { getUserId } from "../usr/utils/user"; // Correcto si useSyncUserData.js está en src/hooks/


export function useSyncUserData(progreso, objetivos, setProgreso, setObjetivos, organizacion) {
  useEffect(() => {
    if (!organizacion) return;

    const usuarioId = getUserId();

    const syncData = async () => {
      const supabase = await createClient();

      // 1️⃣ Intentar cargar datos de Supabase
      const { data, error } = await supabase
        .from("users_data")
        .select("*")
        .eq("user_id", usuarioId)
        .single();

      if (error) {
        console.error("Error al cargar datos de Supabase:", error.message);
        return;
      }

      // 2️⃣ Si hay datos en Supabase, los usamos
      if (data) {
        if (data.progreso) setProgreso(data.progreso);
        if (data.objetivos) setObjetivos(data.objetivos);
      } else {
        // 3️⃣ Si no hay datos en Supabase, migramos desde localStorage
        const storedProgreso = JSON.parse(localStorage.getItem("progreso") || "{}");
        const storedObjetivos = JSON.parse(localStorage.getItem("objetivos") || "{}");

        setProgreso(storedProgreso);
        setObjetivos(storedObjetivos);

        // Guardar datos en Supabase para futuras sesiones
        const { error: insertError } = await supabase
          .from("users_data")
          .insert([
            {
              user_id: usuarioId,
              progreso: storedProgreso,
              objetivos: storedObjetivos,
            },
          ]);

        if (insertError) console.error("Error al migrar datos a Supabase:", insertError.message);
      }
    };

    syncData();
  }, [organizacion]);

  // 4️⃣ Guardar automáticamente en Supabase cuando cambie progreso u objetivos
  useEffect(() => {
    if (!organizacion) return;

    const usuarioId = getUserId();

    const saveData = async () => {
      const supabase = await createClient();
      const { error } = await supabase
        .from("users_data")
        .upsert(
          {
            user_id: usuarioId,
            progreso,
            objetivos,
          },
          { onConflict: "user_id" }
        );

      if (error) console.error("Error al guardar datos en Supabase:", error.message);
    };

    saveData();
  }, [progreso, objetivos, organizacion]);
}
