import { validationResult, body } from "express-validator";

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//Función encargada de validar los campos requeridos para el registro mediante express validator
export const validatorRegisterBody = [
  body("username", "Nombre no valido").isString().notEmpty().trim().escape(),
  body("lastname", "Apellido no valido").isString().notEmpty().trim().escape(),
  body("cc", "Cc no valida").notEmpty().trim().isString().escape(),
  body("email", "Formato de email inorreto")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "La password debe contener minimo 6 caracteres")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 6 }),
  body("password", "Formato de password incorrecto")
    .optional({ checkFalsy: true })
    .custom((value, { req }) => {
      if (value !== req.body.confpassword) {
        throw new Error("No coninciden las contraseñas");
      }
      return value;
    }),
  validationResultExpress,
];

//Función encargada de validar los campos de login mediante express validator
export const ValidatorLoginBody = [
  body("email", "Formato de email inorreto").trim().isEmail().normalizeEmail(),
  body("password", "La password debe contener minimo 6 caracteres")
    .trim()
    .isLength({ min: 6 }),
  validationResultExpress,
];

export const validatorRegisterEmployee = [
  body("bank_id", "Banco no valido").isNumeric().notEmpty().trim().escape(),
  body("account_number", "Número de cuenta no valido")
    .isNumeric()
    .isLength({ min: 10 })
    .withMessage("El número de cuenta debe tener minimo 10 dígitos")
    .trim()
    .escape(),
  body("site_id", "Sede no valida").isNumeric().notEmpty().trim().escape(),
  body("monthly_salary", "Valor de salario no valido")
    .isNumeric()
    .isLength({ min: 1 })
    .trim()
    .escape(),
  validationResultExpress,
];

//Función encargada de validar los campos requeridos para el registro mediante express validator
export const validatorUpdateBody = [
  body("username", "Nombre no valido")
    .optional({ checkFalsy: true })
    .isString()
    .notEmpty()
    .trim()
    .escape(),
  body("lastname", "Apellido no valido")
    .optional({ checkFalsy: true })
    .isString()
    .notEmpty()
    .trim()
    .escape(),
  body("cc", "Cc no valida")
    .optional({ checkFalsy: true })
    .notEmpty()
    .trim()
    .isString()
    .escape(),
  body("email", "Formato de email inorreto")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .normalizeEmail(),
  validationResultExpress,
];
