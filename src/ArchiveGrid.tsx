import { useEffect, useState } from "react";
import { filterAndSortDiograph } from "./archiveGrid.util";
import { getGlobalDiograph } from "./utils/globalDiograph";
import { IDiographObject } from "@diograph/diograph/types";

const ArchiveGrid = () => {
  const [globalDiograph, setGlobalDiograph] = useState<IDiographObject>(null);
  const [dioryArray, setDioryArray] = useState([]);

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

  useEffect(() => {
    getGlobalDiograph().then((diograph) => {
      setGlobalDiograph(diograph);
    });
  }, []);

  useEffect(() => {
    if (globalDiograph) {
      const gridDiograph = filterAndSortDiograph(globalDiograph);
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
          <a key={dioryId} href={`/diory/${dioryId}/content`}>
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
