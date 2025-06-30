import { useEffect, useState } from "react";
import { getGlobalDiograph } from "./utils/globalDiograph";
import { IDiographObject } from "@diograph/diograph/types";
import { Diograph } from "@diograph/diograph";
import { useLocation, useNavigate } from "react-router-dom";

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

  const filter =
    !urlParamFilter.dateStart && !urlParamFilter.latlngStart
      ? {
          dateStart: "2021-06-20",
          dateEnd: "2021-06-30",
          latlngStart: urlParamFilter.latlngStart || "",
          latlngEnd: urlParamFilter.latlngEnd || "",
        }
      : {
          dateStart: urlParamFilter.dateStart || "",
          dateEnd: urlParamFilter.dateEnd || "",
          latlngStart: urlParamFilter.latlngStart || "",
          latlngEnd: urlParamFilter.latlngEnd || "",
        };

  const filteredDiograph = diograph.queryDiographByDateAndGeo({
    latlngStart: filter.latlngStart,
    latlngEnd: filter.latlngEnd,
    dateStart: filter.dateStart,
    dateEnd: filter.dateEnd,
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

interface FilterState {
  dateStart?: string;
  dateEnd?: string;
  latlngStart?: string;
  latlngEnd?: string;
}

const ArchiveGrid = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(search);
  const dateStart = urlParams.get("filterDateStart");
  const dateEnd = urlParams.get("filterDateEnd");
  const latlngStart = urlParams.get("latlngStart");
  const latlngEnd = urlParams.get("latlngEnd");

  const [globalDiograph, setGlobalDiograph] = useState<IDiographObject>(null);
  const [dioryArray, setDioryArray] = useState([]);
  const [currentFilter, setCurrentFilter] = useState<FilterState>({});

  useEffect(() => {
    getGlobalDiograph().then((diograph) => {
      setGlobalDiograph(diograph);
    });
  }, []);

  // Load filter from localStorage on mount
  useEffect(() => {
    const storedFilter = localStorage.getItem("archiveFilter");
    if (storedFilter) {
      try {
        const parsed = JSON.parse(storedFilter);
        setCurrentFilter(parsed);
      } catch (e) {
        console.error("Failed to parse stored filter:", e);
      }
    }
  }, []);

  // Update filter when URL params change
  useEffect(() => {
    const newFilter: FilterState = {};
    if (dateStart) newFilter.dateStart = dateStart;
    if (dateEnd) newFilter.dateEnd = dateEnd;
    if (latlngStart) newFilter.latlngStart = latlngStart;
    if (latlngEnd) newFilter.latlngEnd = latlngEnd;

    if (Object.keys(newFilter).length > 0) {
      setCurrentFilter(newFilter);
      localStorage.setItem("archiveFilter", JSON.stringify(newFilter));
    }
  }, [dateStart, dateEnd, latlngStart, latlngEnd]);

  useEffect(() => {
    if (globalDiograph) {
      const gridDiograph = filterAndSortDiograph(globalDiograph, currentFilter);
      const gridContents = Object.values(gridDiograph).map((diory) => ({
        dioryId: diory.id,
        image: diory.image,
      }));
      setDioryArray(gridContents);
    }
  }, [globalDiograph, currentFilter]);

  const clearFilter = () => {
    setCurrentFilter({});
    localStorage.removeItem("archiveFilter");
    navigate("/archive");
  };

  const hasActiveFilter = Object.keys(currentFilter).length > 0;

  const formatFilterDisplay = () => {
    const parts = [];
    if (currentFilter.dateStart && currentFilter.dateEnd) {
      parts.push(`Date: ${currentFilter.dateStart} - ${currentFilter.dateEnd}`);
    }
    if (currentFilter.latlngStart && currentFilter.latlngEnd) {
      parts.push(
        `Geo: ${currentFilter.latlngStart} - ${currentFilter.latlngEnd}`
      );
    }
    return parts.join(" | ");
  };

  return (
    <>
      {hasActiveFilter && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "14px" }}>
            Active Filter: {formatFilterDisplay()}
          </span>
          <button
            onClick={clearFilter}
            style={{
              padding: "5px 10px",
              backgroundColor: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear Filter
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "5px 10px",
              backgroundColor: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Home
          </button>
        </div>
      )}
      <div style={gridStyle}>
        {dioryArray.map(({ dioryId, image }) => (
          // TODO: Archiven diory linkattaisiin /archive/diory/...
          <a key={dioryId} href={`/archive/diory/${dioryId}`}>
            <div key={dioryId} style={itemStyle as any}>
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
