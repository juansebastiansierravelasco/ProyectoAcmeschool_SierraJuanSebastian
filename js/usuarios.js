import { protegerPagina } from "./auth.js";
import { obtenerUsuarios } from "./storage.js";

// 1. Proteger la página
protegerPagina();

// 2. Obtener los usuarios
const usuarios = obtenerUsuarios();

// 3. Obtener el cuerpo de la tabla
const listaUsuarios = document.getElementById("lista-usuarios");

// 4. Recorrer los usuarios y construir la tabla
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

    listaUsuarios.appendChild(fila);

});

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
    const identificacion=document.getElementById("identificacion").value;
    const nombreCompleto = document.getElementById("nombreCompleto").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const cargo = document.getElementById("cargo").value;
    const contrasena = document.getElementById("contrasena").value;

});
