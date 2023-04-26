interface IDevelopers {
  id: number;
  name: string;
  email: string;
}

type TDevelopersRequest = Omit<IDevelopers, "id">;

interface IDeveloper_infos {
  id: number;
  developerSince: string | Date;
  preferredOS: string;
  developerId?: number;
}

type TDeveloper_infosRequest = Omit<IDeveloper_infos, "id">;

interface IDevInfo {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date;
  developerInfoPreferredOS: string;
}

export {
  IDevelopers,
  TDevelopersRequest,
  IDeveloper_infos,
  TDeveloper_infosRequest,
  IDevInfo
};
