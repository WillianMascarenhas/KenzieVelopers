import { Request, Response } from "express";
import {
  IProjects,
  ITecnologie,
  TProjectsRequest,
  TTecnologieRequest,
} from "../interfaces/projects_interface";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: TProjectsRequest = req.body;

  const queryString: string = format(
    `
    INSERT INTO
    projects (%I)
    VALUES (%L)
    RETURNING * ;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: QueryResult<IProjects> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const getProject = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT p.id "projectId",
    p.name "projectName",
    p.description "projectDescription",
    p."estimatedTime" "projectEstimatedTime",
    p.repository "projectRepository",
    p."startDate" "projectStartDate",
    p."endDate" "projectEndDate",
    p."developerId" "projectDeveloperId",
    pt."technologyId" "technologyId" ,
    t.name "technologyName"
    FROM projects p
    LEFT JOIN projects_technologies pt ON p.id = pt."projectId"
    LEFT JOIN technologies t ON t.id = pt."technologyId"
    WHERE p.id = $1 ;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return res.status(201).json(queryResult.rows);
};

const patchProject = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const data: TProjectsRequest = req.body;

  const queryString: string = format(
    `
    UPDATE projects 
    SET (%I) = ROW (%L)
    WHERE id = $1
    RETURNING * ;
    `,
    Object.keys(data),
    Object.values(data)
  );

  const querConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProjects> = await client.query(querConfig);

  return res.json(queryResult.rows[0]);
};

const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    DELETE 
    FROM projects
    WHERE id = $1
    `;
  const querConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(querConfig);

  return res.status(204).json();
};

const createProjectsTechnologies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data: TTecnologieRequest = req.body;

  const queryString: string = format(`
    SELECT * 
    FROM technologies t
    WHERE t.name = $1
    `);

  const querConfig: QueryConfig = {
    text: queryString,
    values: [data.name],
  };

  const queryResult: QueryResult<ITecnologie> = await client.query(querConfig);

  const tecId: number = queryResult.rows[0].id;
  const projectId: number = parseInt(req.params.id);
  const date: Date = new Date();

  const queryString2: string = `
    INSERT INTO  projects_technologies ("addedIn", "technologyId", "projectId")
    VALUES ($1, $2, $3)
    RETURNING * ;
    `;
  const querConfig2: QueryConfig = {
    text: queryString2,
    values: [date, tecId, projectId],
  };

  await client.query(querConfig2);

  const queryString3: string = `
    SELECT 
    t.id "technologyId",
    t.name "technologyName",
    p.id "projectId",
    p.name "projectName",
    p.description "projectDescription",
    p."estimatedTime" "projectEstimatedTime",
    p.repository "projectRepository",
    p."startDate" "projectStartDate",
    p."endDate" "projectEndDate"
    FROM projects_technologies pt
    JOIN technologies t ON pt."technologyId" = t.id
    JOIN projects p ON pt."projectId" = p.id
    WHERE t.id = $1;
    `;

  const querConfig3: QueryConfig = {
    text: queryString3,
    values: [tecId],
  };

  const queryResult3: QueryResult = await client.query(querConfig3);
  const length: number = queryResult3.rows.length;
  return res.json(queryResult3.rows[length - 1]);
};

const dellTecFromProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const name: string = req.params.name;

  const getIdTecString: string = `
    SELECT *
    FROM technologies
    WHERE name = $1;
    `;

  const getIdTecConfig: QueryConfig = {
    text: getIdTecString,
    values: [name],
  };

  const getIdTecResult: QueryResult<ITecnologie> = await client.query(
    getIdTecConfig
  );

  const queryString: string = `
    DELETE FROM projects_technologies pt
    WHERE "technologyId" = $1 ;
    `;

  const querConfig: QueryConfig = {
    text: queryString,
    values: [getIdTecResult.rows[0].id],
  };

  await client.query(querConfig);

  return res.status(204).json();
};
export {
  createProject,
  getProject,
  patchProject,
  deleteProject,
  createProjectsTechnologies,
  dellTecFromProject,
};
