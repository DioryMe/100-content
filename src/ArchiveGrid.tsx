import { MouseEventHandler, useEffect, useState } from "react";
import { getGridContents } from "./archiveGrid.util";

const ArchiveGrid = () => {
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
    const dioryArray = getGridContents();
    setDioryArray(dioryArray);
  }, []);

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
