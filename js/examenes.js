import { protegerPagina } from "./auth.js";
import { obtenerExamenes, guardarExamenes } from "./storage.js";
protegerPagina();

let examenes = obtenerExamenes() || [];
let codigoOriginal = null;
let indicePreguntaEditando = null;
examenes.forEach((examen) => {
    if (!Array.isArray(examen.preguntas)) {
        examen.preguntas = [];
    }
});

// --------------------------------------------------
// 2. Obtener elementos del HTML
// --------------------------------------------------

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

formularioPregunta.style.display = "none";

// --------------------------------------------------
// 3. Mostrar exámenes en el selector
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
// 4. Mostrar preguntas
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

        // Botón editar pregunta
        const botonEditarPregunta = document.createElement("button");
        botonEditarPregunta.type = "button";
        botonEditarPregunta.textContent = "Editar";

        botonEditarPregunta.addEventListener("click", () => {

            indicePreguntaEditando = indice;

            campoEnunciado.value = pregunta.enunciado;

            listaRespuestas.replaceChildren();

            pregunta.respuestas.forEach((respuesta) => {
                agregarRespuesta(
                    respuesta.descripcion,
                    respuesta.correcta
                );
            });

            formularioPregunta.style.display = "block";

        });

        contenedor.appendChild(botonEditarPregunta);

        // Botón eliminar pregunta
        const botonEliminarPregunta = document.createElement("button");
        botonEliminarPregunta.type = "button";
        botonEliminarPregunta.textContent = "Eliminar";

        botonEliminarPregunta.addEventListener("click", () => {

            const confirmar = confirm(
                "¿Estás seguro de eliminar esta pregunta?"
            );

            if (confirmar) {

                examenSeleccionado.preguntas.splice(indice, 1);

                // Si se elimina la pregunta que se estaba editando
                if (indicePreguntaEditando === indice) {

                    indicePreguntaEditando = null;

                    formularioPreguntaForm.reset();
                    listaRespuestas.replaceChildren();
                    formularioPregunta.style.display = "none";

                } else if (
                    indicePreguntaEditando !== null &&
                    indice < indicePreguntaEditando
                ) {

                    indicePreguntaEditando--;

                }

                guardarExamenes(examenes);

                mostrarPreguntas();

                alert("Pregunta eliminada correctamente.");

            }

        });

        contenedor.appendChild(botonEliminarPregunta);

        listaPreguntas.appendChild(contenedor);

    });

}

selectorExamen.addEventListener("change", () => {
    indicePreguntaEditando = null;
    formularioPreguntaForm.reset();
    listaRespuestas.replaceChildren();
    formularioPregunta.style.display = "none";
    mostrarPreguntas();

});

// --------------------------------------------------
// 5. Mostrar formulario para agregar pregunta
// --------------------------------------------------

botonAgregarPregunta.addEventListener("click", () => {

    if (selectorExamen.value === "") {
        alert("Primero debes seleccionar un examen.");
        return;
    }
    indicePreguntaEditando = null;

    formularioPreguntaForm.reset();
    listaRespuestas.replaceChildren();

    formularioPregunta.style.display = "block";

});

// --------------------------------------------------
// 6. Crear campos de respuestas
// --------------------------------------------------

function agregarRespuesta(descripcion = "", esCorrecta = false) {

    const contenedor = document.createElement("div");

    const respuesta = document.createElement("input");
    respuesta.type = "text";
    respuesta.placeholder = "Escribe una respuesta";
    respuesta.required = true;
    respuesta.value = descripcion;
    const correcta = document.createElement("input");
    correcta.type = "radio";
    correcta.name = "respuesta-correcta";
    correcta.required = true;
    correcta.checked = esCorrecta;
    const etiqueta = document.createElement("label");
    etiqueta.textContent = "Respuesta correcta";

    contenedor.appendChild(respuesta);
    contenedor.appendChild(correcta);
    contenedor.appendChild(etiqueta);

    listaRespuestas.appendChild(contenedor);
}

botonAgregarRespuesta.addEventListener("click", () => {
    agregarRespuesta();
});

// --------------------------------------------------
// 7. Guardar o actualizar preguntas
// --------------------------------------------------

formularioPreguntaForm.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const enunciado = campoEnunciado.value.trim();
    const codigoSeleccionado = selectorExamen.value;
    const examenSeleccionado = examenes.find((examen) => {
        return examen.codigo === codigoSeleccionado;
    });
    if (!examenSeleccionado) {
        alert("No se encontró el examen seleccionado.");
        return;
    }

    if (enunciado === "") {
        alert("Debes escribir el enunciado de la pregunta.");
        return;
    }

    // Comprobar preguntas duplicadas
    const preguntaExiste = examenSeleccionado.preguntas.some(
        (pregunta, indice) => {

            return pregunta.enunciado.toLowerCase() === enunciado.toLowerCase()
                && indice !== indicePreguntaEditando;

        }
    );

    if (preguntaExiste) {
        alert("Esta pregunta ya existe en este examen.");
        return;
    }

    // Obtener campos de respuestas
    const contenedoresRespuestas = listaRespuestas.querySelectorAll(":scope > div");

    if (contenedoresRespuestas.length < 2) {
        alert("Debes agregar al menos dos respuestas.");
        return;
    }
     const respuestas = [];

    let cantidadCorrectas = 0;

    contenedoresRespuestas.forEach((contenedor) => {

        const campoRespuesta = contenedor.querySelector('input[type="text"]');
        const campoCorrecta = contenedor.querySelector('input[type="radio"]');

        const descripcion = campoRespuesta.value.trim();
        const correcta = campoCorrecta.checked;

        if (descripcion !== "") {

            respuestas.push({
                descripcion: descripcion,
                correcta: correcta
            });

            if (correcta) {
            cantidadCorrectas++;
            }
        }
    });

    if (respuestas.length !== contenedoresRespuestas.length) {
        alert("Todas las respuestas deben tener un texto.");
        return;
    }

    if (cantidadCorrectas !== 1) {
        alert("Debes marcar exactamente una respuesta como correcta.");
        return;
    }

    const pregunta = {
        enunciado: enunciado,
        respuestas: respuestas
    };

    // Si estamos editando
    if (indicePreguntaEditando !== null) {

        examenSeleccionado.preguntas[indicePreguntaEditando] = pregunta;

        alert("Pregunta actualizada correctamente.");

    } else {

        // Si estamos registrando
        examenSeleccionado.preguntas.push(pregunta);

        alert("Pregunta guardada correctamente.");
    }
    guardarExamenes(examenes);
    // Limpiar formulario
    indicePreguntaEditando = null;
    formularioPreguntaForm.reset();
    listaRespuestas.replaceChildren();
    formularioPregunta.style.display = "none";
    mostrarPreguntas();
});

// --------------------------------------------------
// 8. Cancelar registro o edición de pregunta
// --------------------------------------------------

botonCancelarPregunta.addEventListener("click", () => {
    indicePreguntaEditando = null;

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
          nuevoExamen.preguntas = examenes[indice].preguntas || [];

            examenes[indice] = nuevoExamen;
         }

    } else {
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

        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
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

        // Botón eliminar examen
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {

            const confirmar = confirm(
                "¿Estás seguro de eliminar este examen?"
            );

            if (confirmar) {

                const indice = examenes.findIndex((elemento) => {
                    return elemento.codigo === examen.codigo;
                });

                if (indice !== -1) {

                    examenes.splice(indice, 1);

                    guardarExamenes(examenes);

                    mostrarExamenes();
                    mostrarExamenesEnSelector();
                    mostrarPreguntas();
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

