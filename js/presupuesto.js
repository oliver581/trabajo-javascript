document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('formPresupuesto');
  const nombre      = document.getElementById('nombre');
  const apellidos   = document.getElementById('apellidos');
  const telefono    = document.getElementById('telefono');
  const email       = document.getElementById('email');

  const producto    = document.getElementById('producto');
  const plazo       = document.getElementById('plazo');
  const extras      = document.querySelectorAll('.extra');
  const total       = document.getElementById('total');
  const condiciones = document.getElementById('condiciones');

  const eNombre    = document.getElementById('err-nombre');
  const eApellidos = document.getElementById('err-apellidos');
  const eTelefono  = document.getElementById('err-telefono');
  const eEmail     = document.getElementById('err-email');

  // Mostrar y limpiar mensajes de error
  function setError(input, errNode, msg) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    if (errNode) errNode.textContent = msg;
  }
  function clearError(input, errNode) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    if (errNode) errNode.textContent = '';
  }

  // Reglas simples de validación
  const soloLetras   = (s) => /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]+$/.test(s.trim());
  const maxLen       = (s, n) => s.trim().length > 0 && s.trim().length <= n;
  const solo9Digitos = (s) => /^\d{9}$/.test(s.replace(/\s+/g, ''));
  const emailOk      = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

  function validarNombre() {
    const v = nombre.value;
    clearError(nombre, eNombre);
    if (!soloLetras(v)) return setError(nombre, eNombre, 'Solo letras y espacios.');
    if (!maxLen(v, 15)) return setError(nombre, eNombre, 'Máximo 15 caracteres.');
    return true;
  }

  function validarApellidos() {
    const v = apellidos.value;
    clearError(apellidos, eApellidos);
    if (!soloLetras(v)) return setError(apellidos, eApellidos, 'Solo letras y espacios.');
    if (!maxLen(v, 40)) return setError(apellidos, eApellidos, 'Máximo 40 caracteres.');
    return true;
  }

  function validarTelefono() {
    const v = telefono.value;
    clearError(telefono, eTelefono);
    if (!solo9Digitos(v)) return setError(telefono, eTelefono, 'Debe tener exactamente 9 dígitos.');
    return true;
  }

  function validarEmail() {
    const v = email.value;
    clearError(email, eEmail);
    if (!emailOk(v)) return setError(email, eEmail, 'Introduce un email válido (ej: nombre@dominio.com).');
    return true;
  }

  function calcularPresupuesto() {
    if (!producto.value) {
      total.value = 'Selecciona un producto';
      return;
    }
    const base = parseFloat(producto.value);

    // Descuento: a partir del 3er mes un 2% por mes, con tope del 20%
    const meses = parseInt(plazo.value || '0', 10);
    const mesesConDescuento = Math.max(meses - 2, 0);
    const descuento = Math.min(mesesConDescuento * 0.02, 0.20);

    let subtotal = base - (base * descuento);

    // Extras marcados se suman al subtotal
    extras.forEach(chk => {
      if (chk.checked) subtotal += parseFloat(chk.value) || 0;
    });

    total.value = subtotal.toFixed(2) + ' €';
  }

  producto.addEventListener('change', calcularPresupuesto);
  plazo.addEventListener('input', calcularPresupuesto);
  extras.forEach(chk => chk.addEventListener('change', calcularPresupuesto));
  form.addEventListener('reset', () => setTimeout(() => {
    total.value = 'Selecciona un producto';
    calcularPresupuesto();
  }, 0));

  nombre.addEventListener('input', validarNombre);
  apellidos.addEventListener('input', validarApellidos);
  telefono.addEventListener('input', validarTelefono);
  email.addEventListener('input', validarEmail);

  form.addEventListener('submit', (e) => {
    let ok = true;
    if (!validarNombre()) ok = false;
    if (!validarApellidos()) ok = false;
    if (!validarTelefono()) ok = false;
    if (!validarEmail()) ok = false;

    if (!producto.value) {
      ok = false;
      alert('Debes seleccionar un producto.');
      producto.focus();
    }
    if (!condiciones?.checked) {
      ok = false;
      alert('Debes aceptar las condiciones para enviar el formulario.');
      condiciones?.focus();
    }

    if (!ok) {
      e.preventDefault();
      const primero = document.querySelector('.is-invalid');
      if (primero) primero.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    e.preventDefault();
    alert('Presupuesto enviado correctamente 🎉');
    form.reset();
    setTimeout(() => {
      total.value = 'Selecciona un producto';
      calcularPresupuesto();
    }, 0);
  });

  total.value = 'Selecciona un producto';
});
