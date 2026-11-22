export function validarCredenciales(email, contrasena, usuarios) {

    const usuarioEncontrado = usuarios.find((usuario) => {
        return usuario.email === email && usuario.contrasena === contrasena;
    });

    return usuarioEncontrado;
}

 export function  protegerPagina() {

     const protege = localStorage.getItem("usuarioActivo");
    
     if (protege===null) {
    window.location.href = "../index.html";
     }
}