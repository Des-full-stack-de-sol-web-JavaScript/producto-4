import { almacenaje } from "./almacenaje.js";
import { mostrarNotificacion } from "../components/notifications.js";

function voluntariadosPage() {
  console.log("Cargando página de Voluntariados...");

  const tabla = document.getElementById("tablaVoluntariado");
  const formulario = document.getElementById("formulario");
  const canvas = document.getElementById("graficoVoluntariados");

  if (!tabla || !formulario || !canvas) return;

  async function cargarDatosTabla() {
    try {
      const datosTabla = await almacenaje.obtenerVoluntariados();
      tabla.innerHTML = "";

      const datosOrdenados = [...datosTabla].reverse();

      datosOrdenados.forEach((voluntariado) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
                    <td>${voluntariado.titulo || ""}</td>
                    <td>${voluntariado.email || ""}</td>
                    <td>${voluntariado.fecha || ""}</td>
                    <td>${voluntariado.descripcion || ""}</td>
                    <td>${voluntariado.tipo || ""}</td>
                    <td class="text-end">
                        <button type="button" class="btn btn-outline-danger btn-sm borrarBtn" data-id="${
                          voluntariado._id
                        }">
                            <i class="bi bi-trash"></i> Borrar
                        </button>
                    </td>`;
        tabla.appendChild(fila);
      });
      dibujarGrafico(datosTabla);
    } catch (error) {
      console.error(error);
      mostrarNotificacion("Error al conectar con el servidor", "danger");
    }
  }

  function dibujarGrafico(voluntariados) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const leyendaY = 10;
    const leyendaX = 10;
    const cuadrado = 15;

    ctx.font = "14px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "start";

    ctx.fillStyle = "#6f42c1";
    ctx.fillRect(leyendaX, leyendaY, cuadrado, cuadrado);
    ctx.fillStyle = "#000";
    ctx.fillText("Petición", leyendaX + cuadrado + 10, leyendaY + cuadrado / 2);

    ctx.fillStyle = "#198754";
    ctx.fillRect(leyendaX + 100, leyendaY, cuadrado, cuadrado);
    ctx.fillStyle = "#000";
    ctx.fillText(
      "Oferta",
      leyendaX + 100 + cuadrado + 10,
      leyendaY + cuadrado / 2
    );

    const usuarios = {};
    voluntariados.forEach((v) => {
      const email = v.email || "unknown";
      const authorName = email.split("@")[0];
      const tipo = v.tipo || v.type;
      if (!usuarios[email])
        usuarios[email] = { Petición: 0, Oferta: 0, author: authorName };
      if (tipo === "Petición" || tipo === "Oferta") usuarios[email][tipo]++;
    });

    const emails = Object.keys(usuarios);
    if (!emails.length) return;

    const maxValor =
      Math.max(
        ...emails.map((e) => Math.max(usuarios[e].Petición, usuarios[e].Oferta))
      ) || 1;
    const topMargin = 60;
    const bottomMargin = 40;
    const gap = 30;
    const barWidth = (width - (emails.length + 1) * gap) / (emails.length * 2);

    ctx.textAlign = "center";
    ctx.font = "12px Arial";

    emails.forEach((email, i) => {
      const { Petición: peticion, Oferta: oferta, author } = usuarios[email];
      const xPeticion = gap + i * (2 * barWidth + gap);
      const xOferta = xPeticion + barWidth;
      const drawHeight = height - topMargin - bottomMargin;
      const hPeticion = (peticion / maxValor) * drawHeight;
      const hOferta = (oferta / maxValor) * drawHeight;

      ctx.fillStyle = "#6f42c1";
      ctx.fillRect(
        xPeticion,
        height - hPeticion - bottomMargin,
        barWidth,
        hPeticion
      );
      ctx.fillStyle = "#198754";
      ctx.fillRect(xOferta, height - hOferta - bottomMargin, barWidth, hOferta);
      ctx.fillStyle = "#000";
      ctx.fillText(author, xPeticion + barWidth, height - bottomMargin + 15);
    });
  }

  function initListeners() {
    tabla.addEventListener("click", async (event) => {
      const btn = event.target.closest(".borrarBtn");
      if (btn) {
        if (!confirm("¿Estás seguro de borrar este voluntariado?")) return;
        try {
          await almacenaje.borrarVoluntariado(btn.dataset.id);
        } catch (error) {
          console.error("Error al borrar:", error);
          mostrarNotificacion(
            "No se pudo borrar el registro (¿Permisos?).",
            "danger"
          );
        }
      }
    });

    formulario.addEventListener("submit", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      formulario.classList.add("was-validated");

      if (formulario.checkValidity()) {
        const formData = new FormData(formulario);
        const nuevo = Object.fromEntries(formData.entries());

        try {
          await almacenaje.insertarVoluntariado(nuevo);
          formulario.classList.remove("was-validated");
          formulario.reset();
        } catch (error) {
          console.error("Error:", error);
          mostrarNotificacion("Error al guardar.", "danger");
        }
      }
    });
  }

  async function init() {
    initListeners();
    await cargarDatosTabla();
    const socket = io("https://localhost:3000", {
      transports: ["websocket", "polling"],
    });

    socket.on("nuevo_voluntariado", (nuevoDato) => {
      cargarDatosTabla();
      const titulo = nuevoDato.titulo || nuevoDato.title || "Nuevo registro";
      mostrarNotificacion(`¡Actualización! Se ha añadido: "${titulo}"`, "info");
    });

    socket.on("voluntariado_eliminado", (idEliminado) => {
      console.log(
        "🗑️ Notificación recibida: Voluntariado eliminado",
        idEliminado
      );
      cargarDatosTabla();
      mostrarNotificacion("Un voluntariado ha sido eliminado.", "warning");
    });
  }

  init();
}

document.addEventListener("DOMContentLoaded", voluntariadosPage);
