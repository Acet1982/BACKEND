import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/UserRouter.js";
import EmployeeRouter from "./routes/EmployeeRoute.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/enova/users", UserRouter);
app.use("/api/enova/employees/", EmployeeRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.info(`Servidor corriendo en el puerto ${PORT}`);
});
