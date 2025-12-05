import { useState, useEffect } from "react";
import "./App.css";
import PantallaInicio from "./components/PantallaInicio";
import PantallaPrincipal from "./components/PantallaPrincipal";
import PantallaDetalle from "./components/PantallaDetalle";
import { useLocalStorage } from "./hooks/useLocalStorage"; 
import { getUserId } from "./usr/utils/user";

import { temasPoliciaNacional, temasGuardiaCivil, temasFuncionarioPrisiones } from "./temas";
import { useSyncUserData } from "./hooks/useSyncUserData";

export default function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [bolaActiva, setBolaActiva] = useState(null);
  const [color, setColor] = useState("#444");
  const [contador, setContador] = useState(0);
  const [usuarioId, setUsuarioId] = useState(null);

  const [organizacion, setOrganizacion] = useLocalStorage("organizacion", "");
  const [progreso, setProgreso] = useState({});
  const [objetivos, setObjetivos] = useState({});

  // Generar userId
  useEffect(() => {
    const id = getUserId();
    setUsuarioId(id);
  }, []);

  // Sincronizar datos con Supabase
  useSyncUserData(progreso, objetivos, setProgreso, setObjetivos, organizacion);

  const abrirBola = (num) => {
    const info = progreso[`${organizacion}-${num}`] || { color: "#444", contador: 0 };
    setBolaActiva(num);
    setColor(info.color);
    setContador(info.contador);
    setPantalla("detalle");
  };

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
          addObjetivo={(nuevo) => {
            const claveTema = `${organizacion}-${bolaActiva}`;
            const actualizados = {
              ...objetivos,
              [claveTema]: [...(objetivos[claveTema] || []), nuevo]
            };
            setObjetivos(actualizados);
          }}
        />
      )}
    </>
  );
}
