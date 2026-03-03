// ===============================
// MÓDULO UI - Manipulación DOM
// ===============================

export const UIModule = {

    renderOrders(orders) {

        const lista = document.querySelector("#listaPedidos");
        lista.innerHTML = "";

        orders.forEach(order => {

            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.id = order.id;

            if (order.estado === "Listo") {
                card.classList.add("completado");
            }

            card.innerHTML = `
                <h3>${order.cliente}</h3>
                <p>Tipo: ${order.tipo}</p>
                <p>Estado: ${order.estado}</p>
                <small>${new Date(order.fecha).toLocaleString()}</small>
                <div>
                    <button class="editar">Editar</button>
                    <button class="eliminar">Eliminar</button>
                </div>
            `;

            lista.appendChild(card);
        });
    },

    showMessage(texto, tipo="success") {
        const mensaje = document.querySelector("#mensaje");
        mensaje.textContent = texto;
        mensaje.className = tipo;

        setTimeout(() => mensaje.textContent = "", 2000);
    }
};