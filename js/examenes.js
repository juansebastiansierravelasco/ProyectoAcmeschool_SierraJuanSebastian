import { protegerPagina } from "./auth.js";
import{obtenerExamenes,guardarExamenes} from "./storage.js"

protegerPagina();
let examenes = obtenerExamenes() || [];


const listaExamenes=document.getElementById("lista-examenes");
const botonRegistrar=document.getElementById("registrar-examen")
const formularioRegistro=document.getElementById("formulario-registro")
const botonCancelar=document.getElementById("cancelar-examen")
const formularioExamen = document.getElementById("formulario-examen");
botonRegistrar.addEventListener("click", () => {
    formularioRegistro.style.display = "block";
});

botonCancelar.addEventListener("click", () => {
    formularioExamen.reset();
    formularioRegistro.style.display = "none";
});

formularioExamen.addEventListener("submit", (evento) => {
evento.preventDefault();

const codigo=document.getElementById("codigo").value;
const titulo=document.getElementById("titulo").value;
const tiempo=Number(document.getElementById("tiempo").value);
const porcentaje=Number(document.getElementById("porcentaje").value);
const descripcion=document.getElementById("descripcion").value;

const nuevoExamen = {
    codigo: codigo,
    titulo: titulo,
    tiempo: tiempo,
    porcentaje: porcentaje,
    descripcion: descripcion
};

const examenExiste = examenes.some((examen) => {
    return String(examen.codigo).trim().toLowerCase() === codigo.trim().toLowerCase();
});

if (examenExiste) {
    alert("Ya existe un examen con ese código.");
    return;
}


examenes.push(nuevoExamen);
guardarExamenes(examenes);
listaExamenes.replaceChildren();
mostrarExamenes();
formularioExamen.reset();
formularioRegistro.style.display = "none";

});

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