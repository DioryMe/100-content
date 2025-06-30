import { Diograph } from "@diograph/diograph";
import { validateDiograph } from "@diograph/diograph/validator";
import { HttpClient } from "@diograph/http-client";
import { archiveRooms, basicAuthToken } from "./archiveRooms";
import { IDiographObject } from "@diograph/diograph/types";

const getArchiveDiographs = () => {
  return Promise.all(
    archiveRooms.map(async ({ address }) => {
      const httpClient = new HttpClient(address, { basicAuthToken });
      const diographContents = await httpClient.readTextItem("diograph.json");
      const diograph = JSON.parse(diographContents);
      validateDiograph(diograph);
      return diograph as IDiographObject;
    })
  );
};

export const getGlobalDiograph = async () => {
  const globalDiograph = await getArchiveDiographs().then((otherDiographs) => {
    const globalDiograph = otherDiographs.reduce((acc, other) => {
      acc.initialise(other);
      return acc;
    }, new Diograph());
    return globalDiograph;
  });
  return globalDiograph.toObject();
};
