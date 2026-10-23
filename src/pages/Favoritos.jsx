
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  obtenerFavoritos,
  eliminarFavorito
} from "../services/favoritos";
import { obtenerImagen } from "../services/api";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    setFavoritos(obtenerFavoritos());
  }, []);

  const quitarFavorito = (id) => {
    eliminarFavorito(id);
    setFavoritos(obtenerFavoritos());
  };

  if (favoritos.length === 0) {
    return (
      <div>
        <h2>Mis favoritos</h2>
        <p>No tienes obras guardadas.</p>
        <Link to="/lista">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Mis favoritos</h2>

      <div className="lista-obras">
        {favoritos.map((obra) => (
          <div className="obra" key={obra.objectID}>
            <img
              src={obtenerImagen(obra)}
              alt={obra.title || "Obra del museo"}
            />

            <h3>{obra.title || "Obra sin título"}</h3>

            <p>
              <strong>Artista:</strong>{" "}
              {obra.artistDisplayName || "Autor no registrado"}
            </p>

            <Link to={`/detalle/${obra.objectID}`}>
              Ver detalle
            </Link>

            <br />

            <button
              type="button"
              onClick={() => quitarFavorito(obra.objectID)}
            >
              Quitar de favoritos
            </button>
          </div>
        ))}
      </div>

      <p>
        <Link to="/lista">Volver al catálogo</Link>
      </p>
    </div>
  );
}

export default Favoritos;
