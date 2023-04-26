import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import {
  IProjects,
  ITecnologie,
  TProjectsRequest,
  TTecnologieRequest,
} from "../interfaces/projects_interface";

const verifyIdExistPro = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT *
    FROM projects
    WHERE id = $1;
    `;

  const querConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResults: QueryResult<IProjects> = await client.query(querConfig);

  if (queryResults.rowCount === 0) {
    return res.status(404).json({
      message: "Projects not found",
    });
  }
  return next();
};

const verifyDevId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data: TProjectsRequest = req.body;

  const idDev: number = data.developerId;

  const queryString: string = `
    SELECT *
    FROM projects
    WHERE "developerId" = $1
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [idDev],
  };

  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Developer not found.",
    });
  }
  return next();
};

const verifyTecName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let data: TTecnologieRequest = req.body;

  if (
    req.route.path === `/projects/:id/technologies/:name` &&
    req.method === "DELETE"
  ) {
    data = {
      name: req.params.name,
    };
  }

  const queryString: string = `
    SELECT * 
    FROM technologies
    WHERE technologies.name = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [data.name],
  };

  const queryResult: QueryResult<ITecnologie> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }
  return next();
};

const verifyTecNameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data: TTecnologieRequest = req.body;

  const queryString: string = `
  SELECT *
  FROM projects_technologies pt
  JOIN technologies t ON pt."technologyId" = t.id
  WHERE t.name = $1;
  `;

  const querConfig: QueryConfig = {
    text: queryString,
    values: [data.name],
  };

  const queryResult: QueryResult<ITecnologie> = await client.query(querConfig);

  if (queryResult.rowCount === 0) {
    return next();
  }
  return res.status(400).json({
    message: "Technology not related to the project.",
  });
};

export { verifyIdExistPro, verifyDevId, verifyTecName, verifyTecNameExists };
