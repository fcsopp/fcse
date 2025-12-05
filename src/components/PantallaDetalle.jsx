import { useState } from "react";
import PopupObjetivo from "./PopupObjetivo";

export default function PantallaDetalle({
  temas,
  bolaActiva,
  contador,
  setContador,
  color,
  cambiarColor,
  cambiarContador,
  organizacion,
  objetivos,
  setObjetivos,
  progreso,
  setProgreso,
  setPantalla,
  addObjetivo
}) {
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [objetivoAEliminar, setObjetivoAEliminar] = useState(null);

  const claveTema = `${organizacion}-${bolaActiva}`;
  const comentariosTema = objetivos[claveTema] || [];

  const colorBola = progreso[claveTema]?.color || color;
  const contadorBola = progreso[claveTema]?.contador ?? contador;

  const actualizarProgreso = (nuevoColor, nuevoContador) => {
    const nuevosProgreso = {
      ...progreso,
      [claveTema]: {
        color: nuevoColor ?? colorBola,
        contador: nuevoContador ?? contadorBola
      }
    };
    setProgreso(nuevosProgreso);
  };

  const cambiarColorBola = (nuevoColor) => {
    let nuevoContador = contadorBola;
    if (nuevoColor === "#444") {
      // “Sin empezar” reinicia contador
      nuevoContador = 0;
      setContador(0);
    }
    actualizarProgreso(nuevoColor, nuevoContador);
    cambiarColor(nuevoColor);
  };

  const cambiarContadorBola = (delta) => {
    const nuevoContador = Math.max(0, contadorBola + delta);
    actualizarProgreso(colorBola, nuevoContador);
    setContador(nuevoContador);
    cambiarContador(delta);
  };

  const addObjetivoLocal = (nuevo) => {
    if (!nuevo.trim() || comentariosTema.length >= 10) return;
    const actualizados = {
      ...objetivos,
      [claveTema]: [...comentariosTema, nuevo.trim()]
    };
    setObjetivos(actualizados);
    addObjetivo(nuevo);
    setMostrarPopup(false); // <-- Oculta el popup al añadir un objetivo
  };

  const pedirEliminar = (idx) => {
    setObjetivoAEliminar(idx);
    setMostrarConfirmar(true);
  };

  const eliminarObjetivo = () => {
    const actualizados = {
      ...objetivos,
      [claveTema]: comentariosTema.filter((_, idx) => idx !== objetivoAEliminar)
    };
    setObjetivos(actualizados);
    setMostrarConfirmar(false);
    setObjetivoAEliminar(null);
  };

  const colores = [
    { color: "#1e8449", label: "Dominio absoluto!" },
    { color: "#58d68d", label: "Se defiende." },
    { color: "#f1c40f", label: "Más o menos me lo sé." },
    { color: "#8b4513", label: "Me lo he leído un par de veces." },
    { color: "#3498db", label: "Me lo quiero estudiar." },
    { color: "#444", label: "Sin empezar" }
  ];

  return (
    <div className="pantalla-detalle">
      <button
        className="volver"
        onClick={() => setPantalla("principal")}
        style={{ top: "10px", left: "10px", position: "fixed" }}
      >
        ←
      </button>

      <h2 className="titulo">{temas[bolaActiva]}</h2>

      <div
        className="bola-seleccionada"
        style={{
          backgroundColor: colorBola,
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          margin: "10px auto"
        }}
      >
        {bolaActiva}
      </div>

      <div className="contador-area">
        <button onClick={() => cambiarContadorBola(-1)}>−</button>
        <div className="contador-valor">{contadorBola}</div>
        <button onClick={() => cambiarContadorBola(1)}>+</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        {colores.map(({ color, label }) => (
          <button
            key={color}
            onClick={() => cambiarColorBola(color)}
            style={{
              backgroundColor: color,
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "5px 10px",
              cursor: "pointer"
            }}
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => setMostrarPopup(true)}
          disabled={comentariosTema.length >= 10}
          style={{
            backgroundColor: "#8B0000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "5px 10px",
            cursor: comentariosTema.length >= 10 ? "not-allowed" : "pointer",
            opacity: comentariosTema.length >= 10 ? 0.5 : 1,
            marginTop: "10px"
          }}
        >
          Objetivos
        </button>
      </div>

      {comentariosTema.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Objetivos:</h3>
          <ul>
            {comentariosTema.map((obj, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                {obj}
                <button
                  onClick={() => pedirEliminar(idx)}
                  style={{
                    backgroundColor: "#8B0000",
                    color: "#fff",
                    border: "1px solid #8B0000",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    cursor: "pointer"
                  }}
                >
                  -
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mostrarPopup && (
        <PopupObjetivo onClose={() => setMostrarPopup(false)} onAñadir={addObjetivoLocal} />
      )}

      {mostrarConfirmar && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            width: "90%",
            maxWidth: "400px",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#000" }}>¿Deseas eliminar este objetivo?</h3>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around" }}>
              <button onClick={() => setMostrarConfirmar(false)} style={{
                backgroundColor: "#ff4d4d",
                color: "#fff",
                border: "1px solid #ff4d4d",
                borderRadius: "4px",
                padding: "5px 15px",
                cursor: "pointer"
              }}>Cancelar</button>
              <button onClick={eliminarObjetivo} style={{
                backgroundColor: "#8B0000",
                color: "#fff",
                border: "1px solid #8B0000",
                borderRadius: "4px",
                padding: "5px 15px",
                cursor: "pointer"
              }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
