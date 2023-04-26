interface IProjects {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date;
  developerId: number;
}

type TProjectsRequest = Omit<IProjects, "id">;

interface ITecnologie {
  id: number
  name: string
}

type TTecnologieRequest = Omit<ITecnologie, "id">

export { IProjects, TProjectsRequest, ITecnologie, TTecnologieRequest };
