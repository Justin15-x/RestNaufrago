// MATRIZ DE PRODUCTOS
const productos = {
  comida: [
    { name: "Taco pulpo", price: 59.00 },
    { name: "Taco Naufrago", price: 65.00 },
    { name: "Quesadillas", price: 40.00 },
    { name: "Hamburguesa", price: 85.00 },
  ],
  bebidas: [
    { name: "Coca Cola", price: 25.00 },
    { name: "Agua Natural", price: 15.00 },
    { name: "Naranjada", price: 30.00 },
    { name: "Té Helado", price: 25.00 },
    { name: "Limonada", price: 22.00 },
    { name: "Cerveza", price: 35.00 },
    { name: "Agua de Horchata", price: 20.00 },
    { name: "Smoothie", price: 45.00 },
  ]
};

// DATOS DE MESAS
function cargarMesas() {
  const mesasGuardadas = localStorage.getItem("mesas");
  if (mesasGuardadas) {
    return JSON.parse(mesasGuardadas);
  }
  return [
    { id: 1, nombre: "", orders: [] },
    { id: 2, nombre: "", orders: [] },
    { id: 3, nombre: "", orders: [] },
    { id: 4, nombre: "", orders: [] }
  ];
}

function guardarMesas() {
  localStorage.setItem("mesas", JSON.stringify(mesas));
}

const mesas = cargarMesas();
const contenedor = document.getElementById("mesas");

