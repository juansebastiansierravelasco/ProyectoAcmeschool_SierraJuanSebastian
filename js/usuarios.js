import { protegerPagina } from "./auth.js";

protegerPagina();

import {obtenerUsuarios} from "./storage.js";

const usuarios=obtenerUsuarios();

const listaUsuarios=document.getElementById("lista-usuarios");

usuarios.forEach((usuario) => {

   

});