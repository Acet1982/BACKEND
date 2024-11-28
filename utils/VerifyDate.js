import { response } from "express";

// Función para determinar el período
export const verifyDate = () => {
  const today = new Date();
  const day = today.getDate();

  // Determinar el período basado en el día del mes
  if (day >= 1 && day <= 5) {
    return 1;
  } else if ([15, 16, 17, 18, 19, 28, 29, 30, 40].includes(day)) {
    return 2;
  } else {
    return 3;
  }
};
