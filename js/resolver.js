
import { obtenerExamenes } from "./storage.js";

// 1. Obtener los exámenes guardados
let examenes = obtenerExamenes() || [];

// 2. Variables de control
let examenActual = null;
let identificacionEstudiante = "";
let nombreEstudiante = "";
let intervaloTiempo = null;
let segundosRestantes = 0;
let examenFinalizado = false;

// 3. Obtener elementos del HTML
const selectorExamen = document.getElementById("examen-disponible");
const campoIdentificacion = document.getElementById("identificacion-estudiante");
const campoNombre = document.getElementById("nombre-estudiante");
const botonComenzar = document.getElementById("comenzar-examen");

const seccionSeleccion = document.getElementById("seccion-seleccion");
const seccionResolver = document.getElementById("seccion-resolver");
const seccionResultado = document.getElementById("seccion-resultado");

const tituloExamen = document.getElementById("titulo-examen");
const descripcionExamen = document.getElementById("descripcion-examen");
const listaPreguntas = document.getElementById("lista-preguntas-resolver");

const formularioRespuestas = document.getElementById("formulario-respuestas");
const tiempoRestante = document.getElementById("tiempo-restante");

const nombreResultado = document.getElementById("nombre-resultado");
const identificacionResultado = document.getElementById("identificacion-resultado");
const notaResultado = document.getElementById("nota-resultado");
const estadoResultado = document.getElementById("estado-resultado");

// 4. Ocultar las secciones iniciales
seccionResolver.style.display = "none";
seccionResultado.style.display = "none";

// 5. Validar que la identificación contenga únicamente números
campoIdentificacion.addEventListener("input", () => {
    campoIdentificacion.value = campoIdentificacion.value.replace(/[^0-9]/g, "");
});

// 6. Mostrar los exámenes disponibles
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

// 7. Mostrar las preguntas
function mostrarPreguntas(examen) {
    listaPreguntas.replaceChildren();

    examen.preguntas.forEach((pregunta, indice) => {
        const contenedor = document.createElement("div");
        contenedor.classList.add("pregunta-resolver");

        const enunciado = document.createElement("h3");
        enunciado.textContent = `Pregunta ${indice + 1}: ${pregunta.enunciado}`;

        contenedor.appendChild(enunciado);

        pregunta.respuestas.forEach((respuesta, posicion) => {
            const etiqueta = document.createElement("label");
            etiqueta.classList.add("opcion-respuesta");

            const opcion = document.createElement("input");

            opcion.type = "radio";
            opcion.name = `pregunta-${indice}`;
            opcion.value = posicion;
            opcion.required = true;

            const texto = document.createElement("span");
            texto.textContent = respuesta.descripcion;

            etiqueta.appendChild(opcion);
            etiqueta.appendChild(texto);

            contenedor.appendChild(etiqueta);
        });

        listaPreguntas.appendChild(contenedor);
    });
}

// 8. Formatear el tiempo
function actualizarTiempo() {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;

    const minutosTexto = String(minutos).padStart(2, "0");
    const segundosTexto = String(segundos).padStart(2, "0");

    tiempoRestante.textContent = `${minutosTexto}:${segundosTexto}`;
}

// 9. Iniciar temporizador
function iniciarTemporizador() {
    segundosRestantes = Number(examenActual.tiempo) * 60;

    actualizarTiempo();

    intervaloTiempo = setInterval(() => {
        segundosRestantes--;

        actualizarTiempo();

        if (segundosRestantes <= 0) {
            clearInterval(intervaloTiempo);

            alert("Se terminó el tiempo del examen.");

            finalizarExamen();
        }
    }, 1000);
}

// 10. Comenzar examen
botonComenzar.addEventListener("click", () => {
    identificacionEstudiante = campoIdentificacion.value.trim();
    nombreEstudiante = campoNombre.value.trim();

    const codigoSeleccionado = selectorExamen.value;

    if (identificacionEstudiante === "") {
        alert("Debes ingresar tu número de identificación.");
        return;
    }

    if (!/^[0-9]+$/.test(identificacionEstudiante)) {
        alert("La identificación debe contener únicamente números.");
        return;
    }

    if (nombreEstudiante === "") {
        alert("Debes ingresar tu nombre completo.");
        return;
    }

    if (codigoSeleccionado === "") {
        alert("Debes seleccionar un examen.");
        return;
    }

    examenActual = examenes.find((examen) => {
        return examen.codigo === codigoSeleccionado;
    });

    if (!examenActual) {
        alert("No se encontró el examen seleccionado.");
        return;
    }

    if (!Array.isArray(examenActual.preguntas) ||
        examenActual.preguntas.length === 0) {
        alert("Este examen todavía no tiene preguntas.");
        return;
    }

    if (!Number.isFinite(Number(examenActual.tiempo)) ||
        Number(examenActual.tiempo) <= 0) {
        alert("El tiempo del examen no es válido.");
        return;
    }

    tituloExamen.textContent = examenActual.titulo;
    descripcionExamen.textContent = examenActual.descripcion;

    mostrarPreguntas(examenActual);

    examenFinalizado = false;

    seccionSeleccion.style.display = "none";
    seccionResolver.style.display = "block";

    iniciarTemporizador();
});

// 11. Finalizar y calificar examen
function finalizarExamen() {
    if (examenFinalizado || !examenActual) {
        return;
    }

    examenFinalizado = true;

    clearInterval(intervaloTiempo);

    let respuestasCorrectas = 0;

    examenActual.preguntas.forEach((pregunta, indice) => {
        const respuestaSeleccionada = formularioRespuestas.querySelector(
            `input[name="pregunta-${indice}"]:checked`
        );

        if (respuestaSeleccionada) {
            const posicion = Number(respuestaSeleccionada.value);

            if (pregunta.respuestas[posicion].correcta === true) {
                respuestasCorrectas++;
            }
        }
    });

    const totalPreguntas = examenActual.preguntas.length;

    const calificacion = Math.round(
        (respuestasCorrectas / totalPreguntas) * 100
    );

    const aprobado = calificacion >= Number(examenActual.porcentaje);

    nombreResultado.textContent = `Estudiante: ${nombreEstudiante}`;

    identificacionResultado.textContent =
        `Identificación: ${identificacionEstudiante}`;

    notaResultado.textContent =
        `Calificación: ${calificacion}% (${respuestasCorrectas} de ${totalPreguntas} respuestas correctas)`;

    if (aprobado) {
        estadoResultado.textContent = "¡Aprobado!";
    } else {
        estadoResultado.textContent = "No aprobado.";
    }

    seccionResolver.style.display = "none";
    seccionResultado.style.display = "block";
}

// 12. Evento para finalizar manualmente
formularioRespuestas.addEventListener("submit", (evento) => {
    evento.preventDefault();

    finalizarExamen();
});

// 13. Cargar exámenes al abrir la página
mostrarExamenes();
