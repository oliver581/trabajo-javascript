// js/galeria.js
// Galería dinámica con pie de foto para cada proyecto

document.addEventListener('DOMContentLoaded', () => {
  const galeria = document.getElementById('galeria');

  // OJO: galeria.html está en /views, por eso subimos a ../images/...
  const proyectos = [
    { src: '../img/proyecto1.jpg', titulo: 'Diseño Web Moderno' },
    { src: '../img/proyecto2.jpg', titulo: 'App Móvil Interactiva' },
    { src: '../img/proyecto3.jpg', titulo: 'Identidad Visual y Logo' },
    { src: '../img/proyecto4.jpg', titulo: 'Equipo Creativo en Acción' }
  ];

  proyectos.forEach(p => {
    const item = document.createElement('div');
    item.className = 'proyecto';

    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.titulo;
    img.loading = 'lazy';
    img.classList.add('miniatura');

    const caption = document.createElement('p');
    caption.textContent = p.titulo;

    item.appendChild(img);
    item.appendChild(caption);
    galeria.appendChild(item);
  });

  // Mensaje si alguna imagen no existe
  galeria.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      const aviso = document.createElement('p');
      aviso.textContent = 'Imagen no encontrada';
      img.replaceWith(aviso);
    });
  });
});
