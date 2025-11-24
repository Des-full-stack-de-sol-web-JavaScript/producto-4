print("Iniciando script de inicialización de MongoDB...");

db = db.getSiblingDB("producto3");

db.createCollection("users");
db.createCollection("voluntariados");

db.users.deleteMany({});
db.voluntariados.deleteMany({});

const userList = [
  {
    rol: "usuario",
    nombre: "Kevin",
    email: "kevin.gomez@gmail.com",
    password: "password123"
  },
  {
    rol: "usuario",
    nombre: "Thabata",
    email: "thabata.diaz@gmail.com",
    password: "password123"
  },
  {
    rol: "usuario",
    nombre: "Anna",
    email: "anna.ruiz@gmail.com",
    password: "password123"
  },
  {
    rol: "usuario",
    nombre: "Mar",
    email: "mar.sanchez@gmail.com",
    password: "password123"
  },
  {
    rol: "usuario",
    nombre: "Pol",
    email: "pol.lopez@gmail.com",
    password: "password123"
  },
  {
    rol: "usuario",
    nombre: "Lia",
    email: "lia.martin@gmail.com",
    password: "password123"
  },
  {
    rol: "usuario",
    nombre: "Rau",
    email: "rau.perez@gmail.com",
    password: "password123"
  },
  {
    rol: "usuario",
    nombre: "Jor",
    email: "jor.fernandez@gmail.com",
    password: "password123"
  }
];

const postList = [
  {
    title: "Intercambio de idiomas: Español - Inglés",
    date: "2025-02-15",
    description: "Nativo español busca compañero para practicar inglés a nivel conversación. Ofrezco ayuda con el español.",
    author: "Kevin",
    email: "kevin.gomez@gmail.com",
    category: "Intercambio",
    type: "Oferta",
    color: "pink"
  },
  {
    title: "Voluntariado para acompañamiento a personas mayores",
    date: "2025-03-05",
    description: "Se buscan voluntarios para hacer compañía, leer o salir a pasear con personas mayores en la zona centro. No se requiere experiencia.",
    author: "Thabata",
    email: "thabata.diaz@gmail.com",
    category: "Voluntariado",
    type: "Petición",
    color: "blue"
  },
  {
    title: "Compartir coche: Viaje Madrid - Barcelona (3 plazas)",
    date: "2025-03-14",
    description: "Salida el 14/03 a las 8:00 AM. Se comparten gastos de gasolina y peajes. Maletero amplio.",
    author: "Ana",
    email: "anna.ruiz@gmail.com",
    category: "Compartir",
    type: "Oferta",
    color: "teal"
  },
  {
    title: "Busco canguro responsable para cuidar de mi gata",
    date: "2025-02-10",
    description: "Busco persona responsable para cuidar de una gata de forma ocasional. Su dueña ya no puede hacerse cargo.",
    author: "Mar",
    email: "mar.sanchez@gmail.com",
    category: "Otras",
    type: "Petición",
    color: "green"
  },
  {
    title: "Se ofrece ayuda con informática",
    date: "2025-04-05",
    description: "Te ayudo a configurar tu ordenador, instalar programas o solucionar problemas de software.",
    author: "Pol",
    email: "pol.lopez@gmail.com",
    category: "Servicios",
    type: "Oferta",
    color: "purple"
  },
  {
    title: "Intercambio: Clases de yoga por ayuda con huerto urbano",
    date: "2025-06-22",
    description: "Profesora de yoga ofrece clases privadas a cambio de ayuda semanal con el mantenimiento de su huerto urbano.",
    author: "Anna",
    email: "anna.ruiz@gmail.com",
    category: "Intercambio",
    type: "Oferta",
    color: "pink"
  },
  {
    title: "Se busca grupo para jugar fútbol los domingos",
    date: "2025-05-12",
    description: "Hombre de 30 años busca equipo o grupo para partidos de fútbol los domingos por la tarde.",
    author: "Pol",
    email: "pol.lopez@gmail.com",
    category: "Deportes",
    type: "Petición",
    color: "orange"
  },
  {
    title: "Se vende bicicleta de montaña",
    date: "2025-03-14",
    description: "Bicicleta en buen estado, freno hidráulico y cambio Shimano. Precio negociable.",
    author: "Kevin",
    email: "kevin.gomez@gmail.com",
    category: "Ventas",
    type: "Oferta",
    color: "red"
  }
];

db.users.insertMany(userList);
print(`✅ ${userList.length} usuarios insertados.`);

const voluntariadosToSeed = postList
  .map((item) => ({
    titulo: item.title,
    email: item.email,
    descripcion: item.description,
    fecha: item.date,
    tipo: item.type,
  }));

db.voluntariados.insertMany(voluntariadosToSeed);
print(`✅ ${voluntariadosToSeed.length} voluntariados insertados.`);

print("Script de inicialización finalizado.");
