 export function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}

export function obtenerUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    return usuarios;
}

export function guardarExamenes(examenes) {
    localStorage.setItem("examenes", JSON.stringify(examenes));
}

export function obtenerExamenes() {
    const examenes = JSON.parse(localStorage.getItem("examenes"));
    return examenes;
}