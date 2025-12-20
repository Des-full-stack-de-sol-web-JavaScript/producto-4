import { almacenaje } from './almacenaje.js';
// import { dashboardData } ya no es necesario aquí

function voluntariadosPage() {
    console.log("Cargando página de Voluntariados desde el Backend..");

    const tabla = document.getElementById("tablaVoluntariado");
    const formulario = document.getElementById("formulario");
    const canvas = document.getElementById("graficoVoluntariados");
    const mensajeContainer = document.getElementById("mensaje-sistema");

    if (!tabla || !formulario || !canvas) return;

    // --- Notificaciones Visuales (Toast) ---
    function mostrarNotificacion(mensaje, tipo = 'success') {
        if (!mensajeContainer) return;
        mensajeContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
                <div class="d-flex align-items-center">
                    <i class="bi ${tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} fs-4 me-2"></i>
                    <div>${mensaje}</div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        setTimeout(() => {
            const alerta = mensajeContainer.querySelector('.alert');
            if (alerta) {
                alerta.classList.remove('show');
                setTimeout(() => mensajeContainer.innerHTML = '', 150);
            }
        }, 4000);
    }

    async function cargarDatosTabla() {
        try {
            const datosTabla = await almacenaje.obtenerVoluntariados();
            tabla.innerHTML = "";

            datosTabla.forEach((voluntariado) => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${voluntariado.titulo || ''}</td>
                    <td>${voluntariado.email || ''}</td>
                    <td>${voluntariado.fecha || ''}</td>
                    <td>${voluntariado.descripcion || ''}</td>
                    <td>${voluntariado.tipo || ''}</td>
                    <td class="text-end">
                        <button type="button" class="btn btn-outline-danger btn-sm borrarBtn" data-id="${voluntariado._id}">
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
        ctx.fillText("Oferta", leyendaX + 100 + cuadrado + 10, leyendaY + cuadrado / 2);

        const usuarios = {};
        voluntariados.forEach(v => {
            const email = v.email || 'unknown';
            const authorName = email.split('@')[0];
            if (!usuarios[email]) usuarios[email] = { Petición: 0, Oferta: 0, author: authorName };
            if (v.tipo === 'Petición' || v.tipo === 'Oferta') usuarios[email][v.tipo]++;
        });

        const emails = Object.keys(usuarios);
        if (!emails.length) return;

        const maxValor = Math.max(...emails.map(e => Math.max(usuarios[e].Petición, usuarios[e].Oferta))) || 1;
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
             ctx.fillRect(xPeticion, height - hPeticion - bottomMargin, barWidth, hPeticion);
             ctx.fillStyle = "#198754";
             ctx.fillRect(xOferta, height - hOferta - bottomMargin, barWidth, hOferta);
             ctx.fillStyle = "#000";
             ctx.fillText(author, xPeticion + barWidth, height - bottomMargin + 15);
        });
    }

    function initListeners() {
        // Listener Borrar
        tabla.addEventListener("click", async (event) => {
            const btn = event.target.closest(".borrarBtn");
            if (btn) {
                if(!confirm("¿Estás seguro de borrar este voluntariado?")) return;
                try {
                    await almacenaje.borrarVoluntariado(btn.dataset.id);
                    await cargarDatosTabla();
                    mostrarNotificacion("Voluntariado eliminado correctamente.", "warning");
                } catch (error) {
                    console.error("Error al borrar:", error);
                    mostrarNotificacion("No se pudo borrar el registro (¿Permisos?).", "danger");
                }
            }
        });


        formulario.addEventListener("submit", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            formulario.classList.add('was-validated');

            if (formulario.checkValidity()) {
                const formData = new FormData(formulario);
                const nuevo = Object.fromEntries(formData.entries());
                
                // NOTA: Asegúrate de que los 'name' en tu HTML sean: 
                // titulo, email, fecha, descripcion, tipo
                // O el almacenaje.js hará el mapeo si usas los nombres en inglés.

                try {
                    await almacenaje.insertarVoluntariado(nuevo);
                    formulario.classList.remove("was-validated");
                    formulario.reset();
                    await cargarDatosTabla();
                    mostrarNotificacion("¡Voluntariado creado en el servidor!", "success");
                } catch (error) {
                    console.error("Error:", error);
                    mostrarNotificacion("Error al guardar (¿Estás logueado?)", "danger");
                }
            }
        });
    }

    async function init() {
        initListeners();
        await cargarDatosTabla();
    }

    init();
}

document.addEventListener('DOMContentLoaded', voluntariadosPage);