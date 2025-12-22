export function dashboardCard(item) {
  let accentColor = '#0d6efd'; 
  if (item.tipo === 'Petición') accentColor = '#6f42c1'; 
  if (item.tipo === 'Oferta') accentColor = '#198754';   

  // Contenedor de columna Bootstrap (Responsive)
  const cardColumn = document.createElement('div');
  cardColumn.className = 'col-12 col-md-6 dashboard-card-wrapper';

  cardColumn.innerHTML = `
    <div class="card">
      <div class="accent" style="background-color: ${accentColor};"></div>
      
      <div class="body">
        <h3 class="title">${item.titulo}</h3>
        <p class="date">${new Date(item.fecha).toLocaleDateString()}</p>
        <p class="description">${item.descripcion}</p>
        
        <div class="meta">
          <p>
            <span class="meta-label">Publicado por:</span> ${item.author || 'Anónimo'}
          </p>
          <p>
            <span class="meta-label">Categoría:</span> 
            <span class="badge">${item.category || item.tipo}</span>
          </p>
          <p>
            <span class="meta-label">Email:</span> ${item.email}
          </p>
        </div>
      </div>
    </div>
  `;

  const card = cardColumn.querySelector('.card');
  card.style.cursor = 'grab';

  return cardColumn;
}