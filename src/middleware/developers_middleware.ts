import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import {
  IDevelopers,
  TDeveloper_infosRequest,
  TDevelopersRequest,
} from "../interfaces/developers_interface";
import { client } from "../database";
import format from "pg-format";

const verifyIdExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: number = parseInt(req.params.id);

  if (req.route.path === "/projects" && req.method === "POST") {
    id = req.body.developerId;

    const queryString: string = `
    SELECT *
    FROM developers
    WHERE id = $1;
    `;

    const querConfig: QueryConfig = {
      text: queryString,
      values: [id],
    };

    const queryResults: QueryResult<IDevelopers> = await client.query(
      querConfig
    );

    if (queryResults.rowCount === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    return next();
  }

  const queryString: string = `
    SELECT *
    FROM developers
    WHERE id = $1;
    `;

  const querConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResults: QueryResult<IDevelopers> = await client.query(querConfig);

  if (queryResults.rowCount === 0) {
    return res.status(404).json({
      message: "Developer not found",
    });
  }
  return next();
};

const verifyIsUnique = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT *
    FROM developer_infos
    WHERE "developerId" = $1;
    `;

  const querConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResults: QueryResult<IDevelopers> = await client.query(querConfig);

  if (queryResults.rowCount !== 0) {
    return res.status(409).json({
      message: "Developer info already exists",
    });
  }
  return next();
};

const verifyEnumExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const reqData: TDeveloper_infosRequest = req.body;

  if (
    reqData.preferredOS !== "Windows" &&
    reqData.preferredOS !== "Linux" &&
    reqData.preferredOS !== "MacOS"
  ) {
    return res.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  return next();
};

const verifyEmailResgistred = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data: TDevelopersRequest = req.body;
  const id: number = parseInt(req.params.id);

  if (req.route.path === `/developers/${id}` && req.method === "PATCH") {
    data.email = req.body.email;
  }

  const queryString: string = format(`
    SELECT *
    FROM developers
    WHERE email = $1;
  `);

  const QueryConfig: QueryConfig = {
    text: queryString,
    values: [data.email],
  };

  const queryResult: QueryResult<IDevelopers> = await client.query(QueryConfig);

  if (queryResult.rowCount === 0) {
    return next();
  }
  return res.status(404).json({
    message: "Email aready registed",
  });
};

export {
  verifyIdExist,
  verifyIsUnique,
  verifyEnumExist,
  verifyEmailResgistred,
};
