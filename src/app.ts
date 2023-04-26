import express, { Application } from "express";
import { createDeveloper, createDeveloperInfo, deleteDeveloper, getDeveloperById, patchDeveloper } from "./logic/developers_logic";
import { createProject, createProjectsTechnologies, deleteProject, dellTecFromProject, getProject, patchProject } from "./logic/projects_logic";
import { verifyEmailResgistred, verifyEnumExist, verifyIdExist, verifyIsUnique } from "./middleware/developers_middleware";
import { verifyDevId, verifyIdExistPro, verifyTecName, verifyTecNameExists } from "./middleware/projects_middleware";

const app: Application = express();
app.use(express.json())

app.post("/developers", verifyEmailResgistred, createDeveloper)
app.post("/developers/:id/infos", verifyIdExist, verifyIsUnique, verifyEnumExist, createDeveloperInfo)
app.get("/developers/:id", verifyIdExist, getDeveloperById)
app.patch("/developers/:id", verifyIdExist, verifyEmailResgistred, patchDeveloper)
app.delete("/developers/:id", verifyIdExist, deleteDeveloper)

app.post("/projects",verifyIdExist, createProject)
app.get("/projects/:id", verifyIdExistPro, getProject)
app.patch("/projects/:id", verifyIdExistPro, verifyDevId, patchProject)
app.delete("/projects/:id", verifyIdExistPro, deleteProject)

app.post("/projects/:id/technologies", verifyIdExistPro, verifyTecName, verifyTecNameExists, createProjectsTechnologies)
app.delete("/projects/:id/technologies/:name", verifyIdExistPro, verifyTecName, verifyTecNameExists, dellTecFromProject)


export default app;
