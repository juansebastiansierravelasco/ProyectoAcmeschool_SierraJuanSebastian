
import { obtenerExamenes } from "./storage.js";

// 1. Obtener los exámenes guardados
let examenes = obtenerExamenes() || [];

// 2. Obtener elementos del HTML
const selectorExamen = document.getElementById("examen-disponible");
const campoIdentificacion = document.getElementById("identificacion-estudiante");
const campoNombre = document.getElementById("nombre-estudiante");
const botonComenzar = document.getElementById("comenzar-examen");

botonComenzar.addEventListener("click", () => {

    const identificacion = campoIdentificacion.value.trim();
    const nombre = campoNombre.value.trim();
    const codigoSeleccionado = selectorExamen.value;

});

// 3. Mostrar los exámenes disponibles
function mostrarExamenes() {

    selectorExamen.replaceChildren();

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "Selecciona un examen";

    selectorExamen.appendChild(opcionInicial);

    examenes.forEach((examen) => {

        const opcion = document.createElement("option");

        opcion.value = examen.codigo;
        opcion.textContent = examen.titulo;

        selectorExamen.appendChild(opcion);

    });

}

// 4. Cargar los exámenes al abrir la página
mostrarExamenes();
