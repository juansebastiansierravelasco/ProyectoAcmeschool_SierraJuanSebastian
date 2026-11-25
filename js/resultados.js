import { guardarResultados,obtenerResultados } from "./storage";
import { protegerPagina } from "./auth.js";

protegerPagina()

let resultados= obtenerResultados() || [];

const listaResultados=document.getElementById("lista-resultados");

function mostrarResultados() {

    resultados.forEach((resultado) => {

});
    
}
