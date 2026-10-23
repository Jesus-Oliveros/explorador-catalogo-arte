
const CLAVE_FAVORITOS = "obrasFavoritas";

export const obtenerFavoritos = () => {
  return JSON.parse(localStorage.getItem(CLAVE_FAVORITOS)) || [];
};

export const guardarFavoritos = (obra) => {
  const favoritos = obtenerFavoritos();

  const existe = favoritos.some(
    (favorito) => favorito.objectID === obra.objectID
  );

  if (!existe) {
    favoritos.push(obra);

    localStorage.setItem(
      CLAVE_FAVORITOS,
      JSON.stringify(favoritos)
    );

    window.dispatchEvent(
      new Event("favoritosActualizados")
    );
  }
};

export const eliminarFavorito = (id) => {
  const favoritos = obtenerFavoritos().filter(
    (obra) => obra.objectID !== id
  );

  localStorage.setItem(
    CLAVE_FAVORITOS,
    JSON.stringify(favoritos)
  );

  window.dispatchEvent(
    new Event("favoritosActualizados")
  );
};
