import { protegerPagina } from "./auth.js";
protegerPagina();
const usuarioActivo=JSON.parse(localStorage.getItem("usuarioActivo"));

if (usuarioActivo===null) {
 window.location.href = "../index.html";
}

const cerrar=document.getElementById("cerrar-sesion");

cerrar.addEventListener("click", () => {
   localStorage.removeItem("usuarioActivo");
   window.location.href = "../index.html";
});