function renderMesas() {
  contenedor.innerHTML = "";
  
  mesas.forEach((mesa, mesaIndex) => {
    const div = document.createElement("div");
    div.className = "mesa";
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h2 style="margin: 0;">Mesa ${mesa.id}</h2>
        <button class="btn btn-ghost eliminar-mesa" style="color: #dc3545; border-color: #dc3545;">✕ Eliminar Mesa</button>
      </div>
      <input class="input nombre-mesa" placeholder="Nombre del cliente (opcional)" value="${mesa.nombre || ''}" style="margin-bottom: 15px;">
      <table ${mesa.orders.length === 0 ? 'style="display:none"' : ""}>
        <thead>
          <tr>
            <th>Cant.</th>
            <th>Platillo</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <p class="empty" ${mesa.orders.length ? 'style="display:none"' : ""}>Mesa vacía</p>
      <div class="footer">
        <div><strong>Total:</strong> <span class="total">$0.00</span></div>
        <div>
          <button class="btn btn-ghost vaciar">Vaciar</button>
          <button class="btn btn-primary imprimir">Imprimir</button>
        </div>
      </div>
      <div class="add-section">
        <div class="search-container">
          <input class="input buscar" placeholder="🔍 Buscar producto..." autocomplete="off">
          <div class="search-results" style="display:none"></div>
        </div>
        <input class="input cantidad" type="number" min="1" value="1" placeholder="Cantidad">
      </div>
    `;
    contenedor.appendChild(div);

    // Referencias
    const tbody = div.querySelector("tbody");
    const totalSpan = div.querySelector(".total");
    const tabla = div.querySelector("table");
    const emptyMsg = div.querySelector(".empty");
    const buscarInput = div.querySelector(".buscar");
    const searchResults = div.querySelector(".search-results");
    const cantidadInput = div.querySelector(".cantidad");
    const nombreMesaInput = div.querySelector(".nombre-mesa");

    // Guardar nombre de mesa al cambiar
    nombreMesaInput.addEventListener("input", (e) => {
      mesa.nombre = e.target.value;
      guardarMesas();
    });

    // ELIMINAR MESA
    div.querySelector(".eliminar-mesa").addEventListener("click", () => {
      if (mesa.orders.length > 0) {
        if (!confirm("Esta mesa tiene órdenes. ¿Estás seguro de eliminarla?")) {
          return;
        }
      }
      if (mesas.length <= 1) {
        alert("Debe haber al menos una mesa");
        return;
      }
      if (confirm(`¿Eliminar Mesa ${mesa.id}?`)) {
        mesas.splice(mesaIndex, 1);
        // Reordenar IDs
        mesas.forEach((m, idx) => {
          m.id = idx + 1;
        });
        guardarMesas();
        renderMesas();
      }
    });

    // RENDER DE ÓRDENES
    function renderOrdenes() {
      tbody.innerHTML = "";
      if (mesa.orders.length === 0) {
        tabla.style.display = "none";
        emptyMsg.style.display = "block";
      } else {
        tabla.style.display = "table";
        emptyMsg.style.display = "none";
        
        mesa.orders.forEach((orden, idx) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>
              <div class="qty-controls">
                <button class="btn btn-ghost btn-dec" data-idx="${idx}">-</button>
                <span>${orden.qty}</span>
                <button class="btn btn-ghost btn-inc" data-idx="${idx}">+</button>
              </div>
            </td>
            <td>${orden.name}</td>
            <td>$${(orden.qty * orden.price).toFixed(2)}</td>
            <td><button class="btn btn-ghost btn-del" data-idx="${idx}">Eliminar</button></td>
          `;
          
          tbody.appendChild(tr);
        });

        // Event listeners para todos los botones de la tabla
                  tbody.querySelectorAll(".btn-inc").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const idx = parseInt(e.target.getAttribute("data-idx"));
            mesa.orders[idx].qty++;
            guardarMesas();
            renderOrdenes();
          });
        });

        tbody.querySelectorAll(".btn-dec").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const idx = parseInt(e.target.getAttribute("data-idx"));
            if (mesa.orders[idx].qty > 1) {
              mesa.orders[idx].qty--;
              guardarMesas();
              renderOrdenes();
            } else {
              if (confirm("¿Eliminar platillo?")) {
                mesa.orders.splice(idx, 1);
                guardarMesas();
                renderOrdenes();
              }
            }
          });
        });

        tbody.querySelectorAll(".btn-del").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const idx = parseInt(e.target.getAttribute("data-idx"));
            if (confirm("¿Eliminar platillo?")) {
              mesa.orders.splice(idx, 1);
              guardarMesas();
              renderOrdenes();
            }
          });
        });
      }
      totalSpan.textContent = "$" + calcTotal(mesa).toFixed(2);
    }

    renderOrdenes();

    // BÚSQUEDA DE PRODUCTOS
    function buscarProductos(query) {
      if (!query.trim()) return { comida: [], bebidas: [] };
      
      const q = query.toLowerCase();
      return {
        comida: productos.comida.filter(p => 
          p.name.toLowerCase().includes(q)
        ),
        bebidas: productos.bebidas.filter(p => 
          p.name.toLowerCase().includes(q)
        )
      };
    }

    function mostrarResultados(resultados) {
      searchResults.innerHTML = "";
      
      const hayResultados = resultados.comida.length > 0 || resultados.bebidas.length > 0;
      
      if (!hayResultados) {
        searchResults.style.display = "none";
        return;
      }

      if (resultados.comida.length > 0) {
        const categoriaDiv = document.createElement("div");
        categoriaDiv.className = "search-category";
        categoriaDiv.textContent = "🍽️ Comida";
        searchResults.appendChild(categoriaDiv);

        resultados.comida.forEach(producto => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "search-item";
          itemDiv.innerHTML = `
            <div class="search-item-name">${producto.name}</div>
            <div class="search-item-price">$${producto.price.toFixed(2)}</div>
          `;
          itemDiv.addEventListener("click", () => agregarProducto(producto));
          searchResults.appendChild(itemDiv);
        });
      }

      if (resultados.bebidas.length > 0) {
        const categoriaDiv = document.createElement("div");
        categoriaDiv.className = "search-category";
        categoriaDiv.textContent = "🥤 Bebidas";
        searchResults.appendChild(categoriaDiv);

        resultados.bebidas.forEach(producto => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "search-item";
          itemDiv.innerHTML = `
            <div class="search-item-name">${producto.name}</div>
            <div class="search-item-price">$${producto.price.toFixed(2)}</div>
          `;
          itemDiv.addEventListener("click", () => agregarProducto(producto));
          searchResults.appendChild(itemDiv);
        });
      }

      searchResults.style.display = "block";
    }

    function agregarProducto(producto) {
      const qty = parseInt(cantidadInput.value) || 1;
      
      const existing = mesa.orders.find(
        o => o.name === producto.name && o.price === producto.price
      );

      if (existing) {
        existing.qty += qty;
      } else {
        mesa.orders.push({
          qty: qty,
          name: producto.name,
          price: producto.price
        });
      }

      buscarInput.value = "";
      cantidadInput.value = 1;
      searchResults.style.display = "none";
      guardarMesas();
      renderOrdenes();
    }

    // EVENTOS DE BÚSQUEDA
    buscarInput.addEventListener("input", (e) => {
      const resultados = buscarProductos(e.target.value);
      mostrarResultados(resultados);
    });

    buscarInput.addEventListener("focus", (e) => {
      if (e.target.value.trim()) {
        const resultados = buscarProductos(e.target.value);
        mostrarResultados(resultados);
      }
    });

    // Cerrar resultados al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!div.contains(e.target)) {
        searchResults.style.display = "none";
      }
    });

    // VACIAR MESA
    div.querySelector(".vaciar").addEventListener("click", () => {
      if (mesa.orders.length && confirm("¿Vaciar mesa?")) {
        mesa.orders = [];
        guardarMesas();
        renderOrdenes();
      }
    });

    // IMPRIMIR TICKET
    div.querySelector(".imprimir").addEventListener("click", () => {
      if (!mesa.orders.length) {
        alert("No hay órdenes para imprimir");
        return;
      }

      // Separar órdenes por categoría
      const comidasOrden = [];
      const bebidasOrden = [];

      mesa.orders.forEach(orden => {
        // Verificar si el producto está en comida
        const esComida = productos.comida.some(p => p.name === orden.name);
        
        if (esComida) {
          comidasOrden.push(orden);
        } else {
          bebidasOrden.push(orden);
        }
      });

      const w = window.open("", "_blank", "width=800,height=600");
      w.document.write(`
        <html>
          <head>
            <title>Ticket Mesa ${mesa.id}</title>
            <style>
              body { 
                font-family: monospace; 
                padding: 20px;
                display: flex;
                gap: 40px;
              }
              .seccion {
                flex: 1;
                border: 2px solid #333;
                padding: 20px;
                page-break-after: always;
              }
              h2 { 
                text-align: center; 
                border-bottom: 3px double #333;
                padding-bottom: 10px;
              }
              h3 {
                text-align: center;
                margin-top: 0;
              }
              .cliente {
                text-align: center;
                font-size: 0.9em;
                color: #666;
                margin-bottom: 10px;
              }
              ul { 
                list-style: none; 
                padding: 0;
                margin: 20px 0;
              }
              li { 
                margin: 10px 0; 
                border-bottom: 1px dashed #ccc; 
                padding-bottom: 5px; 
              }
              .total { 
                font-size: 1.2em; 
                font-weight: bold; 
                margin-top: 20px; 
                text-align: right;
                border-top: 2px solid #333;
                padding-top: 10px;
              }
              .vacio {
                text-align: center;
                color: #999;
                padding: 40px 0;
              }
              @media print {
                body {
                  display: block;
                }
                .seccion {
                  page-break-after: always;
                  border: none;
                  padding: 0;
                }
                .seccion:last-child {
                  page-break-after: auto;
                }
              }
            </style>
          </head>
          <body>
            <div class="seccion">
              <h2>🍽️ COCINA</h2>
              <h3>Mesa ${mesa.id}</h3>
              ${mesa.nombre ? `<div class="cliente">Cliente: ${mesa.nombre}</div>` : ''}
              <hr>
      `);

      if (comidasOrden.length === 0) {
        w.document.write('<p class="vacio">Sin órdenes de comida</p>');
      } else {
        w.document.write("<ul>");
        comidasOrden.forEach(o => {
          w.document.write(`<li>${o.qty} x ${o.name} - ${(o.qty * o.price).toFixed(2)}</li>`);
        });
        w.document.write("</ul>");
        const totalComida = comidasOrden.reduce((sum, o) => sum + (o.qty * o.price), 0);
        w.document.write(`<div class="total">SUBTOTAL COMIDA: ${totalComida.toFixed(2)}</div>`);
      }

      w.document.write(`
            </div>
            <div class="seccion">
              <h2>🥤 BARRA</h2>
              <h3>Mesa ${mesa.id}</h3>
              ${mesa.nombre ? `<div class="cliente">Cliente: ${mesa.nombre}</div>` : ''}
              <hr>
      `);

      if (bebidasOrden.length === 0) {
        w.document.write('<p class="vacio">Sin órdenes de bebidas</p>');
      } else {
        w.document.write("<ul>");
        bebidasOrden.forEach(o => {
          w.document.write(`<li>${o.qty} x ${o.name} - ${(o.qty * o.price).toFixed(2)}</li>`);
        });
        w.document.write("</ul>");
        const totalBebidas = bebidasOrden.reduce((sum, o) => sum + (o.qty * o.price), 0);
        w.document.write(`<div class="total">SUBTOTAL BEBIDAS: ${totalBebidas.toFixed(2)}</div>`);
      }

      w.document.write(`
            </div>
          </body>
        </html>
      `);

      w.document.write(`
        <div style="position: fixed; bottom: 20px; right: 20px; background: #007bff; color: white; padding: 15px 30px; border-radius: 5px; cursor: pointer; font-family: Arial;" onclick="window.print()">
          🖨️ IMPRIMIR
        </div>
      `);
      
      w.document.close();
      setTimeout(() => w.print(), 250);
    });
  });
}

// CALCULAR TOTAL
function calcTotal(mesa) {
  return mesa.orders.reduce((sum, o) => sum + (o.qty * o.price), 0);
}

// AGREGAR NUEVA MESA
function agregarNuevaMesa() {
  const nuevoId = mesas.length > 0 ? Math.max(...mesas.map(m => m.id)) + 1 : 1;
  mesas.push({
    id: nuevoId,
    nombre: "",
    orders: []
  });
  guardarMesas();
  renderMesas();
}

// INICIAR
renderMesas();