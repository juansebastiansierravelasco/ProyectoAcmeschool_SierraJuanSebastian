export function validarCredenciales(email, contrasena, usuarios) {

    const usuarioEncontrado = usuarios.find((usuario) => {
        return usuario.email === email && usuario.contrasena === contrasena;
    });

    return usuarioEncontrado;
}
