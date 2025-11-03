// URL de tu Apps Script publicado como Web App
const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby2yi79iDIBxnQ8Zkg3RAkR21qO6oEKvBAgpan2qSM8vAKXL4I5OHwi0gfSZrJ2jHEt/exec";

let carrito = [];
let total = 0;

// Cargar menú desde Google Sheets vía Apps Script
fetch(APP_SCRIPT_URL)
  .then(res => res.json())
  .then(productos => mostrarMenu(productos))
  .catch(err => document.getElementById('menu').innerHTML = 'Error al cargar el menú');

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