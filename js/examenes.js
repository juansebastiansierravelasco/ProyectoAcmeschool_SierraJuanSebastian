import { protegerPagina } from "./auth.js";
import { obtenerExamenes, guardarExamenes } from "./storage.js";

protegerPagina();

let examenes = obtenerExamenes() || [];
let codigoOriginal = null;

const listaExamenes = document.getElementById("lista-examenes");
const botonRegistrar = document.getElementById("registrar-examen");
const formularioRegistro = document.getElementById("formulario-registro");
const botonCancelar = document.getElementById("cancelar-examen");
const formularioExamen = document.getElementById("formulario-examen");

// Mostrar formulario
botonRegistrar.addEventListener("click", () => {
    formularioExamen.reset();
    codigoOriginal = null;
    formularioRegistro.style.display = "block";
});

// Cancelar formulario
botonCancelar.addEventListener("click", () => {
    formularioExamen.reset();
    codigoOriginal = null;
    formularioRegistro.style.display = "none";
});

// Registrar o editar examen
formularioExamen.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const titulo = document.getElementById("titulo").value.trim();
    const tiempo = Number(document.getElementById("tiempo").value);
    const porcentaje = Number(document.getElementById("porcentaje").value);
    const descripcion = document.getElementById("descripcion").value.trim();

    const nuevoExamen = {
        codigo: codigo,
        titulo: titulo,
        tiempo: tiempo,
        porcentaje: porcentaje,
        descripcion: descripcion
    };

    // Comprobar códigos duplicados
    const examenExiste = examenes.some((examen) => {
        return String(examen.codigo).trim().toLowerCase() === codigo.toLowerCase()
            && examen.codigo !== codigoOriginal;
    });

    if (examenExiste) {
        alert("Ya existe un examen con ese código.");
        return;
    }

    // Editar o registrar
    if (codigoOriginal !== null) {

        const indice = examenes.findIndex((elemento) => {
            return elemento.codigo === codigoOriginal;
        });

        if (indice !== -1) {
            examenes[indice] = nuevoExamen;
        }

    } else {
        examenes.push(nuevoExamen);
    }

    codigoOriginal = null;

    guardarExamenes(examenes);
    listaExamenes.replaceChildren();
    mostrarExamenes();

    formularioExamen.reset();
    formularioRegistro.style.display = "none";

    alert("Examen guardado correctamente.");
});

// Mostrar exámenes en la tabla
function mostrarExamenes() {

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

                    listaExamenes.replaceChildren();
                    mostrarExamenes();
                }
            }
        });

        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaAcciones);

        listaExamenes.appendChild(fila);
    });
}

// Cargar exámenes al iniciar
mostrarExamenes();
