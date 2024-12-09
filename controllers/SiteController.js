import {
  createSite,
  deleteSite,
  findAllSites,
  findOneBySid,
  findOneBySiteName,
} from "../models/SitesModel.js";

// Función encargada de retornar las sedes
export const getSites = async (req, res) => {
  try {
    const sites = await findAllSites();
    return res.json({ msg: sites });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error al intentar obtener las sedes",
    });
  }
};

// Función encargada de registrar una sede
export const createSites = async (req, res) => {
  try {
    const { sitename } = req.body;
    const site = await findOneBySiteName(sitename);
    if (site) {
      return res
        .status(403)
        .json({ error: "Ups, esta sede ya se encuentra registrada" });
    }
    await createSite({
      sitename,
    });

    return res.status(201).json({ msg: "Sede guardada con exito" });
  } catch (error) {
    console.log(error);
    return res.json({
      error: "Error al intengar guardar la sede",
    });
  }
};

//Función encargada de eliminar los datos de una sede
export const deleteSites = async (req, res) => {
  try {
    const { sid } = req.params;
    const site = await findOneBySid(sid);

    if (!site) {
      return res.status(403).json({ error: `Sede no encontrada` });
    }

    await deleteSite(sid);
    return res.status(200).json({ msg: "Sede eliminada con exito" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Ocurrio un error al intentar eliminar la sede" });
  }
};
