export default function PantallaInicio({ setPantalla, setOrganizacion }) {
  return (
    <div className="inicio-container">
      <h1>Selecciona tu oposición</h1>
      <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
        <button className="color-boton azul" onClick={() => { setOrganizacion("Policía Nacional"); setPantalla("principal"); }}>Policía Nacional</button>
        <button className="color-boton verde-oscuro" onClick={() => { setOrganizacion("Guardia Civil"); setPantalla("principal"); }}>Guardia Civil</button>
        <button className="color-boton marron" onClick={() => { setOrganizacion("Funcionario de prisiones"); setPantalla("principal"); }}>Funcionario de prisiones</button>
      </div>
    </div>
  );
}
