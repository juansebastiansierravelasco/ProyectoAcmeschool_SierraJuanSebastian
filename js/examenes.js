import { protegerPagina } from "./auth.js";
import { obtenerExamenes, guardarExamenes } from "./storage.js";
// 1. Proteger la página
protegerPagina();

// 2. Obtener los exámenes guardados
let examenes = obtenerExamenes() || [];
let codigoOriginal = null;

// Asegurar que todos los exámenes tengan un arreglo de preguntas
examenes.forEach((examen) => {
    if (!Array.isArray(examen.preguntas)) {
        examen.preguntas = [];
    }
});

// 3. Obtener elementos del HTML
const listaExamenes = document.getElementById("lista-examenes");
const botonRegistrar = document.getElementById("registrar-examen");
const formularioRegistro = document.getElementById("formulario-registro");
const botonCancelar = document.getElementById("cancelar-examen");
const formularioExamen = document.getElementById("formulario-examen");

const selectorExamen = document.getElementById("examen-seleccionado");
const botonAgregarPregunta = document.getElementById("agregar-pregunta");
const formularioPregunta = document.getElementById("formulario-pregunta");
const formularioPreguntaForm = document.getElementById("formulario-pregunta-form");
const campoEnunciado = document.getElementById("enunciado-pregunta");
const botonCancelarPregunta = document.getElementById("cancelar-pregunta");

const botonAgregarRespuesta = document.getElementById("agregar-respuesta");
const listaRespuestas = document.getElementById("lista-respuestas");

const listaPreguntas = document.getElementById("lista-preguntas");

// Ocultar inicialmente el formulario de preguntas
formularioPregunta.style.display = "none";

// --------------------------------------------------
// 4. Mostrar exámenes en el selector
// --------------------------------------------------

function mostrarExamenesEnSelector() {

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

// --------------------------------------------------
// 4.5. Mostrar las preguntas
// --------------------------------------------------

function mostrarPreguntas() {

    listaPreguntas.replaceChildren();

    const codigoSeleccionado = selectorExamen.value;

    const examenSeleccionado = examenes.find((examen) => {
        return examen.codigo === codigoSeleccionado;
    });

    if (!examenSeleccionado) {
        return;
    }

    examenSeleccionado.preguntas.forEach((pregunta, indice) => {

        const contenedor = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent = `Pregunta ${indice + 1}: ${pregunta.enunciado}`;

        contenedor.appendChild(titulo);

        pregunta.respuestas.forEach((respuesta) => {

            const opcion = document.createElement("p");

            opcion.textContent = respuesta.descripcion;

            if (respuesta.correcta) {
                opcion.textContent += " (Respuesta correcta)";
            }

            contenedor.appendChild(opcion);

        });

        listaPreguntas.appendChild(contenedor);

    });

}

selectorExamen.addEventListener("change", () => {

    mostrarPreguntas();

});

// --------------------------------------------------
// 5. Mostrar el formulario de preguntas
// --------------------------------------------------

botonAgregarPregunta.addEventListener("click", () => {

    if (selectorExamen.value === "") {
        alert("Primero debes seleccionar un examen.");
        return;
    }

    formularioPregunta.style.display = "block";

});

// --------------------------------------------------
// 6. Agregar respuestas
// --------------------------------------------------

function agregarRespuesta() {

    const contenedor = document.createElement("div");

    const respuesta = document.createElement("input");
    respuesta.type = "text";
    respuesta.placeholder = "Escribe una respuesta";
    respuesta.required = true;

    const correcta = document.createElement("input");
    correcta.type = "radio";
    correcta.name = "respuesta-correcta";
    correcta.required = true;

    const etiqueta = document.createElement("label");
    etiqueta.textContent = "Respuesta correcta";

    contenedor.appendChild(respuesta);
    contenedor.appendChild(correcta);
    contenedor.appendChild(etiqueta);

    listaRespuestas.appendChild(contenedor);
}

botonAgregarRespuesta.addEventListener("click", agregarRespuesta);

// --------------------------------------------------
// 7. Guardar preguntas y respuestas
// --------------------------------------------------

formularioPreguntaForm.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const enunciado = campoEnunciado.value.trim();

    // Obtener el examen seleccionado
    const codigoSeleccionado = selectorExamen.value;

    

    const examenSeleccionado = examenes.find((examen) => {
        return examen.codigo === codigoSeleccionado;
    });

    const preguntaExiste = examenSeleccionado.preguntas.some((pregunta) => {
    return pregunta.enunciado.toLowerCase() === enunciado.toLowerCase();
     });

     if (preguntaExiste) {
    alert("Esta pregunta ya existe en este examen.");
    return;
    }

    if (!examenSeleccionado) {
        alert("No se encontró el examen seleccionado.");
        return;
    }

    // Obtener los contenedores de respuestas
    const contenedoresRespuestas = listaRespuestas.querySelectorAll(":scope > div");

    if (contenedoresRespuestas.length < 2) {
        alert("Debes agregar al menos dos respuestas.");
        return;
    }

    // Crear el arreglo de respuestas
    const respuestas = [];

    let hayRespuestaCorrecta = false;

    contenedoresRespuestas.forEach((contenedor) => {

        const campoRespuesta = contenedor.querySelector('input[type="text"]');
        const campoCorrecta = contenedor.querySelector('input[type="radio"]');

        const descripcion = campoRespuesta.value.trim();
        const correcta = campoCorrecta.checked;

        if (descripcion === "") {
            return;
        }

        if (correcta) {
            hayRespuestaCorrecta = true;
        }

        respuestas.push({
            descripcion: descripcion,
            correcta: correcta
        });

    });

    if (respuestas.length !== contenedoresRespuestas.length) {
        alert("Todas las respuestas deben tener un texto.");
        return;
    }

    if (!hayRespuestaCorrecta) {
        alert("Debes marcar una respuesta como correcta.");
        return;
    }

    // Crear la pregunta
    const nuevaPregunta = {
        enunciado: enunciado,
        respuestas: respuestas
    };

    // Agregar la pregunta al examen seleccionado
    examenSeleccionado.preguntas.push(nuevaPregunta);

    // Guardar los cambios
    guardarExamenes(examenes);

    console.log("Pregunta guardada:", nuevaPregunta);
    console.log("Examen actualizado:", examenSeleccionado);

    alert("Pregunta guardada correctamente.");

    // Limpiar y ocultar el formulario
    formularioPreguntaForm.reset();
    listaRespuestas.replaceChildren();
    formularioPregunta.style.display = "none";

});

