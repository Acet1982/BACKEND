import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/UserRouter.js";
import EmployeeRouter from "./routes/EmployeeRoute.js";
import PayrollRoute from "./routes/PayrollRoute.js";
import DetailPayrollRoute from "./routes/DetailPayrollRoute.js";
import SitesRoute from "./routes/SitesRoute.js";

const app = express();

app.use(
  cors({
    origin: ["https://sigen-nine.vercel.app"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/enova/users", UserRouter);
app.use("/api/enova/employees/", EmployeeRouter);
app.use("/api/enova/payrolls/", PayrollRoute);
app.use("/api/enova/payrolls/details/", DetailPayrollRoute);
app.use("/api/enova/sites/", SitesRoute);
app.get("/", (req, res) => {
  res.send("Api de Enova Tecnologia.");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.info(`Servidor corriendo en el puerto ${PORT}`);
});
