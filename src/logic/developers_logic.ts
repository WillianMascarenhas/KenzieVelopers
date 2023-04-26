import {
  IDevInfo,
  IDeveloper_infos,
  IDevelopers,
  TDeveloper_infosRequest,
  TDevelopersRequest,
} from "../interfaces/developers_interface";
import { client } from "../database";
import { Request, Response, request, response } from "express";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: TDevelopersRequest = req.body;

  const queryString: string = format(
    `
    INSERT INTO 
    developers (%I)
    VALUES (%L)
    RETURNING *
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryResults: QueryResult<IDevelopers> = await client.query(
    queryString
  );

  return res.status(201).json(queryResults.rows[0]);
};

const createDeveloperInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerInfosData: TDeveloper_infosRequest = req.body;
  developerInfosData.developerId = parseInt(req.params.id);

  const queryString: string = format(
    `
    INSERT INTO 
    developer_infos (%I)
    VALUES (%L) 
    RETURNING * ;
    `,
    Object.keys(developerInfosData),
    Object.values(developerInfosData)
  );

  const queryResult: QueryResult<IDeveloper_infos> = await client.query(
    queryString
  );

  return res.status(201).json(queryResult.rows[0]);
};

const getDeveloperById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT 
    de.id "devloperId",
    de.name "developerName",
    de.email "developerEmail",
    di."developerSince" "developerInfoDeveloperSince",
    di."preferredOS" "developerInfoPreferredOS"
    FROM developers de
    LEFT JOIN developer_infos di
    ON de.id = di."developerId"
    WHERE de.id = $1 ;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDevInfo> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const patchDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const reqData: TDevelopersRequest = req.body;

  const queryString: string = format(
    `
    UPDATE developers 
    SET (%I) = ROW (%L)
    WHERE id = $1
    RETURNING * ;
    `,
    Object.keys(reqData),
    Object.values(reqData)
  );

  const querConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDevelopers> = await client.query(querConfig);

  return res.json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const queryString: string = `
    DELETE 
    FROM developers
    WHERE id = $1
    `;

  const QueryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(QueryConfig);

  return res.status(204).json();
};

export {
  createDeveloper,
  createDeveloperInfo,
  getDeveloperById,
  patchDeveloper,
  deleteDeveloper,
};
