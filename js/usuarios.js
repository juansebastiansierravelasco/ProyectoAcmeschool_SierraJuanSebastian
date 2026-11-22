import { protegerPagina } from "./auth.js";

protegerPagina();

import {obtenerUsuarios} from "./storage.js";

const usuarios=obtenerUsuarios();

const listaUsuarios=document.getElementById("lista-usuarios");

usuarios.forEach((usuario) => {

const fila = document.createElement("tr");
const celdaIdentificacion=document.createElement("td");
celdaIdentificacion.textContent =usuario.identificacion;
fila.appendChild(celdaIdentificacion);
const celdaNombre = document.createElement("td");
celdaNombre.textContent = usuario.nombreCompleto;
fila.appendChild(celdaNombre);
const celdaEmail=document.createElement("td");
celdaEmail.textContent=usuario.email;
fila.appendChild(celdaEmail);
const celdaTelefono=document.createElement("td");
celdaTelefono.textContent=usuario.telefono;
fila.appendChild(celdaTelefono);
const celdaCargo=document.createElement("td");
celdaCargo.textContent=usuario.cargo;
fila.appendChild(celdaCargo);

listaUsuarios.appendChild(fila);

const botonRegistrar=document.getElementById("registrar-usuario");
botonRegistrar.addEventListener("click", () => {

     alert("Registrar usuario");

});
});