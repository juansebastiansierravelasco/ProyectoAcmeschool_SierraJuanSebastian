import { guardarResultados,obtenerResultados } from "./storage";
import { protegerPagina } from "./auth.js";

protegerPagina()

let resultados= obtenerResultados() || [];
