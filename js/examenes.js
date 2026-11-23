import { protegerPagina } from "./auth.js";
import{obtenerExamenes,guardarExamenes} from "./storage.js"

protegerPagina();
let examenes = obtenerExamenes() || [];


const listaExamenes=document.getElementById("lista-examenes");


function mostrarExamenes() {

    examenes.forEach((examen)=>{

        const fila = document.createElement("tr");


        
        const celdaCodigo = document.createElement("td");
        celdaCodigo.textContent = examen.codigo;
        fila.appendChild(celdaCodigo);
        
        const celdaTitulo = document.createElement("td");
        celdaTitulo.textContent = examen.titulo;
        fila.appendChild(celdaTitulo);
        
        const celdaTiempo = document.createElement("td");
        celdaTiempo.textContent = examen.tiempo;
        fila.appendChild(celdaTiempo);
        
        const celdaPorcentaje = document.createElement("td");
        celdaPorcentaje.textContent = examen.porcentaje;
        fila.appendChild(celdaPorcentaje);
        
        const celdaDescripcion = document.createElement("td");
        celdaDescripcion.textContent = examen.descripcion;
        fila.appendChild(celdaDescripcion);

        const celdaAcciones = document.createElement("td");
        fila.appendChild(celdaAcciones);

        listaExamenes.appendChild(fila);

    })
    
}

mostrarExamenes();