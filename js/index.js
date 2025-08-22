// 1) Enlace activo (Inicio)
(function () {
  const aInicio = document.getElementById('link-inicio');
  const path = location.pathname;
  if (path.endsWith('/') || path.endsWith('/index.html')) {
    aInicio.classList.add('active');
    aInicio.setAttribute('aria-current', 'page');
  }
})();

// 2) Carga de noticias desde JSON
(function () {
  const contenedor = document.getElementById('noticias');
  if (!contenedor) return;

  fetch('./data/noticias.json', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('No se pudo cargar el archivo de noticias.');
      return res.json();
    })
    .then(data => {
      const lista = Array.isArray(data) ? data : (Array.isArray(data.noticias) ? data.noticias : []);
      if (!lista.length) {
        contenedor.innerHTML = '<p>No hay noticias disponibles por el momento.</p>';
        return;
      }
      contenedor.innerHTML = lista.map(n => `
        <article class="noticia">
          <h3>${n.titulo ?? 'Noticia'}</h3>
          ${n.fecha ? `<p><small>${n.fecha}</small></p>` : ''}
          <p>${n.descripcion ?? n.resumen ?? ''}</p>
          ${n.enlace ? `<p><a href="${n.enlace}" target="_blank" rel="noopener">Leer más</a></p>` : ''}
        </article>
      `).join('');
    })
    .catch(() => {
      contenedor.innerHTML = '<p class="aviso">No se pudieron cargar las noticias. Inténtalo más tarde.</p>';
    });
})();
