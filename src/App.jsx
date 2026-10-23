
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import ListaObras from "./components/ListaObras";
import "./App.css";
import DetalleObra from "./pages/DetalleObra";
import Favoritos from "./pages/Favoritos";
import Registro from "./pages/Registro";
import { obtenerFavoritos } from "./services/favoritos";

function Inicio() {
  return (
    <div className="inicio">
      <section className="inicio-portada">
        <div className="inicio-contenido">
          <p className="inicio-etiqueta">
            METROPOLITAN MUSEUM OF ART
          </p>

          <h1>Explora, descubre y disfruta el arte</h1>

          <p className="inicio-descripcion">
            Conoce obras de diferentes épocas y culturas.
            Busca tus favoritas y descubre la historia
            detrás de cada pieza.
          </p>

          <NavLink to="/lista" className="boton-inicio">
            Explorar catálogo →
          </NavLink>
        </div>
      </section>

      <section className="inicio-seccion">
        <h2>¿Qué puedes hacer?</h2>

        <div className="inicio-tarjetas">
          <article className="inicio-tarjeta">
            <h3>🎨 Explorar obras</h3>
            <p>
              Busca obras de arte por nombre, artista
              o departamento.
            </p>
            <NavLink to="/lista">Ver catálogo</NavLink>
          </article>

          <article className="inicio-tarjeta">
            <h3>⭐ Guardar favoritas</h3>
            <p>
              Crea tu propia colección con las obras
              que más te gusten.
            </p>
            <NavLink to="/favoritos">Ver favoritas</NavLink>
          </article>

          <article className="inicio-tarjeta">
            <h3>👤 Registro de usuarios</h3>
            <p>
              Registra usuarios y administra sus datos
              desde la aplicación.
            </p>
            <NavLink to="/registro">Ir al registro</NavLink>
          </article>
        </div>
      </section>

      <section className="inicio-nota">
        <h3>Descubre el arte del mundo</h3>
        <p>
          Esta aplicación consulta la API pública del
          Metropolitan Museum of Art para mostrar
          información de su colección.
        </p>
        <a
          href="https://www.metmuseum.org/"
          target="_blank"
          rel="noreferrer"
        >
          Visitar sitio oficial del museo
        </a>
      </section>
    </div>
  );
}

function NoEncontrado() {
  return (
    <div className="pagina-no-encontrada">
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <NavLink to="/">Volver al inicio</NavLink>
    </div>
  );
}

function App() {
  const [usuarios, setUsuarios] = useState([]);

  const [cantidadFavoritos, setCantidadFavoritos] = useState(
    () => obtenerFavoritos().length
  );

  useEffect(() => {
    const actualizarFavoritos = () => {
      setCantidadFavoritos(obtenerFavoritos().length);
    };

    window.addEventListener(
      "favoritosActualizados",
      actualizarFavoritos
    );

    return () => {
      window.removeEventListener(
        "favoritosActualizados",
        actualizarFavoritos
      );
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <header className="navbar">
          <NavLink to="/" className="navbar-logo">
            Metropolitan Museum
          </NavLink>

          <nav className="navbar-links">
            <NavLink to="/" end>
              Inicio
            </NavLink>

            <NavLink to="/lista">
              Listado
            </NavLink>

            <NavLink to="/favoritos">
              Favoritos ({cantidadFavoritos})
            </NavLink>

            <NavLink to="/registro">
              Registro ({usuarios.length})
            </NavLink>
          </nav>
        </header>

        <main className="contenido-principal">
          <Routes>
            <Route path="/" element={<Inicio />} />

            <Route
              path="/lista"
              element={<ListaObras />}
            />

            <Route
              path="/detalle/:id"
              element={<DetalleObra />}
            />

            <Route
              path="/favoritos"
              element={<Favoritos />}
            />

            <Route
              path="/registro"
              element={
                <Registro
                  usuarios={usuarios}
                  setUsuarios={setUsuarios}
                />
              }
            />

            <Route path="*" element={<NoEncontrado />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>
            Proyecto React · Catálogo del Metropolitan Museum of Art
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
