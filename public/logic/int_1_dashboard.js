import { almacenaje } from "./almacenaje.js";
import { dashboardCard } from "../components/dashboard-card.js";
import { dashboardData } from "../assets/data/dashboardData.js";
import { mostrarNotificacion } from "../components/notifications.js";

const contDisponibles = document.getElementById("dashboard");
const contSeleccionados = document.getElementById("dashboard-box");
const botonesFiltro = document.querySelectorAll(".buttons-container .btn");
const contBotones = document.querySelector(".buttons-container");

async function iniciarPaginaPrincipal() {
  if (!contDisponibles || !contSeleccionados) return;

  try {
    // Cargar datos si está vacío (Modo Incógnito)
    let todosLosVoluntariados = await almacenaje.obtenerVoluntariados();
    if (todosLosVoluntariados.length === 0) {
      for (const v of dashboardData) {
        await almacenaje.insertarVoluntariado(v);
      }
      todosLosVoluntariados = await almacenaje.obtenerVoluntariados();
    }

    if (todosLosVoluntariados.length === 0) {
      contDisponibles.innerHTML = `<div class="col-12 text-center text-muted py-5">
            <i class="bi bi-inbox display-1"></i>
            <p class="mt-3">No hay voluntariados disponibles.</p>
         </div>`;
    }

    const activeUser = almacenaje.obtenerUsuarioActivo();
    let claveGuardado;
    let datosParaMostrar;

    // Determinar clave de guardado según usuario
    if (activeUser) {
      claveGuardado = `seleccion_${activeUser.email}`;
      datosParaMostrar = todosLosVoluntariados;
      if (contBotones) contBotones.style.display = "block";
    } else {
      claveGuardado = "seleccionIndex";
      datosParaMostrar = todosLosVoluntariados;
      if (contBotones) contBotones.style.display = "none";
    }

    const socket = io("https://localhost:3000", {
      transports: ["websocket", "polling"],
    });

    socket.on("nuevo_voluntariado", (nuevoVoluntariado) => {
      console.log(
        "⚡ Nuevo voluntariado recibido en Dashboard:",
        nuevoVoluntariado
      );

      nuevoVoluntariado.id = nuevoVoluntariado._id;

      todosLosVoluntariados.push(nuevoVoluntariado);

      renderizarTodo(
        todosLosVoluntariados,
        claveGuardado,
        activeUser,
        todosLosVoluntariados
      );

      const titulo =
        nuevoVoluntariado.titulo || nuevoVoluntariado.title || "Nuevo item";
      mostrarNotificacion(`Nuevo anuncio disponible: ${titulo}`, "info");
    });

    socket.on("voluntariado_eliminado", (idEliminado) => {
      console.log("🗑️ Alguien ha borrado el ID:", idEliminado);

      todosLosVoluntariados = todosLosVoluntariados.filter(
        (v) => String(v.id) !== String(idEliminado)
      );

      renderizarTodo(
        todosLosVoluntariados,
        claveGuardado,
        activeUser,
        todosLosVoluntariados
      );

      mostrarNotificacion("Un anuncio ha sido retirado.", "warning");
    });

    renderizarTodo(
      datosParaMostrar,
      claveGuardado,
      activeUser,
      todosLosVoluntariados
    );
  } catch (error) {
    console.error(error);
    contDisponibles.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
  }
}

function renderizarTodo(
  datosParaMostrar,
  claveGuardado,
  activeUser,
  todosLosVoluntariados
) {
  contDisponibles.innerHTML = "";
  contSeleccionados.innerHTML = "";

  const idsGuardados = JSON.parse(localStorage.getItem(claveGuardado)) || [];

  datosParaMostrar.forEach((item) => {
    const tarjetaElement = dashboardCard(item);
    tarjetaElement.draggable = true;
    tarjetaElement.dataset.itemId = item.id;

    tarjetaElement.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", event.target.dataset.itemId);
      event.target.classList.add("dragging");
    });

    tarjetaElement.addEventListener("dragend", (event) => {
      event.target.classList.remove("dragging");
    });

    if (idsGuardados.includes(item.id)) {
      contSeleccionados.appendChild(tarjetaElement);
    } else {
      contDisponibles.appendChild(tarjetaElement);
    }
  });

  activarZonasDrop(claveGuardado);

  if (activeUser) {
    conectarFiltros(activeUser, todosLosVoluntariados, claveGuardado);
  }
}

