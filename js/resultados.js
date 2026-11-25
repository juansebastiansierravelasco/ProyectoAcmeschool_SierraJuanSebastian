import { guardarResultados, obtenerResultados } from "./storage.js";
import { protegerPagina } from "./auth.js";

protegerPagina()

let resultados= obtenerResultados() || [];

const listaResultados=document.getElementById("lista-resultados");
const mensajeVacio = document.getElementById("mensaje-vacio");

function mostrarResultados() {
    if (resultados.length === 0) {
    mensajeVacio.style.display = "block";
    return;
    }

    mensajeVacio.style.display = "none";

    resultados.forEach((resultado) => {
    
    const fila = document.createElement("tr");

    
    const celdaIdentificacion = document.createElement("td");
    celdaIdentificacion.textContent = resultado.identificacion;
    fila.appendChild(celdaIdentificacion);

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = resultado.nombre;
    fila.appendChild(celdaNombre);

    const celdaexamen = document.createElement("td");
    celdaexamen.textContent = resultado.tituloExamen;
    fila.appendChild(celdaexamen);

    const celdacalificacion = document.createElement("td");
    celdacalificacion.textContent = resultado.calificacion;
    fila.appendChild(celdacalificacion);

    const celdaestado = document.createElement("td");
    celdaestado.textContent = resultado.estado;
    fila.appendChild(celdaestado);

    const celdafecha = document.createElement("td");
    celdafecha.textContent = resultado.fecha;
    fila.appendChild(celdafecha);

    const celdaacciones = document.createElement("td");

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("boton-eliminar");

    celdaacciones.appendChild(botonEliminar);
    fila.appendChild(celdaacciones);
    botonEliminar.addEventListener("click", () => {
    const confirmar = confirm("¿Estás seguro de eliminar este resultado?");
    if (!confirmar) {
        return;
    }
    const resultadosActualizados = resultados.filter((elemento) => {
     
     return elemento.id !== resultado.id;
    });
    resultados = resultadosActualizados;
    guardarResultados(resultados);
    listaResultados.replaceChildren();
    mostrarResultados();

    });
    listaResultados.appendChild(fila);
});  
}
mostrarResultados()
