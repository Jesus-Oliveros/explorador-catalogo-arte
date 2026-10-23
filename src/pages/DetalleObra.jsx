
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerObraPorId } from "../services/api";

function DetalleObra() {
  const { id } = useParams();

  const [obra, setObra] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarObra = async () => {
      try {
        setCargando(true);
        setError("");

        const datos = await obtenerObraPorId(id);
        setObra(datos);
      } catch {
        setError("No se pudo cargar el detalle de la obra.");
      } finally {
        setCargando(false);
      }
    };

    cargarObra();
  }, [id]);

  if (cargando) {
    return <p>Cargando detalle de la obra...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!obra) {
    return <p>No se encontró la obra.</p>;
  }

  return (
    <div>
      <h2>{obra.title || "Obra sin título"}</h2>

      {obra.primaryImage ? (
        <img
          src={obra.primaryImage}
          alt={obra.title || "Obra del museo"}
          style={{ maxWidth: "100%", width: "400px" }}
        />
      ) : (
        <p>Esta obra no tiene imagen disponible.</p>
      )}

      <p>
        <strong>Artista:</strong>{" "}
        {obra.artistDisplayName || "Autor no registrado"}
      </p>

      <p>
        <strong>Fecha:</strong> {obra.objectDate || "No especificada"}
      </p>

      <p>
        <strong>Departamento:</strong>{" "}
        {obra.department || "No especificado"}
      </p>

      <p>
        <strong>Técnica:</strong> {obra.medium || "No especificada"}
      </p>

      <p>
        <strong>Dimensiones:</strong>{" "}
        {obra.dimensions || "No especificadas"}
      </p>

      <Link to="/lista">Volver al catálogo</Link>
    </div>
  );
}

export default DetalleObra;
