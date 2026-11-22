import { protegerPagina } from "./auth.js";
import { obtenerUsuarios, guardarUsuarios} from "./storage.js";

// 1. Proteger la página
protegerPagina();

// 2. Obtener los usuarios
let usuarios = obtenerUsuarios();

// 3. Obtener el cuerpo de la tabla
const listaUsuarios = document.getElementById("lista-usuarios");

// 4. Recorrer los usuarios y construir la tabla
function mostrarUsuarios() {

    usuarios.forEach((usuario) => {

        const fila = document.createElement("tr");

        const celdaIdentificacion = document.createElement("td");
        celdaIdentificacion.textContent = usuario.identificacion;
        fila.appendChild(celdaIdentificacion);
        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = usuario.nombreCompleto;
        fila.appendChild(celdaNombre);
        const celdaEmail = document.createElement("td");
        celdaEmail.textContent = usuario.email;
        fila.appendChild(celdaEmail);
        const celdaTelefono = document.createElement("td");
        celdaTelefono.textContent = usuario.telefono;
        fila.appendChild(celdaTelefono);
        const celdaCargo = document.createElement("td");
        celdaCargo.textContent = usuario.cargo;
        fila.appendChild(celdaCargo);
        const celdaAcciones = document.createElement("td");

        // Botón eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {
            const confirmar = confirm("¿Estás seguro de eliminar este usuario?");
            if (!confirmar) {
             return;
            }
            const usuariosActualizados = usuarios.filter((elemento) => {
                return elemento.identificacion !== usuario.identificacion;
            });

            guardarUsuarios(usuariosActualizados);

            usuarios = usuariosActualizados;

            listaUsuarios.replaceChildren();

            mostrarUsuarios();

        });

        celdaAcciones.appendChild(botonEliminar);
        fila.appendChild(celdaAcciones);

        listaUsuarios.appendChild(fila);

    });

}

mostrarUsuarios();

// 5. Obtener el botón y el formulario
const botonRegistrar = document.getElementById("registrar-usuario");
const formularioRegistro = document.getElementById("formulario-registro");
const botonCancelar=document.getElementById("cancelar-registro")

botonCancelar.addEventListener("click",()=>{
    formularioRegistro.style.display="none";
})
// 6. Detectar el clic en Registrar usuario
botonRegistrar.addEventListener("click", () => {

    formularioRegistro.style.display="block";

});
// 7. Obtener el formulario HTML
const formularioUsuario = document.getElementById("formulario-usuario");

formularioUsuario.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const identificacion = document.getElementById("identificacion").value;
    const nombreCompleto = document.getElementById("nombreCompleto").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const cargo = document.getElementById("cargo").value;
    const contrasena = document.getElementById("contrasena").value;

    const nuevoUsuario = {
        identificacion: identificacion,
        nombreCompleto: nombreCompleto,
        email: email,
        telefono: telefono,
        cargo: cargo,
        contrasena: contrasena
    };

    // Validar si ya existe la identificación o el correo
    const usuarioExiste = usuarios.some((usuario) => {
        return usuario.identificacion === identificacion || usuario.email === email;
    });

    if (usuarioExiste) {
        alert("Ya existe un usuario con esa identificación o correo electrónico.");
        return;
    }
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    listaUsuarios.replaceChildren();
    mostrarUsuarios();

    alert("Usuario registrado correctamente.");

    formularioUsuario.reset();
    formularioRegistro.style.display = "none";

});
