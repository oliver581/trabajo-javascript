// Coordenadas del negocio (Madrid centro como ejemplo)
const NEGOCIO = { lat: 40.4168, lng: -3.7038 };

document.addEventListener('DOMContentLoaded', () => {
  const estado = document.getElementById('estado');
  const btnMiUbicacion = document.getElementById('btnMiUbicacion');
  const btnAbrirOSM = document.getElementById('btnAbrirOSM');
  const instruccionMapa = document.getElementById('instruccionMapa'); // 👈 aviso encima del mapa

  let ubicacionUsuario = null;
  let routingControl = null;
  let marcadorUsuario = null;

  const mapa = L.map('mapa').setView([NEGOCIO.lat, NEGOCIO.lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapa);

  const marcadorNegocio = L.marker([NEGOCIO.lat, NEGOCIO.lng])
    .addTo(mapa).bindPopup('Ubicación del negocio');

  function limpiarRuta() {
    if (routingControl) {
      mapa.removeControl(routingControl);
      routingControl = null;
    }
  }

  function trazarRuta() {
    limpiarRuta();
    if (!ubicacionUsuario) {
      estado.textContent = 'Selecciona tu ubicación en el mapa o usa 📍';
      return;
    }
    if (!marcadorUsuario) {
      marcadorUsuario = L.marker([ubicacionUsuario.lat, ubicacionUsuario.lng])
        .addTo(mapa).bindPopup('Tu ubicación');
    }
    routingControl = L.Routing.control({
      waypoints: [
        L.latLng(ubicacionUsuario.lat, ubicacionUsuario.lng),
        L.latLng(NEGOCIO.lat, NEGOCIO.lng)
      ],
      router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false
    }).addTo(mapa);
    estado.textContent = 'Ruta en coche trazada.';
  }

  // Usar geolocalización
  btnMiUbicacion.addEventListener('click', () => {
    if (!navigator.geolocation) {
      estado.textContent = 'Este navegador no soporta geolocalización.';
      return;
    }
    estado.textContent = 'Obteniendo tu ubicación…';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        ubicacionUsuario = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        estado.textContent = 'Ubicación detectada.';
        if (marcadorUsuario) mapa.removeLayer(marcadorUsuario);
        marcadorUsuario = L.marker([ubicacionUsuario.lat, ubicacionUsuario.lng])
          .addTo(mapa).bindPopup('Tu ubicación');
        if (instruccionMapa) instruccionMapa.style.display = 'none'; // 👈 ocultar aviso
        trazarRuta();
      },
      () => { estado.textContent = 'No fue posible obtener tu ubicación.'; },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

  // Permitir elegir ubicación manual en el mapa
  mapa.on('click', (e) => {
    ubicacionUsuario = { lat: e.latlng.lat, lng: e.latlng.lng };
    estado.textContent = 'Ubicación seleccionada en el mapa.';
    if (marcadorUsuario) mapa.removeLayer(marcadorUsuario);
    marcadorUsuario = L.marker([ubicacionUsuario.lat, ubicacionUsuario.lng])
      .addTo(mapa).bindPopup('Tu ubicación');
    if (instruccionMapa) instruccionMapa.style.display = 'none'; // 👈 ocultar aviso
    trazarRuta();
  });

  // Abrir indicaciones externas en OSM
  btnAbrirOSM.addEventListener('click', () => {
    if (!ubicacionUsuario) {
      estado.textContent = 'Selecciona tu ubicación en el mapa o usa 📍';
      return;
    }
    const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${ubicacionUsuario.lat},${ubicacionUsuario.lng};${NEGOCIO.lat},${NEGOCIO.lng}`;
    window.open(url, '_blank', 'noopener');
  });

  // Validación básica del formulario
  const form        = document.getElementById('formContacto');
  const nombre      = document.getElementById('nombre');
  const apellidos   = document.getElementById('apellidos');
  const telefono    = document.getElementById('telefono');
  const email       = document.getElementById('email');
  const comentarios = document.getElementById('comentarios');
  const condiciones = document.getElementById('condiciones');

  function validarCampo(campo, regex) {
    return regex.test(campo.value.trim());
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const esValido =
      validarCampo(nombre,    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,15}$/) &&
      validarCampo(apellidos, /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,40}$/) &&
      validarCampo(telefono,  /^[0-9]{9}$/) &&
      validarCampo(email,     /^[\w.-]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}$/) &&
      comentarios.value.trim().length > 0 &&
      comentarios.value.trim().length <= 200 &&
      condiciones.checked;

    if (!esValido) {
      alert('Revisa los datos y acepta la política de privacidad.');
      return;
    }
    alert('Mensaje enviado correctamente 🎉');
    form.reset();
  });
});
