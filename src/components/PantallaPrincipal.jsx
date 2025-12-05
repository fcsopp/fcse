import { useState, useEffect, useRef } from "react";

export default function PantallaPrincipal({ temas, progreso, abrirBola, setPantalla, organizacion }) {
  let encabezado = "";
  let colorEncabezado = "#000";

  if (organizacion === "Policía Nacional") {
    encabezado = "CUERPO NACIONAL DE POLICÍA";
    colorEncabezado = "#3498db";
  } else if (organizacion === "Guardia Civil") {
    encabezado = "GUARDIA CIVIL";
    colorEncabezado = "#28a745";
  } else if (organizacion === "Funcionario de prisiones") {
    encabezado = "FUNCIONARIO DE PRISIONES";
    colorEncabezado = "#8b4513";
  }

  const anchoBolas = 5 * 60 + 4 * 10; // 5 columnas * 60px + 4 gaps de 10px

  const h2Ref = useRef();
  const [fontSize, setFontSize] = useState(20); // tamaño inicial

  useEffect(() => {
    if (!h2Ref.current) return;
    let tamaño = 20; // tamaño máximo
    h2Ref.current.style.fontSize = `${tamaño}px`;

    while (h2Ref.current.scrollWidth > anchoBolas && tamaño > 10) {
      tamaño -= 1;
      h2Ref.current.style.fontSize = `${tamaño}px`;
    }
    setFontSize(tamaño);
  }, [encabezado, anchoBolas]);

  return (
    <div
      className="pantalla-principal"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "60px",
        gap: "20px",
      }}
    >
      <button
        className="volver"
        onClick={() => setPantalla("inicio")}
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 1000,
        }}
      >
        ←
      </button>

      {/* Encabezado centrado y tamaño dinámico */}
      <div
        style={{
          width: `${anchoBolas}px`,
          textAlign: "center",
          margin: "0 auto",
        }}
      >
        <h2 ref={h2Ref} style={{ margin: 0, color: colorEncabezado, fontSize: `${fontSize}px` }}>
          {encabezado}
        </h2>
      </div>

      {/* Contenedor de bolas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 60px)",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {Object.keys(temas).map((num) => {
          const claveTema = `${organizacion}-${num}`; // clave combinada organización-bola
          const color = progreso[claveTema]?.color || "#444"; // color actualizado según progreso
          return (
            <div
              key={num}
              className="bola"
              style={{
                backgroundColor: color,
                width: "60px",
                height: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                borderRadius: "50%",
                color: "#fff",
                fontWeight: "bold",
              }}
              onClick={() => abrirBola(Number(num))}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}