function activarZonasDrop(claveGuardado) {
  const zonas = [contDisponibles, contSeleccionados];

  zonas.forEach((zona) => {
    if (zona._manejadorDragOver)
      zona.removeEventListener("dragover", zona._manejadorDragOver);
    if (zona._manejadorDragLeave)
      zona.removeEventListener("dragleave", zona._manejadorDragLeave);
    if (zona._manejadorDrop)
      zona.removeEventListener("drop", zona._manejadorDrop);

    const manejadorDragOver = (event) => handleDragOver(event);
    const manejadorDragLeave = (event) => handleDragLeave(event);
    const manejadorDrop = (event) => handleDrop(event, claveGuardado);

    zona.addEventListener("dragover", manejadorDragOver);
    zona.addEventListener("dragleave", manejadorDragLeave);
    zona.addEventListener("drop", manejadorDrop);

    zona._manejadorDragOver = manejadorDragOver;
    zona._manejadorDragLeave = manejadorDragLeave;
    zona._manejadorDrop = manejadorDrop;
  });
}

function handleDragOver(event) {
  event.preventDefault(); // Necesario para permitir drop
  event.currentTarget.classList.add("drag-over");
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove("drag-over");
}

function handleDrop(event, claveDeGuardado) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");

  const itemId = event.dataTransfer.getData("text/plain");
  const tarjetaArrastrada = document.querySelector(
    `[data-item-id="${itemId}"]`
  );

  if (tarjetaArrastrada) {
    event.currentTarget.appendChild(tarjetaArrastrada);
    guardarSeleccionActual(claveDeGuardado);
  }
}

function guardarSeleccionActual(claveDeGuardado) {
  const tarjetasEnLaCaja = contSeleccionados.querySelectorAll("[data-item-id]");
  const arrayDeIdsNumericos = Array.from(tarjetasEnLaCaja).map((tarjeta) =>
    Number(tarjeta.dataset.itemId)
  );
  localStorage.setItem(claveDeGuardado, JSON.stringify(arrayDeIdsNumericos));
}

function conectarFiltros(activeUser, todosLosVoluntariados, claveGuardado) {
  botonesFiltro.forEach((button) => {
    if (button._manejadorFiltro)
      button.removeEventListener("click", button._manejadorFiltro);

    const manejadorFiltro = (event) => {
      event.preventDefault();

      // Gestión visual botones
      botonesFiltro.forEach((btn) => {
        btn.classList.remove("active", "btn-primary");
        btn.classList.add("btn-outline-primary");
      });
      button.classList.remove("btn-outline-primary");
      button.classList.add("active", "btn-primary");

      const filterType = button.textContent.trim();
      let datosFiltrados;

      switch (filterType) {
        case "Propias":
          datosFiltrados = todosLosVoluntariados.filter(
            (item) => item.email === activeUser.email
          );
          break;
        case "Otras":
          datosFiltrados = todosLosVoluntariados.filter(
            (item) => item.email !== activeUser.email
          );
          break;
        case "Todas":
        default:
          datosFiltrados = todosLosVoluntariados;
          break;
      }

      renderizarTodo(
        datosFiltrados,
        claveGuardado,
        activeUser,
        todosLosVoluntariados
      );
    };

    button._manejadorFiltro = manejadorFiltro;
    button.addEventListener("click", manejadorFiltro);
  });
}

document.addEventListener("DOMContentLoaded", iniciarPaginaPrincipal);
