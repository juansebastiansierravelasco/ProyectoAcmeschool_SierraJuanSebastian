
import { guardarUsuarios, obtenerUsuarios } from "./storage.js";
import { validarCredenciales } from "./auth.js";
// Usuarios iniciales
const usuario = {
    identificacion: "10053265869",
    nombreCompleto: "Carlos Nara",
    email: "carlos@acme.com",
    telefono: "123987345",
    cargo: "Docente",
    contrasena: "Do3"
};

const usuarionuevo = {
    identificacion: "10056583",
    nombreCompleto: "Laura Gómez",
    email: "laura@acme.com",
    telefono: "3001234567",
    cargo: "Docente",
    contrasena: "Docente123"
};

// Array inicial
const usuariosIniciales = [
    usuario,
    usuarionuevo
];

// Recuperar usuarios guardados
const usuariosGuardados = obtenerUsuarios();

// Si existen usuarios guardados, utilizarlos.
// Si no existen, utilizar los iniciales.
const usuarios = usuariosGuardados || usuariosIniciales;

// Guardar los usuarios iniciales solamente la primera vez
if (!usuariosGuardados) {
    guardarUsuarios(usuarios);
}

console.log(usuarios);

const formularioLogin = document.getElementById("login-form");


formularioLogin.addEventListener("submit", (evento) => {

   evento.preventDefault();
   const email=document.getElementById("correo").value;
   const contrasena=document.getElementById("contrasena").value;
   const usuarioEncontrado = validarCredenciales(email, contrasena, usuarios);
   if (usuarioEncontrado) {
    
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
        window.location.href = "./pages/dashboard.html";

    } else {

        alert("Correo o contraseña incorrectos");

    }

});


