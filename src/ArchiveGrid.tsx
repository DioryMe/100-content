import { useEffect, useState } from "react";
import { getGlobalDiograph } from "./utils/globalDiograph";
import { IDiographObject } from "@diograph/diograph/types";
import { Diograph } from "@diograph/diograph";
import { useLocation, useParams } from "react-router-dom";

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "10px",
  padding: "10px",
};
const itemStyle = {
  position: "relative",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "4px",
  overflow: "hidden",
};

const filterAndSortDiograph = (
  diographObject: IDiographObject,
  urlParamFilter?
) => {
  const diograph = new Diograph(diographObject);

  console.log("filter", urlParamFilter);

  const filter = {
    dateStart: urlParamFilter.dateStart || "2021-06-20",
    dateEnd: urlParamFilter.dateEnd || "2021-06-30",
    latlngStart: "",
    latlngEnd: "",
  };

  const filteredDiograph = diograph.queryDiographByDateAndGeo({
    latlngStart: filter.latlngStart,
    latlngEnd: filter.latlngEnd,
    dateStart: filter.dateStart,
    dateEnd: filter.dateEnd,
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

const ArchiveGrid = () => {
  const { search } = useLocation();
  const dateStart = new URLSearchParams(search).get("filterDateStart");
  const dateEnd = new URLSearchParams(search).get("filterDateEnd");

  const [globalDiograph, setGlobalDiograph] = useState<IDiographObject>(null);
  const [dioryArray, setDioryArray] = useState([]);

  useEffect(() => {
    getGlobalDiograph().then((diograph) => {
      setGlobalDiograph(diograph);
    });
  }, []);

  useEffect(() => {
    if (globalDiograph) {
      const gridDiograph = filterAndSortDiograph(globalDiograph, {
        dateStart,
        dateEnd,
      });
      const gridContents = Object.values(gridDiograph).map((diory) => ({
        dioryId: diory.id,
        image: diory.image,
      }));
      setDioryArray(gridContents);
    }
  }, [globalDiograph]);

  return (
    <>
      <div style={gridStyle}>
        {dioryArray.map(({ dioryId, image }) => (
          // TODO: Archiven diory linkattaisiin /archive/diory/...
          <a key={dioryId} href={`/archive/diory/${dioryId}`}>
            <div key={dioryId} style={itemStyle}>
              <img
                src={image}
                alt={dioryId}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default ArchiveGrid;
