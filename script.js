const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby2yi79iDIBxnQ8Zkg3RAkR21qO6oEKvBAgpan2qSM8vAKXL4I5OHwi0gfSZrJ2jHEt/exec";

let carrito = [];
let total = 0;

// Menú de ejemplo
const productos = [
  { nombre: "Hamburguesa Clásica", descripcion: "Con queso y papas", precio: 80, imagen: "https://i.imgur.com/1ZQ1Q4N.jpg" },
  { nombre: "Hot Dog Especial", descripcion: "Pan artesanal y salchicha gourmet", precio: 60, imagen: "https://i.imgur.com/7kH6g3h.jpg" },
  { nombre: "Papas Fritas", descripcion: "Crujientes y doradas", precio: 30, imagen: "https://i.imgur.com/A6Vd9Dk.jpg" },
  { nombre: "Refresco", descripcion: "Coca-Cola, Pepsi o Fanta", precio: 25, imagen: "https://i.imgur.com/XH8r5pB.jpg" }
];

// Mostrar menú
mostrarMenu(productos);

function mostrarMenu(productos) {
  const cont = document.getElementById('menu');
  cont.innerHTML = '';
  productos.forEach(p => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      <p><strong>$${p.precio}</strong></p>
      <button onclick='agregar("${p.nombre}", ${p.precio})'>Agregar</button>
    `;
    cont.appendChild(div);
  });
}

function agregar(nombre, precio) {
  carrito.push({nombre, precio});
  total += precio;
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  lista.innerHTML = carrito.map(p => `<li>${p.nombre} - $${p.precio}</li>`).join('');
  document.getElementById('total').innerText = total;
}

document.getElementById('enviarPedido').addEventListener('click', enviarPedido);

function enviarPedido() {
  const nombre = document.getElementById('cliente').value.trim();
  if (!nombre) {
    alert('Por favor, escribe tu nombre');
    return;
  }
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  const pedido = carrito.map(p => `${p.nombre} ($${p.precio})`).join(', ');

  fetch(APP_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ nombreCliente: nombre, pedido: pedido, total: total })
  })
  .then(res => res.text())
  .then(msg => {
    document.getElementById('mensaje').innerText = msg;
    carrito = [];
    total = 0;
    actualizarCarrito();
  })
  .catch(err => alert('Error al enviar el pedido'));
}
