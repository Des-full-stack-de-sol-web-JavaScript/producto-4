export function mostrarNotificacion(mensaje, tipo = 'success', containerId = 'mensaje-sistema') {
    let container = document.getElementById(containerId);

    if (!container) {
        let floatingContainer = document.getElementById('toast-container-global');
        if (!floatingContainer) {
            floatingContainer = document.createElement('div');
            floatingContainer.id = 'toast-container-global';
            Object.assign(floatingContainer.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '9999',
                width: '320px',
                pointerEvents: 'none' 
            });
            document.body.appendChild(floatingContainer);
        }
        container = floatingContainer;
    }

    const alertHtml = `
        <div class="alert alert-${tipo} alert-dismissible fade show shadow" role="alert" style="pointer-events: auto;">
            <div class="d-flex align-items-center">
                <i class="bi ${tipo === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill'} fs-4 me-2"></i>
                <div>${mensaje}</div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = alertHtml;
    const alertElement = wrapper.firstElementChild;

    if (container.id === 'toast-container-global') {
        container.appendChild(alertElement);
    } else {
        container.innerHTML = ''; 
        container.appendChild(alertElement);
    }

    setTimeout(() => {
        if (alertElement && document.body.contains(alertElement)) {
            alertElement.classList.remove('show');
            setTimeout(() => alertElement.remove(), 150);
        }
    }, 4000);
}