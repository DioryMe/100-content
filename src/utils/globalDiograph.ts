import { Diograph } from "@diograph/diograph";
import { validateDiograph } from "@diograph/diograph/validator";
import { HttpClient } from "@diograph/http-client";
import archiveRoomsFixture from "./archiveRooms";
import { IDiographObject } from "@diograph/diograph/types";

const getArchiveDiographs = () => {
  const archiveRoomsJSON = localStorage.getItem("archiveRooms");
  try {
    const { archiveRooms, basicAuthToken } = archiveRoomsJSON
      ? JSON.parse(archiveRoomsJSON)
      : archiveRoomsFixture;
    return Promise.all(
      archiveRooms.map(async ({ address }) => {
        const httpClient = new HttpClient(address, { basicAuthToken });
        const diographContents = await httpClient.readTextItem("diograph.json");
        const diograph = JSON.parse(diographContents);
        validateDiograph(diograph);
        return diograph as IDiographObject;
      })
    );
  } catch (e) {
    console.log("Parsing or retrieving archive rooms failed!!");
    throw e;
  }
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
