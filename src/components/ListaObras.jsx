
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerObras, obtenerImagen } from "../services/api";
import { guardarFavoritos } from "../services/favoritos";

function ListaObras() {
  const [obras, setObras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [departamento, setDepartamento] = useState("Todos");
  const [departamentos, setDepartamentos] = useState([]);
  const [siguienteInicio, setSiguienteInicio] = useState(0);
  const [hayMas, setHayMas] = useState(false);

  // Cargar todos los departamentos del museo
  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        const respuesta = await fetch(
          "/met-api/public/collection/v1/departments"
        );

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los departamentos");
        }

        const datos = await respuesta.json();

        const nombres = (datos.departments || [])
          .map((item) => item.displayName)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        setDepartamentos(nombres);
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      }
    };

    cargarDepartamentos();
  }, []);

  // Cargar las obras según la búsqueda
  useEffect(() => {
    const cargarObras = async () => {
      try {
        setCargando(true);
        setError("");
        setObras([]);
        setDepartamento("Todos");

        const datos = await obtenerObras(busqueda, 0);

        setObras(datos.obras);
        setSiguienteInicio(datos.siguienteInicio);
        setHayMas(datos.hayMas);
      } catch {
        setError("No se pudieron cargar las obras.");
      } finally {
        setCargando(false);
      }
    };

    cargarObras();
  }, [busqueda]);

  // Cargar más obras
  const cargarMasObras = async () => {
    try {
      setCargandoMas(true);
      setError("");

      const datos = await obtenerObras(busqueda, siguienteInicio);

      setObras((anteriores) => {
        const nuevas = datos.obras.filter(
          (obra) =>
            !anteriores.some(
              (anterior) => anterior.objectID === obra.objectID
            )
        );

        return [...anteriores, ...nuevas];
      });

      setSiguienteInicio(datos.siguienteInicio);
      setHayMas(datos.hayMas);
    } catch {
      setError("No se pudieron cargar más obras.");
    } finally {
      setCargandoMas(false);
    }
  };

  // Buscar obras
  const buscarObras = (e) => {
    e.preventDefault();

    const termino = textoBusqueda.trim() || "painting";

    setTextoBusqueda(termino);
    setBusqueda(termino);
  };

  // Filtrar las obras por departamento
  const obrasFiltradas =
    departamento === "Todos"
      ? obras
      : obras.filter(
          (obra) => obra.department === departamento
        );

  return (
    <div>
      <h2>Catálogo del Metropolitan Museum</h2>

      <div className="controles-busqueda">
        <form onSubmit={buscarObras}>
          <input
            type="text"
            name="busqueda"
            placeholder="Nombre de obra o artista"
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
          />

          <button type="submit">Buscar</button>
        </form>

        <div className="filtro-departamento">
          <label htmlFor="departamento">
            Departamento:
          </label>

          <select
            id="departamento"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
          >
            <option value="Todos">Todos</option>

            {departamentos.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando && <p>Cargando obras del museo...</p>}

      {error && <p>{error}</p>}

      {!cargando &&
        !error &&
        obrasFiltradas.length === 0 && (
          <p>No se encontraron obras para este filtro.</p>
        )}

      <div className="lista-obras">
        {obrasFiltradas.map((obra) => (
          <div className="obra" key={obra.objectID}>
            <img
              src={obtenerImagen(obra)}
              alt={obra.title || "Obra del museo"}
            />

            <h3>{obra.title || "Obra sin título"}</h3>

            <p>
              <strong>Artista:</strong>{" "}
              {obra.artistDisplayName?.trim() ||
                "Autor no registrado"}
            </p>

            <p>
              <strong>Fecha:</strong>{" "}
              {obra.objectDate || "Fecha desconocida"}
            </p>

            <p>
              <strong>Departamento:</strong>{" "}
              {obra.department || "No especificado"}
            </p>

            <Link to={`/detalle/${obra.objectID}`}>
              Ver detalle
            </Link>

            <br />

            <button
              type="button"
              onClick={() => {
                try {
                  guardarFavoritos(obra);
                  alert(
                    "Revisa la sección Favoritos para ver la obra."
                  );
                } catch {
                  alert(
                    "Ocurrió un error al guardar el favorito."
                  );
                }
              }}
            >
              Guardar en favoritos
            </button>
          </div>
        ))}
      </div>

      {!cargando && !error && obras.length > 0 && hayMas && (
        <button
          type="button"
          onClick={cargarMasObras}
          disabled={cargandoMas}
        >
          {cargandoMas ? "Cargando..." : "Cargar más"}
        </button>
      )}
    </div>
  );
}

export default ListaObras;
