import jwt from "jsonwebtoken";

export const generateToken = (uid, username, lastname, role_id, site_id) => {
  const expiresIn = 60 * 15;

  try {
    const token = jwt.sign(
      { uid, username, lastname, role_id, site_id },
      process.env.JWT_SECRET,
      { expiresIn }
    );
    return { token, expiresIn };
  } catch (error) {
    console.log(error);
  }
};

export const generateRefreshToken = (
  uid,
  username,
  lastname,
  role_id,
  site_id,
  res
) => {
  const expiresIn = 60 * 60 * 24 * 30;
  try {
    const refreshToken = jwt.sign(
      { uid, username, lastname, role_id, site_id },
      process.env.JWT_REFRESH_TOKEN,
      {
        expiresIn,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !(process.env.MODO === "developer"),
      sameSite: "None",
      expires: new Date(Date.now() + expiresIn * 1000),
    });

  } catch (error) {
    console.log(error);
  }
};

export const tokenVerificationErrors = {
  "invalid signature": "La forma del JWT no es válida",
  "jwt expired": "JWT expirado",
  "invalid token": "Token no valido",
  "jwt malformed": "Token en formato no válido",
};
