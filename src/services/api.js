
const API_URL =
  "https://collectionapi.metmuseum.org/public/collection/v1";

const SEARCH_URL =
  "https://collectionapi.metmuseum.org/public/collection/v1.1/search";

export const obtenerObras = async (busqueda = "painting", inicio = 0) => {
  const respuesta = await fetch(
    `${SEARCH_URL}?hasImages=true&q=${encodeURIComponent(busqueda)}`
  );

  if (!respuesta.ok) {
    throw new Error("Error al buscar las obras");
  }

  const datos = await respuesta.json();
  const ids = datos.objectIDs || [];

  if (ids.length === 0 || inicio >= ids.length) {
    return {
      obras: [],
      total: datos.total || 0,
      siguienteInicio: inicio,
      hayMas: false,
    };
  }

  const obras = [];
  let posicion = inicio;

  while (obras.length < 12 && posicion < ids.length) {
    const lote = ids.slice(posicion, posicion + 10);
    posicion += lote.length;

    const resultados = await Promise.all(
      lote.map(async (id) => {
        try {
          const respuestaObra = await fetch(
            `${API_URL}/objects/${id}`
          );

          if (!respuestaObra.ok) return null;

          const obra = await respuestaObra.json();

          if (!obra.primaryImageSmall && !obra.primaryImage) {
            return null;
          }

          return obra;
        } catch {
          return null;
        }
      })
    );

    obras.push(...resultados.filter((obra) => obra !== null));
  }

  const normalizar = (texto) =>
    (texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const termino = normalizar(busqueda);

  const puntaje = (titulo, artista) => {
    if (titulo === termino) return 0;
    if (titulo.startsWith(termino)) return 1;
    if (artista === termino) return 2;
    if (artista.includes(termino)) return 3;
    if (titulo.includes(termino)) return 4;
    return 5;
  };

  obras.sort((a, b) => {
    return (
      puntaje(normalizar(a.title), normalizar(a.artistDisplayName)) -
      puntaje(normalizar(b.title), normalizar(b.artistDisplayName))
    );
  });

  return {
    obras: obras.slice(0, 12),
    total: datos.total || 0,
    siguienteInicio: posicion,
    hayMas: posicion < ids.length,
  };
};

export const obtenerObraPorId = async (id) => {
  const respuesta = await fetch(`${API_URL}/objects/${id}`);

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar el detalle de la obra");
  }

  return await respuesta.json();
};

export const obtenerImagen = (obra) => {
  return obra?.primaryImageSmall || obra?.primaryImage || null;
};
