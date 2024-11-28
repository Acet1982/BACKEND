import bcryptjs from "bcryptjs";
import {
  create,
  findOneByEmail,
  findOneByCc,
  findAll as findAllUsers,
  findAllCoordinators,
  findAllEmployees,
  findOneByUid,
  updateRoleAdministrator as updateRoleAdministratorUid,
  updateRoleCoordinator as updateRoleCoordinatorUid,
  updateUser,
  deleteUser,
} from "../models/UserModel.js";
import { generateRefreshToken, generateToken } from "../utils/TokenManager.js";

// Función encargada de recibir del cuerpo los datos del usuario a registrar
export const register = async (req, res) => {
  const { username, lastname, cc, site_id, email, password, role_id } =
    req.body;

  const userCc = await findOneByCc(cc);
  if (userCc) {
    return res
      .status(409)
      .json({ ok: false, msg: "Número de documento ya esta registrado." });
  }

  try {
    const userEmail = await findOneByEmail(email);
    if (userEmail) {
      return res.status(409).json({
        ok: false,
        msg: "Esta dirección de correo ya se encuentra registrado.",
      });
    }

    let hashedPassword = null;
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
    }

    const newUser = await create({
      username,
      lastname,
      cc,
      site_id,
      email,
      password: hashedPassword,
      role_id,
    });

    return res
      .status(201)
      .json({ ok: true, msg: "Usuario registrado con exito", newUser });
  } catch (error) {
    console.log(error);
    return res.json({ Error: "Error al intentar registrar el usuario" });
  }
};

// Función encargada de mostrar todos los usuarios
export const findAll = async (req, res) => {
  try {
    const users = await findAllUsers();
    return res.json({ ok: true, msg: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      error: "Error al intentar obtener los usuarios",
    });
  }
};

// Función encargada de mostrar todos los coordinadores
export const findAllUserCoordinators = async (req, res) => {
  try {
    const coordinators = await findAllCoordinators();
    return res.json({ ok: true, msg: coordinators });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error de servidor",
    });
  }
};

// Función encargada de mostrar todos los coordinadores
export const findAllUserEmployees = async (req, res) => {
  try {
    const employees = await findAllEmployees();
    return res.json({ ok: true, msg: employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error de servidor",
    });
  }
};

// Función encargada de actualizar un usuario
export const updateUsers = async (req, res) => {
  try {
    const { uid } = req.params;
    const { username, lastname, cc, email } = req.body;

    const user = await findOneByUid(uid);
    if (!user) {
      return res.status(403).json({ error: `Usuario no encontrado` });
    }

    const searchEmail = await findOneByEmail(email);
    if (searchEmail) {
      return res
        .status(403)
        .json({ error: "Este email ya se encuentra registrado" });
    }

    const searchCc = await findOneByCc(cc);
    if (searchCc) {
      return res.status(403).json({ error: "Número de documento ya en uso" });
    }

    const updatedUser = await updateUser({
      uid,
      username,
      lastname,
      cc,
      email,
      password: req.body.password,
    });

    return res.status(200).json({
      msg: "Usuario actualizado con éxito",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor" });
  }
};

// Función encargada de actualizar el rol de un empleado o coordinador a administrador
export const updateRoleAdministrator = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await findOneByUid(uid);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });

    await updateRoleAdministratorUid(uid);

    return res.json({
      ok: true,
      msg: `Rol actualizado con exito a administrador`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error de servidor",
    });
  }
};

// Función encargada de actualizar el rol de un empleado a coordinador
export const updateRoleCoordinator = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await findOneByUid(uid);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });

    await updateRoleCoordinatorUid(uid);
    return res.json({
      ok: true,
      msg: `Rol actualizado con exito a coordinador`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error de servidor",
    });
  }
};

//Función encargada de hacer el cambio de contraseñas
// export const changePasswords = async (req, res) => {
//   try {
//     const { uid } = req.params;
//     const user = await findOneByUid(uid);
//     if (!user) {
//       return res.status(403).json({ error: "Usuario no encontrado" });
//     }

//     const updatedPassword = await changePassword({
//       password: req.body.password,
//     });

//     return res.status(200).json({
//       msg: "Contraseña actualizada con éxito",
//       updatedPassword,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// Función encargada de eliminar un usuario
export const deleteUsers = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await findOneByUid(uid);

    if (!user) {
      return res.status(403).json({ error: `Usuario no encontrado` });
    }

    await deleteUser(uid);

    return res.status(200).json({ msg: "Usuario eliminado con exito" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Ocurrio un error al intentar eliminar al usuario" });
  }
};

// Función encargada de hacer el login de usuarios
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findOneByEmail(email);

    if (!user) {
      return res.status(403).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    const { token, expiresIn } = generateToken(user.uid);

    generateRefreshToken(
      user.uid,
      user.username,
      user.lastname,
      user.role_id,
      user.site_id,
      res
    );

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

// Función encargada de mostrar los datos del usuario logueado
export const profile = async (req, res) => {
  try {
    let user = await findOneByUid(req.uid);
    const { uid, username, lastname, role_id } = user;
    return res.json({ uid, username, lastname, role_id });
  } catch (error) {
    return res.status(500).json({
      error: "Error de servidor",
    });
  }
};

// Función encargada de realizar el refreshToken para mantener la sesión activa
export const refreshToken = (req, res) => {
  try {
    const { token, expiresIn } = generateToken(
      req.uid,
      req.username,
      req.lastname,
      req.role_id
    );

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error de servidor",
    });
  }
};

//Función en cargada de cerrar la sesión del usuario eliminando las cookies
export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: !(process.env.MODO === "developer"),
    sameSite: "strict",
  });
  res.status(200).send("Sesión cerrada con éxito");
};
