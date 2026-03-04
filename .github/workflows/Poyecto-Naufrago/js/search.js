async function buscar() {

    const q = document.querySelector("#searchInput").value;

    const response = await fetch(`http://localhost:3000/api/buscar?q=${q}`);
    const data = await response.json();

    mostrarResultados(data);
}

function mostrarResultados(data) {

    const contenedor = document.querySelector("#resultados");
    contenedor.innerHTML = "";

    data.forEach(item => {

        const div = document.createElement("div");
        div.innerHTML = `
            <p><strong>${item.cliente}</strong></p>
            <p>${item.categoria} - ${item.estado}</p>
            <hr>
        `;

        contenedor.appendChild(div);
    });
}