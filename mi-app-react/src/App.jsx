import { useState, useEffect } from "react";
import "./App.css";
import PantallaInicio from "./components/PantallaInicio";
import PantallaPrincipal from "./components/PantallaPrincipal";
import PantallaDetalle from "./components/PantallaDetalle";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";

import { supabase } from "./supabaseClient"; 
import { temasPoliciaNacional, temasGuardiaCivil, temasFuncionarioPrisiones } from "./temas";

export default function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [bolaActiva, setBolaActiva] = useState(null);
  const [color, setColor] = useState("#444");
  const [contador, setContador] = useState(0);
  const [usuarioId, setUsuarioId] = useState(null);

  const [organizacion, setOrganizacion] = useLocalStorage("organizacion", "");
  const [progreso, setProgreso] = useLocalStorage("progreso", {});
  const [objetivos, setObjetivos] = useState({});

  // Inicializar usuario y sincronizar con Supabase
  useEffect(() => {
    let id = localStorage.getItem("usuarioId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("usuarioId", id);
    }
    setUsuarioId(id);

    if (!organizacion) return;

    const initUser = async () => {
      try {
        // Comprobar si el usuario existe en Supabase
        const { data: usuario, error } = await supabase
          .from("users_data")
          .select("*")
          .eq("user_id", id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error al consultar Supabase:", error);
          return;
        }

        if (usuario) {
          // Usuario encontrado en DB → cargar datos
          setProgreso(usuario.progreso || {});
          setObjetivos(usuario.objetivos || {});
        } else {
          // Usuario NO encontrado → leer localStorage y enviar a DB
          const progresoLocal = JSON.parse(localStorage.getItem("progreso") || "{}");
          const objetivosLocal = JSON.parse(localStorage.getItem(`objetivos-${organizacion}`) || "{}");

          await supabase
            .from("users_data")
            .insert([{
              user_id: id,
              progreso: progresoLocal,
              objetivos: objetivosLocal,
              organizacion
            }]);

          setProgreso(progresoLocal);
          setObjetivos(objetivosLocal);
          console.log("✅ Datos locales sincronizados a Supabase");
        }
      } catch (err) {
        console.error("❌ Error al inicializar usuario:", err);
        const progresoLocal = JSON.parse(localStorage.getItem("progreso") || "{}");
        const objetivosLocal = JSON.parse(localStorage.getItem(`objetivos-${organizacion}`) || "{}");
        setProgreso(progresoLocal);
        setObjetivos(objetivosLocal);
      }
    };

    initUser();
  }, [organizacion]);

  // Guardar datos del usuario en Supabase
  const guardarDatosUsuario = async () => {
    if (!usuarioId || !organizacion) return;

    try {
      await supabase
        .from("users_data")
        .upsert([{
          user_id: usuarioId,
          progreso,
          objetivos,
          organizacion
        }], { onConflict: "user_id" });
      console.log("✅ Datos guardados en Supabase");
    } catch (error) {
      console.error("❌ Error al guardar datos en Supabase:", error);
    }
  };

  // Guardar automáticamente al cerrar o recargar la página
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      guardarDatosUsuario();
      // Opcional: mensaje de alerta al usuario
      // e.preventDefault();
      // e.returnValue = '';
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [usuarioId, organizacion, progreso, objetivos]);

  // Abrir una bola en detalle
  const abrirBola = (num) => {
    const info = progreso[`${organizacion}-${num}`] || { color: "#444", contador: 0 };
    setBolaActiva(num);
    setColor(info.color);
    setContador(info.contador);
    setPantalla("detalle");
  };

  // Selección de temas
  let temas;
  if (organizacion === "Policía Nacional") temas = temasPoliciaNacional;
  else if (organizacion === "Guardia Civil") temas = temasGuardiaCivil;
  else if (organizacion === "Funcionario de prisiones") temas = temasFuncionarioPrisiones;
  else temas = {};

  return (
    <>
      {pantalla === "inicio" && (
        <PantallaInicio setPantalla={setPantalla} setOrganizacion={setOrganizacion} />
      )}
      {pantalla === "principal" && (
        <PantallaPrincipal
          temas={temas}
          progreso={progreso}
          abrirBola={abrirBola}
          setPantalla={setPantalla}
          organizacion={organizacion}
        />
      )}
      {pantalla === "detalle" && (
        <PantallaDetalle
          temas={temas}
          bolaActiva={bolaActiva}
          color={color}
          contador={contador}
          setContador={setContador}
          cambiarColor={setColor}
          cambiarContador={setContador}
          organizacion={organizacion}
          objetivos={objetivos}
          setObjetivos={setObjetivos}
          progreso={progreso}
          setProgreso={setProgreso}
          setPantalla={setPantalla}
          usuarioId={usuarioId} // <-- importante para sincronización
        />
      )}
    </>
  );
}
