import {
  createPayroll,
  findAllPayrolls,
  findOnePayrollDate,
  findAllPayrollsCoordinator,
  findOnePayrollByPid,
  updatePayroll,
  deletePayroll,
  findOnePayrollCoordinator,
  findOnePayrollByPeriodCoordinator,
  allPayrollByPeriod,
  validatedPayroll,
  correctionPayroll,
  correctedPayroll,
} from "../models/PayrollModel.js";
import jwt from "jsonwebtoken";
import { verifyDate } from "../utils/VerifyDate.js";

// Función encargada de recibir del cuerpo los datos de información de la nómina para registrar los datos
// Aquí necesito verificar que exactamente exista en un mes y no en la fecha actual
export const createPayrolls = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    const { uid, site_id } = jwt.verify(
      refreshTokenCookie,
      process.env.JWT_REFRESH_TOKEN
    );

    const date = verifyDate();
    if (date === 3)
      return res
        .status(403)
        .json({ error: "Fecha no valida para cargar nóminas" });

    const searchPayroll = await findOnePayrollByPeriodCoordinator(uid, date);
    if (searchPayroll) {
      return res.status(403).json({
        error:
          "Ups, Esta sede ya tiene una nómina registrada durante este corte",
      });
    }

    await createPayroll({
      coordinator_id: uid,
      site_id,
      period_id: date,
    });

    return res.status(201).json({ msg: "Nómina creada con exito" });
  } catch (error) {
    console.log(error);
  }
  return res.status(201).json({ msg: "Nómina registrada con exito" });
};

// Función encargada de mostrar todos los usuarios
export const findAllPayroll = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    const { uid, role_id } = jwt.verify(
      refreshTokenCookie,
      process.env.JWT_REFRESH_TOKEN
    );

    if (role_id === 1) {
      const payroll = await findAllPayrolls();
      return res.json({ msg: payroll });
    }
    if (role_id === 2) {
      const payroll = await findAllPayrollsCoordinator(uid);
      return res.json({ msg: payroll });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Se ha presentado un error en el servidor" });
  }
};

// Función encargada de actualizar el estado de una nómina a validada
export const validatedPayrolls = async (req, res) => {
  try {
    const { pid } = req.params;

    const payroll = await findOnePayrollByPid(pid);
    if (!payroll)
      return res.status(404).json({ error: "Nómina no encontrada." });

    await validatedPayroll(pid);

    return res.json({
      msg: `Nómina validada con exito`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error al intentar validar la nómina",
    });
  }
};

// Función encargada de actualizar el estado de una nómina a correción
export const correctPayrolls = async (req, res) => {
  try {
    const { pid } = req.params;

    const payroll = await findOnePayrollByPid(pid);
    if (!payroll)
      return res.status(404).json({ error: "Nómina no encontrada." });

    await correctionPayroll(pid);

    return res.json({
      msg: `Nómina enviada a correción`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error al intentar enviar la nómina a correción",
    });
  }
};

// Función encargada de actualizar el estado de una nómina a corregida o en revisión
export const correctedPayrolls = async (req, res) => {
  try {
    const { pid } = req.params;

    const payroll = await findOnePayrollByPid(pid);
    if (!payroll)
      return res.status(404).json({ error: "Nómina no encontrada." });

    await correctedPayroll(pid);

    return res.json({
      msg: `Nómina enviada a revisión`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error al intentar enviar la nómina a revisión",
    });
  }
};

// Función encargada de mostrar todos los usuarios
export const AllPayrollInternalControl = async (req, res) => {
  try {
    const payrolls = await allPayrollByPeriod();
    return res.json({ msg: payrolls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:
        "Se ha presentado un error al intentar optener las nóminas para el usuario control interno",
    });
  }
};

export const findAllPayrollsCoordinators = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    const { uid } = jwt.verify(
      refreshTokenCookie,
      process.env.JWT_REFRESH_TOKEN
    );

    const allPayrolls = await findAllPayrollsCoordinator(uid);

    return res.status(200).json({ msg: allPayrolls });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Se ha presentado un error en el servidor" });
  }
};

export const updatePayrolls = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    const { uid } = jwt.verify(
      refreshTokenCookie,
      process.env.JWT_REFRESH_TOKEN
    );

    const { pid } = req.params;
    const { site_id, period_id, comments } = req.body;

    const payroll = await findOnePayrollByPid(pid);
    if (!payroll) {
      return res.status(403).json({ error: "Nómina no encontrada" });
    }

    const payrollByCoordinator = await findOnePayrollCoordinator(pid, uid);
    if (!payrollByCoordinator) {
      return res.status(403).json({
        error:
          "Ups, no se puede realizar esta operación, usuario no autorizado",
      });
    }

    await updatePayroll({
      pid,
      site_id,
      period_id,
      comments,
    });

    return res.status(201).json({ msg: "Nómina actualizada con exito" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Se ha presenato un error en el servidor" });
  }
};

export const deletePayrolls = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    const { uid } = jwt.verify(
      refreshTokenCookie,
      process.env.JWT_REFRESH_TOKEN
    );
    const { pid } = req.params;

    const payroll = await findOnePayrollByPid(pid);
    if (!payroll) {
      return res.status(403).json({ error: "Nómina no encontrada" });
    }

    const payrollByCoordinator = await findOnePayrollCoordinator(pid, uid);
    if (!payrollByCoordinator) {
      return res.status(403).json({
        error:
          "Ups, no se puede realizar esta operación, usuario no autorizado",
      });
    }

    await deletePayroll(pid);

    return res.status(200).json({ msg: "Nómina eliminada con exito" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Se ha presentado un error en el servidor" });
  }
};
