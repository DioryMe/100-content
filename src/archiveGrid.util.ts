import { IDiographObject } from "@diograph/diograph/types";
import { Diograph } from "@diograph/diograph";

export const filterAndSortDiograph = (diographObject: IDiographObject) => {
  const diograph = new Diograph(diographObject);

  const activeFilter = {
    dateStart: "2022-06-20",
    dateEnd: "2022-06-30",
    latlngStart: "",
    latlngEnd: "",
  };

  const filteredDiograph = diograph.queryDiographByDateAndGeo({
    latlngStart: activeFilter.latlngStart,
    latlngEnd: activeFilter.latlngEnd,
    dateStart: activeFilter.dateStart,
    dateEnd: activeFilter.dateEnd,
    // latlngStart: "61.48587998183945, 23.96633387857436",
    // latlngEnd: "61.385879805830584, 24.241258867230393",
  });

  const filteredAndSortedByDateDiograph = Object.values(filteredDiograph).sort(
    (dioryA, dioryB) => {
      const dioryADate = new Date(dioryA.date);
      const dioryBDate = new Date(dioryB.date);
      return dioryADate > dioryBDate ? 1 : -1;
    }
  );

  return filteredAndSortedByDateDiograph;
};