// --------------------------------------------------
// 8. Cancelar el registro de una pregunta
// --------------------------------------------------

botonCancelarPregunta.addEventListener("click", () => {

    formularioPreguntaForm.reset();
    listaRespuestas.replaceChildren();
    formularioPregunta.style.display = "none";

});

// --------------------------------------------------
// 9. Mostrar formulario de exámenes
// --------------------------------------------------

botonRegistrar.addEventListener("click", () => {

    formularioExamen.reset();
    codigoOriginal = null;
    formularioRegistro.style.display = "block";

});

// --------------------------------------------------
// 10. Cancelar formulario de exámenes
// --------------------------------------------------

botonCancelar.addEventListener("click", () => {

    formularioExamen.reset();
    codigoOriginal = null;
    formularioRegistro.style.display = "none";

});

// --------------------------------------------------
// 11. Registrar o editar exámenes
// --------------------------------------------------

formularioExamen.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const titulo = document.getElementById("titulo").value.trim();
    const tiempo = Number(document.getElementById("tiempo").value);
    const porcentaje = Number(document.getElementById("porcentaje").value);
    const descripcion = document.getElementById("descripcion").value.trim();

    // Comprobar códigos duplicados
    const examenExiste = examenes.some((examen) => {

        return String(examen.codigo).trim().toLowerCase() === codigo.toLowerCase()
            && examen.codigo !== codigoOriginal;

    });

    if (examenExiste) {
        alert("Ya existe un examen con ese código.");
        return;
    }

    // Crear el objeto del examen
    const nuevoExamen = {
        codigo: codigo,
        titulo: titulo,
        tiempo: tiempo,
        porcentaje: porcentaje,
        descripcion: descripcion,
        preguntas: []
    };

    // Editar examen
    if (codigoOriginal !== null) {

        const indice = examenes.findIndex((examen) => {
            return examen.codigo === codigoOriginal;
        });

        if (indice !== -1) {

            // Conservar las preguntas anteriores
            nuevoExamen.preguntas = examenes[indice].preguntas || [];

            examenes[indice] = nuevoExamen;
        }

    } else {

        // Registrar examen nuevo
        examenes.push(nuevoExamen);

    }

    codigoOriginal = null;

    guardarExamenes(examenes);

    mostrarExamenes();
    mostrarExamenesEnSelector();

    formularioExamen.reset();
    formularioRegistro.style.display = "none";

    alert("Examen guardado correctamente.");

});

// --------------------------------------------------
// 12. Mostrar exámenes en la tabla
// --------------------------------------------------

function mostrarExamenes() {

    listaExamenes.replaceChildren();

    examenes.forEach((examen) => {

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

        // Botón Editar
        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";

        botonEditar.addEventListener("click", () => {

            formularioRegistro.style.display = "block";

            document.getElementById("codigo").value = examen.codigo;
            document.getElementById("titulo").value = examen.titulo;
            document.getElementById("tiempo").value = examen.tiempo;
            document.getElementById("porcentaje").value = examen.porcentaje;
            document.getElementById("descripcion").value = examen.descripcion;

            codigoOriginal = examen.codigo;

        });

        celdaAcciones.appendChild(botonEditar);

        // Botón Eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {

            const confirmar = confirm("¿Estás seguro de eliminar este examen?");

            if (confirmar) {

                const indice = examenes.findIndex((elemento) => {
                    return elemento.codigo === examen.codigo;
                });

                if (indice !== -1) {

                    examenes.splice(indice, 1);

                    guardarExamenes(examenes);

                    mostrarExamenes();
                    mostrarExamenesEnSelector();

                }
            }
        });

        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaAcciones);

        listaExamenes.appendChild(fila);

    });
}

// --------------------------------------------------
// 13. Cargar información al iniciar
// --------------------------------------------------

mostrarExamenes();
mostrarExamenesEnSelector();
