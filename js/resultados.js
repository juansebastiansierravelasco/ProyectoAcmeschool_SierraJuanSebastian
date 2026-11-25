import { guardarResultados,obtenerResultados } from "./storage";
import { protegerPagina } from "./auth.js";

protegerPagina()

let resultados= obtenerResultados() || [];

const listaResultados=document.getElementById("lista-resultados");

function mostrarResultados() {

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

    const celdaacciones=document.createElement("td");
    fila.appendChild(celdaacciones);

    const botonEliminar=document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    celdaacciones.appendChild(botonEliminar);
    fila.appendChild(celdaacciones);
    listaResultados.appendChild(fila);



});
    
}
