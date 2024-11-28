import {
  createPayrollDetail,
  deleteDetailPayroll,
  findAllDetailsPayroll,
  findOneDetailsByPdid,
  updateDetailPayroll,
} from "../models/DetailPayrollModel.js";

//Función encargada de retornar los detaller de nómina de un empleado
export const findAllDetailsPayrolls = async (req, res) => {
  try {
    const detailPayrollEmployee = await findAllDetailsPayroll();
    return res.status(200).json({ detailPayrollEmployee });
  } catch (error) {
    console.log(error);
    return res.json({
      error:
        "Error al intentar optener los detalles de nómina de los empleados",
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

    const nominaEmployee = await createPayrollDetail({
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
      .json({ msg: "Detalles de nóimina cargados con exito", nominaEmployee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error:
        "Se ha presentado un error en el servidor, por favor intente más tarde",
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
