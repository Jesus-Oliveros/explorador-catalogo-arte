
import { useState } from "react";

function Registro({ usuarios, setUsuarios }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [id, setId] = useState("");
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const limpiarFormulario = () => {
    setId("");
    setNombre("");
    setCorreo("");
    setEditando(null);
  };

  const guardarUsuario = (e) => {
    e.preventDefault();

    if (!id.trim() || !nombre.trim() || !correo.trim()) {
      setMensaje("Completa todos los campos.");
      return;
    }

    if (!/^\d+$/.test(id.trim())) {
      setMensaje("La identificación debe contener solo números.");
      return;
    }

    if (!correo.includes("@")) {
      setMensaje("Ingresa un correo válido.");
      return;
    }

    const existe = usuarios.some(
      (usuario) =>
        usuario.id === id.trim() && usuario.id !== editando
    );

    if (existe) {
      setMensaje(`Ya existe un usuario con la identificación ${id.trim()}.`);
      return;
    }

    const usuarioNuevo = {
      id: id.trim(),
      nombre: nombre.trim(),
      correo: correo.trim(),
    };

    if (editando !== null) {
      setUsuarios(
        usuarios.map((usuario) =>
          usuario.id === editando ? usuarioNuevo : usuario
        )
      );

      setMensaje("Usuario actualizado correctamente.");
    } else {
      setUsuarios([...usuarios, usuarioNuevo]);
      setMensaje("Usuario registrado correctamente.");
    }

    limpiarFormulario();
  };

  const editarUsuario = (usuario) => {
    setId(usuario.id);
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setEditando(usuario.id);
    setMensaje("");
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
    setMensaje("Edición cancelada.");
  };

  const eliminarUsuario = (idUsuario) => {
    if (window.confirm("¿Deseas eliminar este usuario?")) {
      setUsuarios(
        usuarios.filter((usuario) => usuario.id !== idUsuario)
      );

      if (editando === idUsuario) {
        limpiarFormulario();
      }

      setMensaje("Usuario eliminado correctamente.");
    }
  };

  return (
    <div>
      <h2>Registro de usuarios</h2>

      <form onSubmit={guardarUsuario}>
        <input
          type="text"
          placeholder="Identificación"
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={editando !== null}
        />

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <button type="submit">
          {editando !== null ? "Guardar cambios" : "Registrar"}
        </button>

        {editando !== null && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

      {mensaje && <p>{mensaje}</p>}

      <h3>Usuarios registrados: {usuarios.length}</h3>

      {usuarios.length === 0 ? (
        <p>Aún no hay usuarios registrados</p>
      ) : (
        usuarios.map((usuario) => (
          <div key={usuario.id}>
            <p>
              Identificación: {usuario.id} | Nombre: {usuario.nombre} |
              Correo: {usuario.correo}
            </p>

            <button
              type="button"
              onClick={() => editarUsuario(usuario)}
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => eliminarUsuario(usuario.id)}
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Registro;
