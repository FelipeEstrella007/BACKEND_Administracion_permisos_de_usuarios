import { Router } from "express";
import { register, login, buscaUsuarioPorID, buscaUsuarios, actualizaUsuario, eliminaUsuario } from "../db/usuariosBD.js";
import { usuarioAutorizado, adminAutorizado } from "../middlewares/funcionesPassword.js";

const router = Router();

//Ruta para poder registrar a un usuario
router.post("/registro", async (req, res) => {
    console.log(req.body);
    const respuesta = await register(req.body);
    console.log(respuesta);
    // Guardamos el token en una cookie
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta);
});

//Ruta para poder iniciar sesión
router.post("/ingresar", async (req, res) => {
    const respuesta = await login(req.body.usuario);
    // Guardamos el token en una cookie
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});


//Ruta que permite cerrar sesión y limpiar las cookies
router.get("/salir", async (req, res) => {
    // Eliminamos la cookie para cerrar sesión
    res.cookie("token", "", { expires: new Date(0) })
        .clearCookie("token")
        .status(200)
        .json("Cerraste sesión correctamente");
});

//Ruta para verificar si eres un usuario
router.get("/usuarios", async (req, res) => {
    const respuesta = usuarioAutorizado(req.cookies.token, req);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

//Ruta para verificar si eres un administrador
router.get("/administradores", async (req, res) => {
    const respuesta = await adminAutorizado(req);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

//Ruta a la que pueden acceder todos
router.get("/todos", async (req, res) => {
    res.send("Estas en todos");
});

//Ruta para buscar un usuario por id
router.get("/buscarPorId/:id", async (req, res) => {
    const respuesta = await buscaUsuarioPorID(req.params.id);
    res.status(respuesta.status).json(respuesta);
});

//Ruta para buscar a todos los usuarios de la BD
router.get("/buscarUsuarios", async (req, res) => {
    const respuesta = await buscaUsuarios();
    res.status(respuesta.status).json(respuesta);
});

// Ruta para eliminar un usuario
router.delete("/eliminarUsuario/:id", async (req, res) => {
    const respuesta = await eliminaUsuario(req.params.id);
    res.status(respuesta.status).json(respuesta);
});

// Ruta para actualizar un usuario
router.put("/actualizarUsuario/:id", async (req, res) => {
    const respuesta = await actualizaUsuario(req.params.id, req.body);
    res.status(respuesta.status).json(respuesta);
});

export default router;
