import {
  createPayrollDetail,
  deleteDetailPayroll,
  findAllDetailsPayroll,
  findOneDetailsByPdid,
  findPayrollDetailByPeriod,
  updateDetailPayroll,
} from "../models/DetailPayrollModel.js";
import { verifyPeriod } from "../utils/VerifyDate.js";

export const findOneDetails = async (req, res) => {
  try {
    const { pdid } = req.params;

    const payrollDetails = await findOneDetailsByPdid(pdid);
    if (!payrollDetails) {
      return res.status(400).json({ error: "Detalles de nómina existen" });
    }

    return res.json({ msg: payrollDetails });
  } catch (error) {
    console.log(error);
    return res
      .status(409)
      .json({ error: "Error al intentar optener los detalles de la nómina" });
  }
};

// Función encargada de retornar los detalles de nómina según el período
export const findPayrollDetailPeriods = async (req, res) => {
  try {
    const period = verifyPeriod();
    if (!period === 1 || !period === 2)
      return res
        .status(403)
        .json({ error: "Período no valido para visualizar las nóminas" });

    const payrollDetails = await findPayrollDetailByPeriod(period);

    return res.status(200).json({ msg: payrollDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:
        "Se ha presentado un error al intentar obtener los detalles de nómina por período, por favor intente más tarde.",
    });
  }
};

//Función encargada de retornar los detaller de nómina de un empleado
export const findAllDetailsPayrolls = async (req, res) => {
  try {
    const { pid } = req.params;
    const detailPayrollSite = await findAllDetailsPayroll(pid);
    return res.status(200).json({ msg: detailPayrollSite });
  } catch (error) {
    console.log(error);
    return res.json({
      error: "Error al intentar optener los detalles de nóminas de las sedes",
    });
  }
};

//Función encargada de crear el registro de nómina de un empleado
export const createPayrollDetails = async (req, res) => {
  try {
    const { pid, eid } = req.params;
    const {
      days_worked,
      sunday_classes,
      value_sunday_classes,
      days_sunday,
      value_days_sunday,
      instructor_hours,
      value_instructor_hours,
      registrations,
      value_registrations,
      additional_payments,
      deductions,
      observations,
    } = req.body;

    await createPayrollDetail({
      payroll_id: pid,
      employee_id: eid,
      days_worked,
      sunday_classes,
      value_sunday_classes,
      days_sunday,
      value_days_sunday,
      instructor_hours,
      value_instructor_hours,
      registrations,
      value_registrations,
      additional_payments,
      deductions,
      observations,
    });

    return res
      .status(201)
      .json({ msg: "Detalles de nóimina cargados con exito" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error:
        "Se ha presentado un error al intentar cargar los datos de la nómina, por favor intente más tarde",
    });
  }
};

//Función encargada de actualizar la nómina de un empleado
export const updateDetailPayrolls = async (req, res) => {
  try {
    const { pdid } = req.params;
    const {
      days_worked,
      sunday_classes,
      value_sunday_classes,
      days_sunday,
      value_days_sunday,
      instructor_hours,
      value_instructor_hours,
      registrations,
      value_registrations,
      additional_payments,
      deductions,
      observations,
    } = req.body;

    const detailPayroll = await findOneDetailsByPdid(pdid);
    if (!detailPayroll) {
      return res.status(403).json({ msg: "Nómina del empleado no encontrada" });
    }

    const payrollUpdated = await updateDetailPayroll({
      pdid,
      days_worked,
      sunday_classes,
      value_sunday_classes,
      days_sunday,
      value_days_sunday,
      instructor_hours,
      value_instructor_hours,
      registrations,
      value_registrations,
      additional_payments,
      deductions,
      observations,
    });

    return res.status(200).json({
      msg: "Detalles de nómina actualizados con exito",
      payrollUpdated,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error:
        "Ups, ha ocurrido un error al intentar actualizar la nómina del empleado",
    });
  }
};

//Función encargada de eliminar los detallesde nómina de un empleado
export const deleteDetailPayrolls = async (req, res) => {
  try {
    const { pdid } = req.params;

    const detailPayroll = await findOneDetailsByPdid(pdid);
    if (!detailPayroll) {
      return res.status(403).json({
        error: "No se han encontrado los datos de nómina del empleado",
      });
    }

    await deleteDetailPayroll(pdid);

    return res
      .status(200)
      .json({ msg: "Detalles de nómina eliminados con exito" });
  } catch (error) {
    console.log(error);
    return res.json({
      error: "Error al intentar eliminar los detalles de nómina del empleado",
    });
  }
};
