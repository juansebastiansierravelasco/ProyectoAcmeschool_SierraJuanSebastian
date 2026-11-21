 export function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}

export function obtenerUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    return usuarios;
}