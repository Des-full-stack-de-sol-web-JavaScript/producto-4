import { almacenaje } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Gestión de Usuarios cargada");

  // --- Elementos del DOM ---
  const form = document.getElementById("form-alta-usuario");
  const tablaBody = document.getElementById("cuerpo-tabla-usuarios");
  const mensajeContainer = document.getElementById("mensaje-sistema");

  const nombreInput = document.getElementById("nombre");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmar-password");

  // --- FUNCIÓN PARA MOSTRAR NOTIFICACIÓN ---
  const mostrarNotificacion = (mensaje, tipo = "success") => {
    mensajeContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${
              tipo === "success"
                ? '<i class="bi bi-check-circle-fill me-2"></i>'
                : '<i class="bi bi-exclamation-triangle-fill me-2"></i>'
            }
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;

    setTimeout(() => {
      const alerta = mensajeContainer.querySelector(".alert");
      if (alerta) {
        alerta.classList.remove("show");
        setTimeout(() => (mensajeContainer.innerHTML = ""), 150);
      }
    }, 4000);
  };

  // --- 1. RENDERIZADO DE LA TABLA ---
  const renderizarTabla = async () => {
    tablaBody.innerHTML = `<tr><td colspan="4" class="text-center">Cargando usuarios...</td></tr>`;
    
    try {
        const usuarios = await almacenaje.obtenerUsuarios();

        tablaBody.innerHTML = ""; // Limpiar mensaje de carga

        if (!usuarios || usuarios.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No hay usuarios o no tienes permisos.</td></tr>`;
            return;
        }

        usuarios.forEach((user) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td>********</td> 
                <td class="text-end">
                <button class="btn btn-outline-danger btn-sm btn-eliminar" data-email="${user.email}" title="Eliminar">
                    <i class="bi bi-trash"></i> Borrar
                </button>
                </td>
            `;
            tablaBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al renderizar:", error);
        tablaBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar usuarios.</td></tr>`;
    }
  };

  // --- 2. GESTIÓN DE BORRADO ---
  tablaBody.addEventListener("click", async (e) => { // AÑADIDO ASYNC
    const btn = e.target.closest(".btn-eliminar");
    if (!btn) return;

    const email = btn.dataset.email;
    const usuarioActivo = almacenaje.obtenerUsuarioActivo();

    if (usuarioActivo && usuarioActivo.email === email) {
      mostrarNotificacion(
        "No puedes borrar tu propio usuario mientras estás conectado.",
        "danger"
      );
      return;
    }

    if (confirm(`¿Seguro que quieres eliminar al usuario ${email}?`)) {
      // AQUÍ FALTA CAMBIAR borrarUsuario POR UNA LLAMADA ASÍNCRONA AL BACKEND
      // Si borrarUsuario sigue siendo local, funcionará, pero si la cambiaste a fetch, pon await.
      const borrado = almacenaje.borrarUsuario(email); 
      
      if (borrado) {
        await renderizarTabla(); // AÑADIDO AWAIT
        mostrarNotificacion("Usuario eliminado correctamente.", "warning");
      } else {
        mostrarNotificacion("Error al borrar el usuario.", "danger");
      }
    }
  });

  // --- 3. VALIDACIÓN DE CONTRASEÑAS ---
  const validarPasswords = () => {
    if (passwordInput.value !== confirmInput.value) {
      confirmInput.setCustomValidity("Las contraseñas no coinciden");
      confirmInput.classList.add("is-invalid");
    } else {
      confirmInput.setCustomValidity("");
      confirmInput.classList.remove("is-invalid");
    }
  };

  passwordInput.addEventListener("input", validarPasswords);
  confirmInput.addEventListener("input", validarPasswords);

  // --- 4. ENVÍO DEL FORMULARIO (ALTA) ---
  form.addEventListener("submit", async (event) => { // AÑADIDO ASYNC IMPRESCINDIBLE
    event.preventDefault();
    event.stopPropagation();

    validarPasswords();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const nuevoUsuario = {
      rol: "usuario",
      nombre: nombreInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
    };

    // AÑADIDO AWAIT: registrarUsuario ahora hace un fetch, hay que esperar.
    const resultado = await almacenaje.registrarUsuario(nuevoUsuario);

    if (resultado) {
      mostrarNotificacion(
        `¡Bienvenido/a, <strong>${nuevoUsuario.nombre}</strong>! Usuario creado con éxito.`,
        "success"
      );

      form.reset();
      form.classList.remove("was-validated");
      await renderizarTabla(); // AÑADIDO AWAIT para refrescar la lista
    } else {
      mostrarNotificacion(
        "Error: No se pudo crear el usuario (correo duplicado o error de servidor).",
        "danger"
      );

      emailInput.classList.add("is-invalid");
      emailInput.focus();
    }
  });

  renderizarTabla();
});