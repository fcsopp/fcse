import { useState } from "react";

export default function PopupObjetivo({ onClose, onAñadir }) {
  const [nuevoObjetivo, setNuevoObjetivo] = useState("");
  const MAX_LENGTH = 100;

  const añadirYCerrar = () => {
    const trimmed = nuevoObjetivo.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_LENGTH) {
      alert(`El objetivo no puede superar ${MAX_LENGTH} caracteres.`);
      return;
    }
    onAñadir(trimmed);
    setNuevoObjetivo("");
    onClose();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setNuevoObjetivo(value.slice(0, MAX_LENGTH));
  };

  return (
    <div style={{ position: "fixed", top:0, left:0, right:0, bottom:0, backgroundColor:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:1000, padding:"10px" }}>
      <div style={{ backgroundColor:"#fff", padding:"15px", borderRadius:"10px", width:"100%", maxWidth:"400px", maxHeight:"80vh", overflowY:"auto", boxSizing:"border-box" }}>
        <h3 style={{ margin:"0 0 10px 0", color:"#000" }}>Nuevo objetivo</h3>
        <textarea
          value={nuevoObjetivo}
          onChange={handleChange}
          placeholder="Escribe tu comentario u objetivo..."
          style={{ width:"100%", minHeight:"100px", padding:"10px", fontSize:"14px", borderRadius:"6px", border:"1px solid #ccc", resize:"vertical", boxSizing:"border-box" }}
        />
        <div style={{ marginTop:"5px", fontSize:"12px", color:"#555" }}>{nuevoObjetivo.length}/{MAX_LENGTH} caracteres</div>
        <div style={{ marginTop:"10px", display:"flex", justifyContent:"flex-end", gap:"10px", flexWrap:"wrap" }}>
          <button onClick={onClose} style={{ padding:"5px 10px", borderRadius:"4px", border:"none", backgroundColor:"#e74c3c", color:"#fff", cursor:"pointer" }}>Cancelar</button>
          <button onClick={añadirYCerrar} disabled={nuevoObjetivo.trim()===""} style={{ padding:"5px 10px", borderRadius:"4px", border:"none", backgroundColor:"#3498db", color:"#fff", cursor: nuevoObjetivo.trim()==="" ? "not-allowed":"pointer", opacity: nuevoObjetivo.trim()===""?0.5:1 }}>Añadir</button>
        </div>
      </div>
    </div>
  );
}
